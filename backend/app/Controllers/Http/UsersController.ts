import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UserRepositories from "App/Repositories/UserRepositories";
import UserService from "App/Services/UserService";
import CustomException from "App/Exceptions/CustomException";
import { CustomErrorType } from "App/Utils/CommonTypes";
import { IUser } from "App/Shared/Interfaces/IUser";
import { LogTools } from "App/Utils/AppLogger";
import MailController from "App/Controllers/Http/MailController";
import { LogManager } from "App/Utils/AppLogger";
import { logger } from "Config/app";

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
    const logger = new LogManager();
    try {
      const { userService } = this.initializeServices();
      const { userData, newSession } = await userService.authenticateUser({
        password,
        email,
        webAdmin,
      });
      if (userData) {
        session.put("userIsLoggedIn", true);
        session.put("session_id", newSession.sessionId);
      }

      logger.log(LogTools.LogTypes.ACCESS_LOG, {
        sourceUser: userData.user,
        event: LogTools.UserAccessEvent.LOGIN,
        outcome: "success",
        errorMessage: null,
      });
      return response.json({ ...userData });
    } catch (error) {
      logger.log(LogTools.LogTypes.ACCESS_LOG, {
        sourceUser: null,
        event: LogTools.UserAccessEvent.LOGIN,
        outcome: "fail",
        errorMessage: error,
        customMessage: `Email used: ${email}`,
      });
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async logout({ request, response }: HttpContextContract) {
    const logger = new LogManager();
    try {
      const user = request.body() as IUser;
      // session.clear();
      // try {
      //   const sessionId = this.getSessionID(session, request);
      //   if (sessionId) {
      //     const foundSession = await Session.findByOrFail(
      //       "session_id",
      //       sessionId
      //     );
      //     if (foundSession) {
      //       await foundSession.delete();
      //     }
      //   }
      // } catch (error) {
      //   logger.log(LogTools.LogTypes.ACCESS_LOG, {
      //     sourceUser: user,
      //     event: LogTools.UserAccessEvent.LOGOUT,
      //     outcome: "fail",
      //     errorMessage: error,
      //   });
      //   throw new CustomException(error as CustomErrorType);
      // }
      // if (!(session as any).store.isEmpty) {
      //   const errorMessage = `Error logging out user ${user.fullName}. Session not cleared`;
      //   logger.log(LogTools.LogTypes.ACCESS_LOG, {
      //     sourceUser: user,
      //     event: LogTools.UserAccessEvent.LOGOUT,
      //     outcome: "fail",
      //     errorMessage: errorMessage,
      //   });
      // }
      logger.log(LogTools.LogTypes.ACCESS_LOG, {
        sourceUser: user,
        event: LogTools.UserAccessEvent.LOGOUT,
        outcome: "success",
        errorMessage: null,
        customMessage: "User logged out sucessfully!",
      });
      return response.json({ message: "User logged out sucessfully!" });
    } catch (error) {
      logger.log(LogTools.LogTypes.ACCESS_LOG, {
        sourceUser: null,
        event: LogTools.UserAccessEvent.LOGOUT,
        outcome: "fail",
        errorMessage: error,
      });
      throw new CustomException(error as CustomErrorType);
    }
  }

  // private getSessionID( 
  //   session: SessionContract,
  //   request: RequestContract
  // ): string | undefined {
  //   let sessionId: string | undefined = undefined;
  //   if (session.get("session_id")) {
  //     sessionId = session.get("session_id");
  //   } else {
  //     sessionId = request.qs().sid;
  //   }
  //   return sessionId;
  // }

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
    const logger = new LogManager();
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
      logger.log(LogTools.LogTypes.USER_LOG, {
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
      logger.log(LogTools.LogTypes.USER_LOG, {
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
    const logger = new LogManager();
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
        logger.log(LogTools.LogTypes.USER_LOG, {
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
      logger.log(LogTools.LogTypes.USER_LOG, {
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
    const logger = new LogManager();
    try {
      const { userId, sourceUser } = request.only(["userId", "sourceUser"]) as {
        userId: number;
        sourceUser: IUser;
      };
      source = sourceUser;
      id = userId;
      const { userService } = this.initializeServices();
      const deletedUser = await userService.deleteUser(userId);
      logger.log(LogTools.LogTypes.USER_LOG, {
        sourceUser: sourceUser,
        targetUser: deletedUser,
        event: LogTools.UserEditEvent.DELETE,
        outcome: "success",
        errorMessage: null,
        customMessage: `User ${deletedUser.fullName} deleted`,
      });
      return response.json(true);
    } catch (error) {
      logger.log(LogTools.LogTypes.USER_LOG, {
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
}
