import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UserRepositories from "App/Repositories/UserRepositories";
import UserService from "App/Services/UserService";
import CustomException from "App/Exceptions/CustomException";
import { CustomErrorType, genericLogData } from "App/Utils/CommonTypes";
import { DateTime } from "luxon";
import { IUser } from "App/Shared/Interfaces/IUser";
import { appLogger } from "App/Utils/AppLogger";
import MailController from "App/Controllers/Http/MailController";
import Session from "App/Models/Session";

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

  public async authenticateUser({
    request,
    response,
    session,
  }: HttpContextContract) {
    const password: string = request.input("password");
    const email: string = request.input("email");
    const webAdmin: boolean = request.input("webAdmin");
    try {
      const { userService } = this.initializeServices();
      const userData = await userService.authenticateUser({
        password,
        email,
        webAdmin,
      });
      if (userData) {
        session.put("userIsLoggedIn", true);
        session.put("lastApiCallTimeStamp", DateTime.now().toMillis());
        session.put("user_id", userData.user.userId);
      }
      await appLogger("access_log", userData.user);
      return response.json(userData);
    } catch (error) {
      appLogger("access_log", error as CustomErrorType);
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async logout({ request, session, response }: HttpContextContract) {
    try {
      const user = request.body() as IUser;
      session.clear();

      try {
        const foundSession = await Session.findByOrFail("user_id", user.user_id);
        if (foundSession) {
          await foundSession.delete();
        }   
      } catch (error) {
        const log: genericLogData = {
          status: "failed",
          message: `Error deleting session for user ${user.fullName} with email ${user.email}`,
        };
        appLogger("access_log", log);
      }
      
      const log: genericLogData = {
        status: "success",
        message: `User ${user.fullName} with email ${user.email} logged out successfully`,
      };
      if (!(session as any).store.isEmpty) {
        const loggerData: genericLogData = {
          status: "failed",
          message: `Error logging out user ${user.fullName}. Session not cleared`,
        };
        appLogger("access_log", loggerData);
      }
      appLogger("access_log", log);
      return response.json({});
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
    try {
      const user = request.body() as IUser;
      const prospectUser = user.is_prospect ? true : false;
      const { userService } = this.initializeServices();
      const districtAdminsToEmail = await userService.createUser(
        user,
        prospectUser
      );
      appLogger("user_log", {
        status: "success",
        message: `User ${user.fullName} created successfully.${
          prospectUser ? " This is a prospective user." : ""
        }`,
      } as genericLogData);
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
        return response.json(true);
      }
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async updateUser({ request, response }: HttpContextContract) {
    try {
      const user = request.body() as IUser;
      const { userService } = this.initializeServices();
      const result = await userService.updateUser(user);
      if (result) {
        appLogger("user_log", {
          status: "success",
          message: `Prospective ${user.fullName} approved and updated into a full user`,
        } as genericLogData);
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
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async deleteUser({ request, response }: HttpContextContract) {
    try {
      const userId: number = request.input("userId");
      const { userService } = this.initializeServices();
      await userService.deleteUser(userId);
      return response.json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }
}
