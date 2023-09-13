import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ProjectsRepositories from "App/Repositories/ProjectsRepositories";
import ProjectsService from "App/Services/ProjectsService";

export default class ProjectsController {
  private initializeServices() {
    const projectsRepositories = new ProjectsRepositories();
    const projectsService = new ProjectsService(projectsRepositories);
    return { projectsRepositories, projectsService };
  }

  public async index({ response }: HttpContextContract) {
    const { projectsService } = this.initializeServices();
    const allProjects = await projectsService.index();
    return response.json(allProjects);
  }
}
