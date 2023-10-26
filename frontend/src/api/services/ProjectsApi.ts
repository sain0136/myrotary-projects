import { ApiClient } from "@/api/ApiClient";
import type { PaginationResult } from "@/utils/types/commonTypes";
import type { ProjectFilters } from "@/utils/types/commonTypes";
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
    current_page: number,
    limit: number
  ): Promise<PaginationResult> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/getAllProjects`,
      {
        current_page,
        limit,
      }
    );
  }

  public async filter(
    projectFilters: ProjectFilters
  ): Promise<PaginationResult> {
    return await this.apiClient.fetchWrapper("POST", `${BASE_ROUTE}/filter`, {
      filters: projectFilters,
    });
  }

  public async getProject(id: number): Promise<any> {
    return await this.apiClient.fetchWrapper("GET", `${BASE_ROUTE}/${id}`);
  }
}
