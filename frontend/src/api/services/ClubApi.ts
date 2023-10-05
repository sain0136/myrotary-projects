import { ApiClient } from "@/api/ApiClient";
import type { IClub } from "@/utils/interfaces/IClub";
import type { PaginationResult } from "@/utils/types/commonTypes";
const BASE_ROUTE = "/clubs";

export class ClubApi {
  constructor(private apiClient: ApiClient) {}

  public async clubsInDistrict(
    districtId: number,
    currentPage: number,
    limit: number
  ): Promise<PaginationResult> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/clubsInDistrict`,
      {
        districtId,
        currentPage,
        limit,
      }
    );
  }
}
