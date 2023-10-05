import { ApiClient } from "@/api/ApiClient";
import type { IDistrict } from "@/utils/interfaces/IDistrict";
import type { PaginationResult } from "@/utils/types/commonTypes";
const BASE_ROUTE = "/districts";

export class DistrictApi {
  constructor(private apiClient: ApiClient) {}

  public async getAllDistricts(
    allFlag?: boolean,
    currentPage?: number,
    limit?: number
  ): Promise<Array<IDistrict> | PaginationResult> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/getAllDistricts`,
      {
        currentPage,
        limit,
        allFlag,
      }
    );
  }

  public async createDistrict(district: IDistrict): Promise<boolean> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/createDistrict`,
      district
    );
  }

  public async updateDistrict(district: IDistrict): Promise<boolean> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/updateDistrict`,
      district
    );
  }

  public async getById(id: number): Promise<IDistrict> {
    return await this.apiClient.fetchWrapper("POST", `${BASE_ROUTE}/getById`, {
      id,
    });
  }

  public async deleteDistrict(ids: number[]): Promise<boolean> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/deleteDistrict`,
      {
        ids,
      }
    );
  }

  public async getDistrictAdmins(
    currentPage: number,
    limit: number,
    districtId: number,
    allAdmins?: boolean
  ): Promise<PaginationResult> {
    return await this.apiClient.fetchWrapper("POST", `${BASE_ROUTE}/admins`, {
      districtId,
      currentPage,
      limit,
      allAdmins,
    });
  }
}
