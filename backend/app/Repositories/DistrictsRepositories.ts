import Districts from "App/Models/Districts";

export default class DistrictsRepositories {
  public async index(
    currentPage: number,
    limit: number,
    allFlag?: boolean | null
  ) {
    const allDistricts = !allFlag
      ? await Districts.query().select("*").paginate(currentPage, limit)
      : await Districts.all();
    return allDistricts;
  }
}
