import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UserRepositories from "App/Repositories/UserRepositories";
import UserService from "App/Services/UserService";
import CustomException from "App/Exceptions/CustomException";
import { CustomErrorType } from "App/Utils/CommonTypes";
import { DateTime } from "luxon";
import { IUser } from "App/Shared/Interfaces/IUser";

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
      return response.json(userData);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async logout({ session, response }: HttpContextContract) {
    session.clear();
    if (!(session as any).store.isEmpty) {
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
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const user: IUser = request.input("user");
      const { userService } = this.initializeServices();
      await userService.store(user);
      return response.json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async updateUser({ request, response }: HttpContextContract) {
    try {
      const user: IUser = request.input("user");
      const { userService } = this.initializeServices();
      await userService.updateUser(user);
      return response.json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async delete({ params, response }: HttpContextContract) {
    try {
      const userId: number = params.userId;
      const { userService } = this.initializeServices();
      await userService.delete(userId);
      return response.json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }
}
