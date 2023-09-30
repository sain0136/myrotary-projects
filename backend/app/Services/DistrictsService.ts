import DistrictsRepositories from "App/Repositories/DistrictsRepositories";

export default class DistrictsService {
  constructor(private districtsRepositories: DistrictsRepositories) {}

  public async index(
    currentPage: number,
    limit: number,
    allFlag?: boolean | null
  ) {
    const allDistricts = await this.districtsRepositories.index(
      currentPage,
      limit,
      allFlag
    );
    return allDistricts;
  }
}
