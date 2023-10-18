import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CustomException from "App/Exceptions/CustomException";
import ProjectsRepositories from "App/Repositories/ProjectsRepositories";
import ProjectsService from "App/Services/ProjectsService";
import RotaryYear from "App/Utils/Classes/RotaryYear";
import { CustomErrorType } from "App/Utils/CommonTypes";

export default class ProjectsController {
  private initializeServices() {
    const projectsRepositories = new ProjectsRepositories();
    const projectsService = new ProjectsService(projectsRepositories);
    return { projectsRepositories, projectsService };
  }

  public async getRotaryYears({ response }: HttpContextContract) {
    return response.json({
      currentRotaryYear: RotaryYear.getCurrentYear(),
      allRotaryYears: RotaryYear.getYears(
        parseInt(RotaryYear.getCurrentYear())
      ),
    });
  }

  public async index({ response }: HttpContextContract) {
    const { projectsService } = this.initializeServices();
    const allProjects = await projectsService.index();
    return response.json(allProjects);
  }

  public async getAllProjects({ request, response }: HttpContextContract) {
    try {
      const currentPage: number = request.input("current_page", 1);
      const limit: number = request.input("limit", 6);
      const { projectsService } = this.initializeServices();
      const allProjects = await projectsService.getAllProjects(
        currentPage,
        limit
      );
      return response.json(allProjects);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }
}
