import UserRepositories from "../Repositories/UserRepositories";

export default class UserService {
  /* In this UserService class, the UserRepositories class is injected into 
  it through the constructor. This is known as Constructor Injection. 
  The private userRepositories: UserRepositories syntax automatically
  creates and initializes a private field userRepositories in the class,
  which you can then use in your methods. */
  constructor(private userRepositories: UserRepositories) {}

  public async index() {
    const allUsers = await this.userRepositories.index();
    for await (const user of allUsers) {
      if (user.userType === "CLUB") {
        user.role = user.role = await user
          .related("clubRole")
          .pivotQuery()
          .where({ user_id: user.userId });
      } else {
        user.role = await user
          .related("districtRole")
          .pivotQuery()
          .where({ user_id: user.userId });
      }
    }
    return allUsers;
  }
}
