import { ApiClient } from "@/api/ApiClient";
import type { PaginationResult } from "@/utils/types/commonTypes";
const BASE_ROUTE = "/projects";

export class ProjectsApi {
  constructor(private apiClient: ApiClient) {}

  public async getRotaryYears(): Promise<{
    currentRotaryYear: string;
    allRotaryYears: string[];
  }> {
    return await this.apiClient.fetchWrapper(
      "GET",
      `${BASE_ROUTE}/getRotaryYears`
    );
  }

  public async getAllProjects(
    currentPage: number,
    limit: number
  ): Promise<PaginationResult> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/getAllProjects`,
      {
        currentPage,
        limit,
      }
    );
  }
}
