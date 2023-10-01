import { ApiClient } from "@/api/ApiClient";
import type { IDistrict } from "@/utils/interfaces/IDistrict";
const BASE_ROUTE = "/districts";

export class DistrictApi {
  constructor(private apiClient: ApiClient) {}

  public async getAllDistricts(
    allFlag?: boolean,
    currentPage?: number,
    limit?: number
  ): Promise<Array<IDistrict>> {
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
}
