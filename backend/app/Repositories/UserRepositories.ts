import Users from "../Models/Users";

export default class UserRepositories {
  public async index() {
    const allUsers = await Users.all();
    return allUsers;
  }
}
