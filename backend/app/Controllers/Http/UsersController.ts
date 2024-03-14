import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UserRepositories from "App/Repositories/UserRepositories";
import UserService from "App/Services/UserService";
import CustomException from "App/Exceptions/CustomException";
import { CustomErrorType, genericLogData } from "App/Utils/CommonTypes";
import { DateTime } from "luxon";
import { IUser } from "App/Shared/Interfaces/IUser";
import { appLogger } from "App/Utils/AppLogger";
import Users from "App/Models/Users";

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
      await appLogger("access_log", userData.user);
      return response.json(userData);
    } catch (error) {
      appLogger("access_log", error as CustomErrorType);
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async logout({ request, session, response }: HttpContextContract) {
    try {
      const user = request.body() as Users;
      const log: genericLogData = {
        status: "success",
        message: `User ${user.fullName} with email ${user.email} logged out successfully`,
      };
      appLogger("access_log", log);
      session.clear();
      if (!(session as any).store.isEmpty) {
        const loggerData: genericLogData = {
          status: "failed",
          message: `Error logging out user ${user.fullName}. Session not cleared`,
        };
        appLogger("access_log", loggerData);
      }
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
