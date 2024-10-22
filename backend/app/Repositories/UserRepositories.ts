import Hash from "@ioc:Adonis/Core/Hash";
import CustomException from "App/Exceptions/CustomException";
import Clubs from "App/Models/Clubs";
import Districts from "App/Models/Districts";
import Projects from "App/Models/Projects";
import Session from "App/Models/Session";
import Users from "App/Models/Users";
import { IRoles, IUser } from "App/Shared/Interfaces/IUser";
import { errorTranslations } from "App/Translations/Translations";
import { AuthenticationRequestData } from "App/Utils/CommonTypes";
import { DateTime } from "luxon";

export default class UserRepositories {
  public async getAllUsers(
    isProspect: boolean,
    limit?: number,
    currentPage?: number,
    districtId?: number
  ) {
    //Meaning user wants a pagination result
    if (limit && currentPage) {
      const query = Users.query()
        .select()
        .where({ isProspect: isProspect })
        .orderBy("created_at", "asc");

      if (districtId) {
        query.andWhere({ district_id: districtId });
      }
      return await query.paginate(currentPage, limit);
    }
    //Meaning user just wants the User objects
    else {
      const query = Users.query()
        .select()
        .where({ isProspect: isProspect })
        .orderBy("created_at", "asc");

      if (districtId) {
        query.andWhere({ district_id: districtId });
      }
      return await query;
    }
  }

  public async authenticateUser(
    userCredentials: AuthenticationRequestData,
    skipSession: boolean = false
  ) {
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
    if (user.isProspect) {
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
        });
      }
      const { userData, club } = await this.addUserDetails(user);
      let newSession: Session | undefined = undefined;
      if (!skipSession) {
        newSession = await Session.create({
          loginTimestamp: BigInt(DateTime.now().toMillis()),
          lastActivityTimestamp: BigInt(DateTime.now().toMillis()),
          fullName: userData.user.fullName,
          email: userData.user.email,
          userId: userData.user.userId,
          districtId: userData.user.districtId || club.districtId,
          clubId: userData.user.clubId,
        });
      } else {
        newSession = undefined;
      }
      return { userData, newSession };
    } else {
      const message = "Invalid password";
      const status = 404;
      const translatedMessage = errorTranslations.badCredentials;
      throw new CustomException({ message, status, translatedMessage });
    }
  }
  private async addUserDetails(user: Users) {
    const userData = await this.addUserRoles(user);
    const club = await Clubs.findOrFail(userData.user.clubId);
    if (!club.subscriptionId) {
      throw new CustomException({
        message: "Club not subscribed",
        status: 402,
        errorData: {
          userId: userData.user.userId,
          clubId: club.clubId,
        },
      });
    }
    return { userData, club };
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
    district = await Districts.findOrFail(club.districtId);
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

  public async createUser(
    user: IUser,
    prospectUser: boolean
  ): Promise<{ districtAdminsToEmail: string[]; createdUser: Users }> {
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
    let districtAdminsToEmail: string[] = [];
    if (prospectUser && createdUser.districtId) {
      // TODO : Refactor this query for speed in future use query to get only 5 admins
      const admins = await Users.query().where(
        "district_id",
        createdUser.districtId
      );
      for (let i = 0; i < admins.length; i++) {
        if (i === 5) {
          break;
        }
        districtAdminsToEmail.push(
          `<p><strong>Admin:</strong> ${admins[i].fullName}<br><strong>Email:</strong> ${admins[i].email}</p>`
        );
      }
    } else if (prospectUser && createdUser.clubId) {
      const admins = await Users.query().where("club_id", createdUser.clubId);
      for (let i = 0; i < admins.length; i++) {
        if (i === 5) {
          break;
        }
        districtAdminsToEmail.push(
          `<p><strong>Admin:</strong> ${admins[i].fullName}<br><strong>Email:</strong> ${admins[i].email}</p>`
        );
      }
    }
    return { districtAdminsToEmail, createdUser };
  }

  public async updateUser(
    user: IUser
  ): Promise<{ updatedUser: Users; prospectApproved: boolean }> {
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
    // TODO: Do i even do this if no change in role type
    if (user.user_type === "DISTRICT" && user.role_type) {
      await updatedUser.related("districtRole").detach();
      const district: Districts = await Districts.findOrFail(user.district_id);
      await updatedUser.related("districtRole").attach({
        [district.districtId]: {
          district_role: user.role_type,
        },
      });
    } else if (user.user_type === "CLUB" && user.role_type) {
      await updatedUser.related("clubRole").detach();
      const club: Clubs = await Clubs.findOrFail(user.club_id);
      await updatedUser.related("clubRole").attach({
        [club.clubId]: {
          club_role: user.role_type,
        },
      });
    }

    return {
      updatedUser,
      // This user was a prospect and now is not
      prospectApproved:
        existingUser.isProspect === true && updatedUser.isProspect === false
          ? true
          : false,
    };
  }

  public async deleteUser(userId: number): Promise<Users> {
    const foundUser = await Users.findOrFail(userId);
    // TODO : REfoctor Db query for speed in future
    const projects = await Projects.all();
    const found = projects.find((project) => {
      if (project.createdBy === foundUser.userId) {
        return true;
      }
    });
    if (!found) {
      if (foundUser.userType === "DISTRICT") {
        await foundUser.related("districtRole").detach();
        await foundUser.delete();
      } else {
        await foundUser.related("clubRole").detach();
        await foundUser.delete();
      }
      return foundUser;
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
