import ProjectsRepositories from "App/Repositories/ProjectsRepositories";

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
}
