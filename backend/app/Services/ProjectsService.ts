import ProjectsRepositories from "App/Repositories/ProjectsRepositories";
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

  public async filter(projectFilters: ProjectFilters) {
    const filteredProjects = await this.projectsRepositories.filter(
      projectFilters
    );
    return filteredProjects;
  }

  public async show(id: number) {
    const project = await this.projectsRepositories.show(id);
    project.pledgesAssociated =
      await this.projectsRepositories.pledgesAsscoiated(project.projectId);
    project.projectDetails = await this.projectsRepositories.getProjectDetails(
      project.projectId
    );
    return project;
  }
}
