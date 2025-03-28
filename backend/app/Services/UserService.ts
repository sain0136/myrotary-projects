import UserRepositories from "App/Repositories/UserRepositories";
import { IUser } from "App/Shared/Interfaces/IUser";
import {
  AuthenticationRequestData,
  SessionDetails,
} from "App/Utils/CommonTypes";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { validator } from "@ioc:Adonis/Core/Validator";

export default class UserService {
  /* In this UserService class, the UserRepositories class is injected into 
  it through the constructor. This is known as Constructor Injection. 
  The private userRepositories: UserRepositories syntax automatically
  creates and initializes a private field userRepositories in the class,
  which you can then use in your methods. */
  constructor(private userRepositories: UserRepositories) {}

  public async getAllUsers(
    isProspect: boolean,
    limit?: number,
    currentPage?: number,
    districtId?: number
  ) {
    const allUsers = await this.userRepositories.getAllUsers(
      isProspect,
      limit,
      currentPage,
      districtId
    );
    return allUsers;
  }

  public async authenticateUser(
    AuthenticationRequestData: AuthenticationRequestData,
    skipSession: boolean,
    details: SessionDetails
  ) {
    const userLoginData = await this.userRepositories.authenticateUser(
      AuthenticationRequestData,
      skipSession,
      details
    );
    return userLoginData;
  }

  public async getUser(userId: number) {
    const user = await this.userRepositories.getUser(userId);
    return user;
  }

  public async createUser(user: IUser, prospectUser: boolean) {
    await this.validateUser(user);
    return await this.userRepositories.createUser(user, prospectUser);
  }

  public async updateUser(user: IUser) {
    await this.validateUser(user);
    return await this.userRepositories.updateUser(user);
  }

  public async deleteUser(userId: number) {
    return await this.userRepositories.deleteUser(userId);
  }

  private async validateUser(user: IUser) {
    const userSchema = schema.create({
      firstname: schema.string(),
      lastname: schema.string(),
      email: schema.string({}, [rules.email()]),
      password: schema.string({}, [
        rules.minLength(10),
        rules.regex(/[a-z]/), // must contain a lowercase letter
        rules.regex(/[A-Z]/), // must contain an uppercase letter
        rules.regex(/\d/), // must contain a digit
        rules.regex(/[!@#\$%\^&\*]/), // must contain a special character
      ]),
    });
    await validator.validate({
      schema: userSchema,
      data: user,
    });
  }

  public async setInitialPassword(
    userId: number,
    otpUuid: string,
    password: string
  ): Promise<void> {
    await this.userRepositories.setInitialPassword(userId, otpUuid, password);
  }
}
