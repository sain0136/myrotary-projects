import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { ResponseContract } from "@ioc:Adonis/Core/Response";
import UserRepositories from "App/Repositories/UserRepositories";
import UserService from "App/Services/UserService";
import CustomException from "App/Exceptions/CustomException";
import { CustomErrorType, SessionDetails } from "App/Utils/CommonTypes";
import { IUser } from "App/Shared/Interfaces/IUser";
import { LogTools } from "App/Utils/AppLogger";
import MailController from "App/Controllers/Http/MailController";
import { LogManager } from "App/Utils/AppLogger";
import Session from "App/Models/Session";
import Event from "@ioc:Adonis/Core/Event";

export default class UsersController {
  private logManager: LogManager;

  constructor() {
    this.logManager = new LogManager();
  }

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
      this.logManager.log(LogTools.LogTypes.ACCESS_LOG, {
        sourceUser: userData.user,
        event: LogTools.UserAccessEvent.LOGIN,
        outcome: "success",
        errorMessage: null,
      });
      Event.emit("login", userData.user);
      return response.json({ ...userData });
    } catch (error) {
      this.logManager.log(LogTools.LogTypes.ACCESS_LOG, {
        sourceUser: null,
        event: LogTools.UserAccessEvent.LOGIN,
        outcome: "fail",
        errorMessage: error,
        customMessage: `Email used: ${email}`,
      });
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

      this.logManager.log(LogTools.LogTypes.ACCESS_LOG, {
        sourceUser: user,
        event: LogTools.UserAccessEvent.LOGOUT,
        outcome: "success",
        errorMessage: null,
        customMessage: "User logged out sucessfully!",
      });
      return response.json({ message: "User logged out sucessfully!" });
    } catch (error) {
      this.logManager.log(LogTools.LogTypes.ACCESS_LOG, {
        sourceUser: null,
        event: LogTools.UserAccessEvent.LOGOUT,
        outcome: "fail",
        errorMessage: error,
      });
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
      if (prospectUser) {
        const mailController = new MailController();
        let mailBodyMessage = `<strong>Hello ${user.fullName}, your account is pending approval. You will be notified when your account is approved. / Bonjour ${user.fullName}, votre compte est en attente d'approbation. Vous serez informé lorsque votre compte sera approuvé.</strong>`;
        if (districtAdminsToEmail && districtAdminsToEmail.length > 0) {
          mailBodyMessage += `<p>District Admins to contact for questions: / Administrateurs de district à contacter pour des questions:</p>`;
          mailBodyMessage += districtAdminsToEmail.map((text) => {
            return text;
          });
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
      this.logManager.log(LogTools.LogTypes.USER_LOG, {
        sourceUser: sourceUser,
        targetUser: createdUser,
        event: LogTools.UserEditEvent.CREATE,
        outcome: "success",
        errorMessage: null,
        customMessage: createdUser.isProspect
          ? `Prospective ${createdUser.fullName} created`
          : `User ${createdUser.fullName} created`,
      });
      return response.json(true);
    } catch (error) {
      this.logManager.log(LogTools.LogTypes.USER_LOG, {
        sourceUser: sourceUser,
        targetUser: user,
        event: LogTools.UserEditEvent.CREATE,
        outcome: "fail",
        errorMessage: error,
        customMessage: `User ${
          user.firstname + " " + user.lastname
        } creation failed`,
      });
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
        this.logManager.log(LogTools.LogTypes.USER_LOG, {
          sourceUser: sourceUser,
          targetUser: user,
          event: LogTools.UserEditEvent.UPDATE,
          outcome: "success",
          errorMessage: null,
          customMessage: customMessage,
        });
      }
      const mailController = new MailController();
      let mailBodyMessage = `<strong>Hello ${user.fullName}, your account has been approved. You can now log in to your account. / Bonjour ${user.fullName}, votre compte a été approuvé. Vous pouvez maintenant vous connecter à votre compte.</strong>`;
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
      return response.json(true);
    } catch (error) {
      this.logManager.log(LogTools.LogTypes.USER_LOG, {
        sourceUser: null,
        targetUser: null,
        event: LogTools.UserEditEvent.UPDATE,
        outcome: "fail",
        errorMessage: error,
      });
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
      this.logManager.log(LogTools.LogTypes.USER_LOG, {
        sourceUser: sourceUser,
        targetUser: deletedUser,
        event: LogTools.UserEditEvent.DELETE,
        outcome: "success",
        errorMessage: null,
        customMessage: `User ${deletedUser.fullName} deleted`,
      });
      return response.json(true);
    } catch (error) {
      this.logManager.log(LogTools.LogTypes.USER_LOG, {
        sourceUser: source,
        targetUser: null,
        event: LogTools.UserEditEvent.DELETE,
        outcome: "fail",
        errorMessage: error,
        customMessage: `User deletion failed for user id: ${id}`,
      });
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

  sseRegisteredUsers = new Map<string, ResponseContract>();
  
  public async serverSentEventsInit({ response }: HttpContextContract) {
    try {
      console.log("Server Sent Events Initiated");
      response.header("Content-Type", "text/event-stream");
      response.header("Cache-Control", "no-cache");
      response.header("Connection", "keep-alive");

      function sseRandom(res: ResponseContract) {
        res.send(`data: ${Math.random()}\n\n`);
        setTimeout(() => sseRandom(res), Math.random() * 3000);
      }

      sseRandom(response);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }
}
