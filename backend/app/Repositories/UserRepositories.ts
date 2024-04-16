import Hash from "@ioc:Adonis/Core/Hash";
import CustomException from "App/Exceptions/CustomException";
import Clubs from "App/Models/Clubs";
import Districts from "App/Models/Districts";
import Projects from "App/Models/Projects";
import Users from "App/Models/Users";
import { IRoles, IUser } from "App/Shared/Interfaces/IUser";
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
    if(user.isProspect){
      throw new CustomException({
        message: "Login not allowed for prospect users",
        status: 403,
        translatedMessage: errorTranslations.loginNotAllowed,
      });
    }
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
  /**
   * Adds user roles to the user object.
   *
   * @param {Users} user - The user object to add roles to.
   * @return {Promise<{user: Users, district: Districts | undefined, club: Clubs}>} - A promise that resolves to an object containing the updated user, district, and club properties.
   */
  public async addUserRoles(
    user: Users
  ): Promise<{ user: Users; district: Districts | undefined; club: Clubs }> {
    let roleTitle: Array<IRoles>;
    if (user.userType === "CLUB") {
      roleTitle = await user
        .related("clubRole")
        .pivotQuery()
        .where({ user_id: user.userId });
    } else {
      roleTitle = await user
        .related("districtRole")
        .pivotQuery()
        .where({ user_id: user.userId });
    }
    user.role = roleTitle[0].club_role || roleTitle[0].district_role;
    let district: Districts | undefined;
    if (user.districtId) {
      district = await Districts.findOrFail(user.districtId);
    }
    // User should Always have a clubid at least
    const club = await Clubs.findOrFail(user.clubId);
    return {
      user,
      district,
      club,
    };
  }

  public async getUser(userId: number) {
    const user = await Users.findOrFail(userId);
    let roleTitle: Array<IRoles>;
    if (user.userType === "CLUB") {
      roleTitle = await user
        .related("clubRole")
        .pivotQuery()
        .where({ user_id: user.userId });
    } else {
      roleTitle = await user
        .related("districtRole")
        .pivotQuery()
        .where({ user_id: user.userId });
    }
    user.role = roleTitle[0].club_role || roleTitle[0].district_role;
    return user;
  }

  public async createUser(user: IUser) {
    if (
      (!user.user_type && user.user_type !== "CLUB") ||
      (!user.role_type && user.role_type !== "DISTRICT")
    ) {
      throw new CustomException({
        message: "Malformed user",
        status: 505,
        translatedMessage: {
          en: "Malformed user",
          fr: "Malformé utilisateur",
        },
      });
    }
    const createdUser = await Users.create({
      firstname: user.firstname,
      lastname: user.lastname,
      address: user.address,
      userCity: user.user_city,
      userPostal: user.user_postal,
      userProvince: user.user_province,
      userCountry: user.user_country,
      phone: user.phone,
      email: user.email,
      password: user.password,
      clubId: user.club_id,
      districtId:
        user.district_id && user.district_id > 0 ? user.district_id : undefined,
      userType: user.user_type,
      extraDetails: JSON.stringify(user.extra_details),
    });
    if (createdUser.userType === "DISTRICT") {
      const district = await Districts.findOrFail(createdUser.districtId);
      await createdUser.related("districtRole").attach({
        [district.districtId]: {
          district_role: user.role_type,
        },
      });
    } else {
      const club = await Clubs.findOrFail(createdUser.clubId);
      await createdUser.related("clubRole").attach({
        [club.clubId]: {
          club_role: user.role_type,
        },
      });
    }
  }

  //Very similar to createUser, except we're passing the optional prop isProspect
  public async createProspectUser(user: IUser) {
    if (
      (!user.user_type && user.user_type !== "CLUB") ||
      (!user.role_type && user.role_type !== "DISTRICT")
    ) {
      throw new CustomException({
        message: "Malformed user",
        status: 505,
        translatedMessage: {
          en: "Malformed user",
          fr: "Malformé utilisateur",
        },
      });
    }
    const createdUser = await Users.create({
      firstname: user.firstname,
      lastname: user.lastname,
      address: user.address,
      userCity: user.user_city,
      userPostal: user.user_postal,
      userProvince: user.user_province,
      userCountry: user.user_country,
      isProspect: user.is_prospect,
      phone: user.phone,
      email: user.email,
      password: user.password,
      clubId: user.club_id,
      districtId:
        user.district_id && user.district_id > 0 ? user.district_id : undefined,
      userType: user.user_type,
      extraDetails: JSON.stringify(user.extra_details),
    });
    if (createdUser.userType === "DISTRICT") {
      const district = await Districts.findOrFail(createdUser.districtId);
      await createdUser.related("districtRole").attach({
        [district.districtId]: {
          district_role: user.role_type,
        },
      });
    } else {
      const club = await Clubs.findOrFail(createdUser.clubId);
      await createdUser.related("clubRole").attach({
        [club.clubId]: {
          club_role: user.role_type,
        },
      });
    }
  }

  public async updateUser(user: IUser) {
    const existingUser = await Users.findOrFail(user.user_id);
    const updatedUser = await existingUser
      .merge({
        firstname: user.firstname,
        lastname: user.lastname,
        address: user.address,
        userCity: user.user_city,
        userPostal: user.user_postal,
        userProvince: user.user_province,
        userCountry: user.user_country,
        phone: user.phone,
        email: user.email,
        password: user.password,
        clubId: user.club_id,
        districtId: user.district_id ? user.district_id : undefined,
        userType: user.user_type,
        isProspect: user.is_prospect,
        extraDetails: JSON.stringify(user.extra_details),
      })
      .save();
    // TODO: Do i even do this ir no change in role type
    if (user.user_type === "DISTRICT") {
      await updatedUser.related("districtRole").detach();
      const district: Districts = await Districts.findOrFail(user.district_id);
      await updatedUser.related("districtRole").attach({
        [district.districtId]: {
          district_role: user.role_type,
        },
      });
    } else {
      await updatedUser.related("clubRole").detach();
      const club: Clubs = await Clubs.findOrFail(user.club_id);
      await updatedUser.related("clubRole").attach({
        [club.clubId]: {
          club_role: user.role_type,
        },
      });
    }
  }

  public async deleteUser(userId: number) {
    const user = await Users.findOrFail(userId);
    // TODO : REfoctor Db query for speed in future
    const projects = await Projects.all();
    const found = projects.find((project) => {
      if (project.createdBy === user.userId) {
        return true;
      }
    });
    if (!found) {
      if (user.userType === "DISTRICT") {
        await user.related("districtRole").detach();
        await user.delete();
      } else {
        await user.related("clubRole").detach();
        await user.delete();
      }
    } else {
      throw new CustomException({
        message: "Cannot delete user",
        status: 400,
        translatedMessage: {
          en: "Cannot delete user, there are projects created by this user",
          fr: "Impossible de supprimer l'utilisateur, il y a des projets créés par cet utilisateur",
        },
      });
    }
  }
}
