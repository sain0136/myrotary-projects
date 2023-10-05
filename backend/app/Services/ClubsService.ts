import ClubRepositories from "App/Repositories/ClubsRepositories";

export default class ClubsService {
  constructor(private clubRepository: ClubRepositories) {}
  public async clubsInDistrict(
    districtID: number,
    currentPage: number,
    limit: number
  ) {
    return await this.clubRepository.clubsInDistrict(
      districtID,
      currentPage,
      limit
    );
  }
}
