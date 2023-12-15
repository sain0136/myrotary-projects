import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CustomException from "App/Exceptions/CustomException";
import { CustomErrorType } from "App/Utils/CommonTypes";
import PledgesRepositories from "App/Repositories/PledgesRepositories";
import PledgesService from "App/Services/PledgesService";
import { IPledge } from "App/Shared/Interfaces/IPledge";

export default class PledgesController {
  private initializeServices() {
    const projectsRepositories = new PledgesRepositories();
    const projectsService = new PledgesService(projectsRepositories);
    return { projectsRepositories, projectsService };
  }

  public async storePledge({ request, response }: HttpContextContract) {
    try {
      const pledge = request.body() as IPledge;
      const { projectsService } = this.initializeServices();
      await projectsService.storePledge(pledge);
      return response.status(200).json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }
}
