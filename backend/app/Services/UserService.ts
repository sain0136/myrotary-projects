import UserRepositories from "App/Repositories/UserRepositories";
import { IUser } from "App/Shared/Interfaces/IUser";
import { AuthenticationRequestData } from "App/Utils/CommonTypes";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { validator } from "@ioc:Adonis/Core/Validator";

export default class UserService {
  /* In this UserService class, the UserRepositories class is injected into 
  it through the constructor. This is known as Constructor Injection. 
  The private userRepositories: UserRepositories syntax automatically
  creates and initializes a private field userRepositories in the class,
  which you can then use in your methods. */
  constructor(private userRepositories: UserRepositories) {}

  public async index() {
    const allUsers = await this.userRepositories.index();
    return allUsers;
  }

  public async authenticateUser(
    AuthenticationRequestData: AuthenticationRequestData
  ) {
    const userLoginData = await this.userRepositories.authenticateUser(
      AuthenticationRequestData
    );
    return userLoginData;
  }

  public async getUser(userId: number) {
    const user = await this.userRepositories.getUser(userId);
    return user;
  }

  public async createUser(user: IUser) {
    await this.validateUser(user);
    await this.userRepositories.createUser(user);
  }

  public async updateUser(user: IUser) {
    await this.validateUser(user);
    await this.userRepositories.updateUser(user);
  }

  public async deleteUser(userId: number) {
    await this.userRepositories.deleteUser(userId);
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
}
