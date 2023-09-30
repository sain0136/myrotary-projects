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
}
