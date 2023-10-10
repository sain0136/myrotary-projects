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

  public async getById(id: number): Promise<IClub> {
    return await this.apiClient.fetchWrapper("POST", `${BASE_ROUTE}/getById`, {
      id,
    });
  }

  public async deleteClub(id: number): Promise<boolean> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/deleteClub`,
      {
        id,
      }
    );
  }

  public async createClub(club: IClub): Promise<boolean> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/createClub`,
      club
    );
  }

  public async updateClub(club: IClub): Promise<boolean> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/updateClub`,
      club
    );
  }

  public async getClubUsers(
    id: number,
    currentPage: number,
    limit: number
  ): Promise<PaginationResult> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/getClubUsers`,
      {
        id,
        currentPage,
        limit,
      }
    );
  }
}
