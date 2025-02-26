import Projects from "App/Models/Projects";
import ProjectsRepositories from "App/Repositories/ProjectsRepositories";
import {
  IClubProject,
  IDmProject,
  IDsgProject,
} from "App/Shared/Interfaces/IProjects";
import { ProjectFilters } from "App/Utils/CommonTypes";

export default class UserService {
  constructor(private projectsRepositories: ProjectsRepositories) {}

  public async index() {
    const allProjects = await this.projectsRepositories.index();
    for await (const project of allProjects) {
      project.pledgesAssociated =
        await this.projectsRepositories.pledgesAsscoiated(project.projectId);
      project.projectDetails =
        await this.projectsRepositories.getProjectDetails(project.projectId);
    }
    return allProjects;
  }

  public async getAllProjects(currentPage: number, limit: number) {
    const allProjects = await this.projectsRepositories.getAllProjects(
      currentPage,
      limit
    );
    return allProjects;
  }

  public async filter(
    projectFilters: ProjectFilters
  ): Promise<import("@ioc:Adonis/Lucid/Orm").ModelPaginatorContract<Projects>> {
    const filteredProjects = await this.projectsRepositories.filter(
      projectFilters
    );
    return filteredProjects;
  }

  public async show(id: number): Promise<Projects> {
    const project = await this.projectsRepositories.show(id);
    project.pledgesAssociated =
      await this.projectsRepositories.pledgesAsscoiated(project.projectId);
    project.projectDetails = await this.projectsRepositories.getProjectDetails(
      project.projectId
    );
    return project;
  }

  public async fetchConditionalProjects(
    conditional: number | string,
    value: string | number | boolean,
    currentPage: number,
    limit: number,
    adminTable?: boolean,
    andVal?: number | string | boolean,
    andConditional1?: number | string
  ) {
    if (adminTable) {
      return await this.projectsRepositories.fetchAdminAssociated(
        value,
        limit,
        currentPage
      );
    }
    return await this.projectsRepositories.fetchConditionalProjects(
      value,
      limit,
      currentPage,
      conditional,
      andVal,
      andConditional1
    );
  }

  public async createClubProject(project: IClubProject): Promise<Projects> {
    return await this.projectsRepositories.createClubProject(project);
  }

  public async updateClubProject(
    updatedProject: IClubProject
  ): Promise<Projects> {
    return await this.projectsRepositories.updateClubProject(updatedProject);
  }

  public async createSimplifiedProject(
    project: IDsgProject
  ): Promise<Projects> {
    return await this.projectsRepositories.createSimplifiedProject(project);
  }

  public async updateSimplifiedProject(
    project: IDsgProject
  ): Promise<Projects> {
    return await this.projectsRepositories.updateSimplifiedProject(project);
  }

  public async createMatchingProject(project: IDmProject): Promise<Projects> {
    return await this.projectsRepositories.createMatchingProject(project);
  }

  public async updateMatchingProject(project: IDmProject): Promise<Projects> {
    return await this.projectsRepositories.updateMatchingProject(project);
  }

  public async deleteProject(id: number, override?: boolean) {
    return await this.projectsRepositories.deleteProject(id, override);
  }

  public async addProjectAdmins(userId: number, projectId: number) {
    return await this.projectsRepositories.addProjectAdmins(userId, projectId);
  }

  public async removeProjectAdmins(userId: number, projectId: number) {
    return await this.projectsRepositories.removeProjectAdmins(
      userId,
      projectId
    );
  }

  public async updateProjectStatus(projectStatus: string, projectId: number) {
    return await this.projectsRepositories.updateProjectStatus(
      projectStatus,
      projectId
    );
  }
}
