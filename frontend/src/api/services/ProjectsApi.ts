import { ApiClient } from "@/api/ApiClient";
import type {
  IClubProject,
  IDmProject,
  IDsgProject,
} from "@/utils/interfaces/IProjects";
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

  public async getProject(
    id: number
  ): Promise<IDsgProject | IDmProject | IClubProject> {
    return await this.apiClient.fetchWrapper("GET", `${BASE_ROUTE}/${id}`);
  }

  /**
   * Fetches conditional projects based on the given parameters.
   * @param value - The value to use for the conditional query.
   * @param current_page - The current page of results to fetch.
   * @param limit - The maximum number of results to fetch.
   * @param conditional - The conditional query to use.
   * @param project_admin_table - Optional. Whether to fetch from the project admin table.
   * @returns A Promise that resolves to a PaginationResult object.
   */
  public async fetchConditionalProjects(
    value: number | string | boolean,
    current_page: number,
    limit: number,
    conditional: string,
    project_admin_table?: boolean
  ): Promise<PaginationResult> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/fetchConditionalProjects`,
      {
        value,
        current_page,
        limit,
        conditional,
        project_admin_table,
      }
    );
  }

  public async createClubProject(project: IClubProject): Promise<IClubProject> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/createClubProject`,
      project
    );
  }

  public async updateClubProject(project: IClubProject) {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/updateClubProject`,
      project
    );
  }

  public async deleteProject(id: number, override?: boolean) {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/deleteProject`,
      {
        id,
        override,
      }
    );
  }
}
