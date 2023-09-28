import Hash from "@ioc:Adonis/Core/Hash";
import CustomException from "App/Exceptions/CustomException";
import Clubs from "App/Models/Clubs";
import Districts from "App/Models/Districts";
import Users from "App/Models/Users";
import { errorTranslations } from "App/Translations/Translations";
import { AuthenticationRequestData } from "App/Utils/CommonTypes";

export default class UserRepositories {
  public async index() {
    const allUsers = await Users.all();
    return allUsers;
  }

  public async authenticateUser(userCredentials: AuthenticationRequestData) {
    const authenticatedUserEmail = await Users.query()
      .select()
      .where({ email: userCredentials.email });
    if (authenticatedUserEmail.length < 1) {
      const message = "Invalid email";
      const status = 404;
      const translatedMessage = errorTranslations.emailAlreadyExists;
      throw new CustomException({ message, status, translatedMessage });
    }
    const user = authenticatedUserEmail[0];
    if (await Hash.verify(user.password, userCredentials.password)) {
      // TODO: See if the check for his email is security risk should be env variable
      if (
        userCredentials.webAdmin &&
        user.email !== "admin@myrotaryrotaryprojects.com"
      ) {
        throw new CustomException({
          message: "Invalid credentials",
          status: 401,
          translatedMessage: errorTranslations.badCredentials,
        });
      }
      return await this.addUserRoles(user);
    } else {
      const message = "Invalid password";
      const status = 404;
      const translatedMessage = errorTranslations.badCredentials;
      throw new CustomException({ message, status, translatedMessage });
    }
  }

  private async addUserRoles(user: Users) {
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
    let district = user.districtId
      ? await Districts.findOrFail(user.districtId)
      : undefined;
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
    let club: Clubs = await Clubs.findOrFail(user.clubId);
    return {
      user,
      district,
      club,
    };
  }
}
