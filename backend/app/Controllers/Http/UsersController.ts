import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UserRepositories from "App/Repositories/UserRepositories";
import UserService from "App/Services/UserService";
import CustomException from "App/Exceptions/CustomException";
import Database from "@ioc:Adonis/Lucid/Database";
import { customErrorType } from "App/Utils/CommonTypes";

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
      await Database.from("non_existent_table").select("*");
      return response.json(allUsers);
    } catch (error) {
      throw new CustomException(error as customErrorType);
    }
  }
}
