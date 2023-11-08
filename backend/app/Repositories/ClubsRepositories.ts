import CustomException from "App/Exceptions/CustomException";
import Clubs from "App/Models/Clubs";
import Projects from "App/Models/Projects";
import Users from "App/Models/Users";
import { IClub } from "App/Shared/Interfaces/IClub";
import { IRoles } from "App/Shared/Interfaces/IUser";

export default class ClubRepositories {
  public async clubsInDistrict(
    districtID: number,
    currentPage: number,
    limit: number
  ) {
    const allClubsInDistrict = await Clubs.query()
      .select("*")
      .where({ district_id: districtID })
      .paginate(currentPage, limit);
    return allClubsInDistrict;
  }

  public async createClub(club: IClub) {
    await Clubs.create({
      clubName: club.club_name,
      clubAddress: club.club_address,
      clubCity: club.club_city,
      clubPostal: club.club_postal,
      clubProvince: club.club_province,
      clubCountry: club.club_country,
      clubDescription: club.club_description,
      clubEmail: club.club_email,
      districtId: club.district_id,
      siteUrl: club.siteUrl,
      settings: JSON.stringify(club.settings),
    });
  }

  public async updateClub(club: IClub) {
    const currentClub = await Clubs.findOrFail(club.club_id);
    await currentClub
      .merge({
        clubName: club.club_name,
        clubAddress: club.club_address,
        clubCity: club.club_city,
        clubPostal: club.club_postal,
        clubProvince: club.club_province,
        clubCountry: club.club_country,
        clubDescription: club.club_description,
        clubEmail: club.club_email,
        districtId: club.district_id,
        siteUrl: club.siteUrl,
        settings: JSON.stringify(club.settings),
      })
      .save();
  }

  public async getById(id: number): Promise<Clubs> {
    const club: Clubs = await Clubs.findOrFail(id);
    return club;
  }

  public async deleteClub(id: number) {
    const club = await Clubs.findOrFail(id);
    const projects = await Projects.all();
    const found = projects.find((pro) => {
      if (pro.clubId === id) {
        return true;
      }
    });
    if (!found) {
      await club.delete();
    } else {
      throw new CustomException({
        message: "Cannot delete club",
        translatedMessage: {
          en: "Cannot delete club, it has projects associated",
          fr: "Impossible de supprimer le club, il y a des projets associés",
        },
      });
    }
  }

  public async getClubUsers(id: number, currentPage: number, limit: number) {
    const users = await Users.query()
      .where({ club_id: id })
      .paginate(currentPage, limit);
    for await (const user of users) {
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
      user.role = roleTitle[0]?.district_role
        ? roleTitle[0]?.district_role
        : roleTitle[0]?.club_role;
    }
    return users;
  }
}
