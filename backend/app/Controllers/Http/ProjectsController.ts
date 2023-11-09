import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CustomException from "App/Exceptions/CustomException";
import ProjectsRepositories from "App/Repositories/ProjectsRepositories";
import ProjectsService from "App/Services/ProjectsService";
import { IClubProject } from "App/Shared/Interfaces/IProjects";
import RotaryYear from "App/Utils/Classes/RotaryYear";
import { CustomErrorType, ProjectFilters } from "App/Utils/CommonTypes";

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

  public async filter({ request, response }: HttpContextContract) {
    try {
      const projectFilters: ProjectFilters = request.input("filters");
      const { projectsService } = this.initializeServices();
      const filteredProjects = await projectsService.filter(projectFilters);
      return response.json(filteredProjects);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const id: number = params.id;
      const { projectsService } = this.initializeServices();
      const project = await projectsService.show(id);
      return response.json(project);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async fetchConditionalProjects({
    request,
    response,
  }: HttpContextContract) {
    try {
      const conditional: number | string = request.input("conditional", "");
      const value: number | string | boolean = request.input("value", "");
      const currentPage: number = request.input("current_page", 1);
      const limit: number = request.input("limit", 10);
      const adminTable: boolean = request.input("project_admin_table", false);
      const { projectsService } = this.initializeServices();
      const conditionalProjects =
        await projectsService.fetchConditionalProjects(
          conditional,
          value,
          currentPage,
          limit,
          adminTable
        );
      return response.json(conditionalProjects);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async createClubProject({ request, response }: HttpContextContract) {
    try {
      const project = request.body() as IClubProject;
      const { projectsService } = this.initializeServices();
      const newProject = await projectsService.createClubProject(project);
      return response.json(newProject);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async updateClubProject({ request, response }: HttpContextContract) {
    try {
      const project = request.body() as IClubProject;
      const { projectsService } = this.initializeServices();
      const updatedProject = await projectsService.updateClubProject(project);
      return response.json(updatedProject);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }
}
