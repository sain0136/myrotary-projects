import DistrictsRepositories from "App/Repositories/DistrictsRepositories";
import { IDistrict } from "App/Shared/Interfaces/IDistrict";

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

  public async createDistrict(district: IDistrict) {
    await this.districtsRepositories.createDistrict(district);
  }

  public async updateDistrict(district: IDistrict) {
    await this.districtsRepositories.updateDistrict(district);
  }

  public async getById(id: number) {
    const district = await this.districtsRepositories.getById(id);
    return district;
  }

  public async deleteDistrict(ids: number[]) {
    await this.districtsRepositories.deleteDistrict(ids);
  }

  public async getDistrictAdmins(
    districtId: number,
    currentPage: number,
    limit: number,
    allFlag?: boolean
  ) {
    const allDistricts = await this.districtsRepositories.getDistrictAdmins(
      districtId,
      currentPage,
      limit,
      allFlag
    );
    return allDistricts;
  }
}
