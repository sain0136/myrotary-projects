import UserRepositories from "../Repositories/UserRepositories";
import { AuthenticationRequestData } from "App/Utils/CommonTypes";

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
}
