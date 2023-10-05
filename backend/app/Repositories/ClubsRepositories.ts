import Clubs from "App/Models/Clubs";

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
}
