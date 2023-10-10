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

  public async createClub(club: any) {
    return await this.clubRepository.createClub(club);
  }

  public async updateClub(club: any) {
    return await this.clubRepository.updateClub(club);
  }

  public async getById(id: number) {
    return await this.clubRepository.getById(id);
  }

  public async deleteClub(id: number) {
    return await this.clubRepository.deleteClub(id);
  }

  public async getClubUsers(id: number, currentPage: number, limit: number) {
    return await this.clubRepository.getClubUsers(id, currentPage, limit);
  }
}
