import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UserRepositories from "App/Repositories/UserRepositories";
import UserService from "App/Services/UserService";
import CustomException from "App/Exceptions/CustomException";
import { CustomErrorType, SessionDetails } from "App/Utils/CommonTypes";
import { IUser } from "App/Shared/Interfaces/IUser";
import MailController from "App/Controllers/Http/MailController";
import Session from "App/Models/Session";
import Event from "@ioc:Adonis/Core/Event";
import { ResponseContract } from "@ioc:Adonis/Core/Response";
import { sseRegisteredUsers, sendSseData } from "App/Utils/sseRegistar";
import Clubs from "App/Models/Clubs";
import { v4 as uuidv4 } from "uuid";
import Otp from "App/Models/Otp";
import { DateTime } from "luxon";

export default class UsersController {
  private initializeServices() {
    const userRepositories = new UserRepositories();
    const userService = new UserService(userRepositories);
    return { userRepositories, userService };
  }

  public async getAllUsers({ request, response }: HttpContextContract) {
    try {
      const isProspect: boolean = request.input("isProspect");
      const limit: number | undefined = request.input("limit"); // it's optional, so it might be undefined
      const currentPage: number | undefined = request.input("currentPage");
      const districtId: number | undefined = request.input("districtId");
      const { userService } = this.initializeServices();
      const allUsers = await userService.getAllUsers(
        isProspect,
        limit,
        currentPage,
        districtId
      );
      return response.json(allUsers);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async authenticateUser({ request, response }: HttpContextContract) {
    const password: string = request.input("password");
    const email: string = request.input("email");
    const webAdmin: boolean = request.input("webAdmin");
    const userAgent = request.header("user-agent") ?? "Unknown User Agent";
    const referrer = request.header("referer") ?? "Unknown Referrer";
    const details: SessionDetails = { userAgent, referrer };
    try {
      const { userService } = this.initializeServices();
      const { chromeDev } = request.qs(); // For dev enviroment and chrome browser we don't use a session. Test session in firefox
      const { userData, newSession } = await userService.authenticateUser(
        {
          password,
          email,
          webAdmin,
        },
        chromeDev ? true : false,
        details
      );
      // Assign session
      if (userData && newSession && !chromeDev) {
        response.cookie("session_id", {
          value: newSession.sessionId,
          lastActivity: new Date().toISOString(),
        });
      }
      Event.emit("login", userData.user);
      return response.json({ ...userData });
    } catch (error) {
      if (error.status === 404) {
        response.status(error.status).send({
          statusCode: error.status,
          rawMessage: error.sqlMessage ? error.sqlMessage : error.message,
          translatedMessage:
            error.translatedMessage ??
            "Something went wrong. Please try again later.",
        });
      }
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async logout({ request, response }: HttpContextContract) {
    try {
      const user = request.body() as IUser;
      await this.unsubscribeFromServerSentEvents(user);

      const sessionId: undefined | { value: string; lastActivity: string } =
        request.cookie("session_id");

      if (!sessionId?.value) {
        return response.json({ message: "User logged out sucessfully!" });
      }
      const userSession = await Session.findByOrFail(
        "session_id",
        sessionId.value
      );
      if (userSession) {
        await userSession.delete();
        response.clearCookie("session_id");
      } else {
        throw new CustomException({
          message: "Session not found in database",
          status: 601,
        });
      }
      return response.json({ message: "User logged out sucessfully!" });
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async getUser({ request, response }: HttpContextContract) {
    try {
      const userId: number = request.input("userId");
      const { userService } = this.initializeServices();
      const user = await userService.getUser(userId);
      return response.json(user);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async createUser({ request, response }: HttpContextContract) {
    //De-structuring the request body to handle the source and target user
    const { user, sourceUser } = request.only(["user", "sourceUser"]) as {
      user: IUser;
      sourceUser: IUser;
    };
    try {
      const prospectUser = user.is_prospect ? true : false;
      const { userService } = this.initializeServices();
      const { districtAdminsToEmail, createdUser } =
        await userService.createUser(user, prospectUser);
      const fullName =
        user.firstname && user.lastname
          ? user.firstname + " " + user.lastname
          : user.email;
      if (prospectUser) {
        const mailController = new MailController();
        let mailBodyMessage = `<strong>Hello ${fullName}, your account is pending approval. You will be notified when your account is approved. / Bonjour ${fullName}, votre compte est en attente d'approbation. Vous serez informé lorsque votre compte sera approuvé.</strong>`;
        if (districtAdminsToEmail && districtAdminsToEmail.length > 0) {
          mailBodyMessage += `<p>District Admins to contact for questions / Administrateurs de district à contacter pour des questions :</p>`;
          mailBodyMessage += districtAdminsToEmail
            .map((text) => {
              return text;
            })
            .join("");
        }
        mailController.sendMail(
          {
            subject:
              "Welcome to MyRotaryProjects. Your account is pending approval. / Bienvenue sur MyRotaryProjects. Votre compte est en attente d'approbation.",
            receiverEmail: user.email,
            messageBody: {
              message: mailBodyMessage,
            },
          },
          mailBodyMessage
        );
      }
      return response.json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async updateUser({ request, response }: HttpContextContract) {
    try {
      //De-structuring the request body to handle the source and target user
      const { user, sourceUser } = request.only(["user", "sourceUser"]) as {
        user: IUser;
        sourceUser: IUser;
      };
      const { userService } = this.initializeServices();
      const { updatedUser, prospectApproved } = await userService.updateUser(
        user
      );
      if (updatedUser) {
        const customMessage = prospectApproved
          ? `Prospective ${updatedUser.fullName} approved and updated into a full user`
          : `User ${updatedUser.fullName} updated`;
      }
      if (prospectApproved) {
        let requestOrigin =
          request.header("origin") ||
          request.header("referer") ||
          "https://myrotaryprojects.org";
        requestOrigin = requestOrigin.replace(/\/$/, ""); // Remove trailing slash
        await notifyUserAccountApproval(user, requestOrigin);
      }
      return response.json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async deleteUser({ request, response }: HttpContextContract) {
    let source: IUser | null = null;
    let id: number | null = null;
    try {
      const { userId, sourceUser } = request.only(["userId", "sourceUser"]) as {
        userId: number;
        sourceUser: IUser;
      };
      source = sourceUser;
      id = userId;
      const { userService } = this.initializeServices();
      const deletedUser = await userService.deleteUser(userId);
      return response.json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async deleteProspectUser({ request, response }: HttpContextContract) {
    try {
      const user = request.body() as IUser;
      const { userService } = this.initializeServices();
      await userService.deleteUser(user.user_id);
      if (user.is_prospect) {
        const mailController = new MailController();
        let mailBodyMessage = `<strong>Hello ${user.fullName}, your account was not approved and has been deleted. / Bonjour ${user.fullName}, votre compte a été supprimé. </strong>`;
        mailController.sendMail(
          {
            subject:
              "MyRotaryProjects. Your account was not approved. / MyRotaryProjects. Votre compte n'a pas été approuvé.",
            receiverEmail: user.email,
            messageBody: {
              message: mailBodyMessage,
            },
          },
          mailBodyMessage
        );
      }
      return response.json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async serverSentEventsInit({
    request,
    response,
  }: HttpContextContract) {
    try {
      response.response.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
      });

      const queryParams = request.params();
      if (!queryParams.userId || !queryParams.districtId) {
        throw new CustomException({
          message: "Missing required parameters for server sent events",
          status: 400,
        });
      }

      const userCompositeKey = `${queryParams.userId}_${queryParams.districtId}`;
      sseRegisteredUsers.set(userCompositeKey, response);
      setInterval(() => {
        sendSseData(userCompositeKey, { data: "PING" });
      }, 5000);
      return response.response.write(
        `data: ${JSON.stringify({ data: "Initialized" })}\n\n`
      );
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async unsubscribeFromServerSentEvents(user: IUser): Promise<void> {
    let userKey: string | null = null;

    if (user.district_id) {
      userKey = `${user.user_id}_${user.district_id}`;
    } else if (user.club_id) {
      const club = await Clubs.findBy("club_id", user.club_id);
      userKey = `${user.user_id}_${club?.districtId}`;
    }

    if (userKey && sseRegisteredUsers.has(userKey)) {
      const response = sseRegisteredUsers.get(userKey) as ResponseContract;
      response.finish();
      sseRegisteredUsers.delete(userKey);
    }
  }

  public async setInitialPassword({ request, response }: HttpContextContract) {
    try {
      const { otpUuid, userId, password } = request.only([
        "otpUuid",
        "userId",
        "password",
      ]);
      const { userService } = this.initializeServices();
      await userService.setInitialPassword(userId, otpUuid, password);
      return response.json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }
}

async function notifyUserAccountApproval(user: IUser, origin: string) {
  const mailController = new MailController();
  const uuidForUser = uuidv4();
  const date = DateTime.now().plus({ days: 1 }).toISO() ?? undefined;
  await Otp.create({
    otpUuid: uuidForUser,
    expiryDate: date, // Convert to ISO string
    userId: user.user_id,
  });
  const setPasswordUrl = `${origin}/password-set?token=${uuidForUser}&userId=${user.user_id}`;
  let mailBodyMessage = `
  <strong>Hello ${user.fullName}, your account has been approved. You can now log in to your account.</strong>
  <p>Please set your password by clicking the link below. This link will expire in 24 hours. If the link expires, please contact an admin for assistance:</p>
  <a href="${setPasswordUrl}">Set your password</a>
  <br><br>
  <strong>Bonjour ${user.fullName}, votre compte a été approuvé. Vous pouvez maintenant vous connecter à votre compte.</strong>
  <p>Veuillez définir votre mot de passe en cliquant sur le lien ci-dessous. Ce lien expirera dans 24 heures. Si le lien expire, veuillez contacter un administrateur pour obtenir de l'aide :</p>
  <a href="${setPasswordUrl}">Définir votre mot de passe</a>
`;
  mailController.sendMail(
    {
      subject:
        "Welcome to MyRotaryProjects. Your account has been approved. / Bienvenue sur MyRotaryProjects. Votre compte a été approuvé.",
      receiverEmail: user.email,
      messageBody: {
        message: mailBodyMessage,
      },
    },
    mailBodyMessage
  );
}
