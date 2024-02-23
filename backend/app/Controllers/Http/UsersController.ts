import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UserRepositories from "App/Repositories/UserRepositories";
import UserService from "App/Services/UserService";
import CustomException from "App/Exceptions/CustomException";
import { CustomErrorType, loginLogData } from "App/Utils/CommonTypes";
import { DateTime } from "luxon";
import { IUser } from "App/Shared/Interfaces/IUser";
import { appLogger } from "App/Utils/AppLogger";

export default class UsersController {
  private initializeServices() {
    const userRepositories = new UserRepositories();
    const userService = new UserService(userRepositories);
    return { userRepositories, userService };
  }

  public async index({ response }: HttpContextContract) {
    try {
      const { userService } = this.initializeServices();
      const allUsers = await userService.index();
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
        // if (!session.get("userIsLoggedIn")) {
        session.put("userIsLoggedIn", true);
        session.put("lastApiCallTimeStamp", DateTime.now().toMillis());
      }
      const loggerData: loginLogData = {
        type: "login",
        loginStatus: "success",
        user: {
          userId: userData.user.userId ?? "error",
          email: email ?? "error",
          name: userData.user.fullName ?? "error",
        },
      };
      await appLogger("login", loggerData);
      return response.json(userData);
    } catch (error) {
      const loggerData: loginLogData = {
        type: "login",
        loginStatus: "failed",
        user: {
          userId: "failed-login",
          email: email,
          name: "failed-login",
        },
      };
      appLogger("login", loggerData);
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async logout({ session, response }: HttpContextContract) {
    try {
      const loggerData: loginLogData = {
        type: "logout",
        loginStatus: "success",
      };
      appLogger("login", loggerData);
      session.clear();
      if (!(session as any).store.isEmpty) {
        loggerData.loginStatus = "failed";
        appLogger("login", loggerData);
        throw new CustomException({
          message: "Error logging out",
          status: 605,
          translatedMessage: {
            en: "Error logging out",
            fr: "Erreur de déconnexion",
          },
        });
      }
      return response.json({});
    } catch (error) {}
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
      const { userService } = this.initializeServices();
      await userService.createUser(user);
      return response.json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async updateUser({ request, response }: HttpContextContract) {
    try {
      const user = request.body() as IUser;
      const { userService } = this.initializeServices();
      await userService.updateUser(user);
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
