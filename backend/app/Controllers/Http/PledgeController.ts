import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CustomException from "App/Exceptions/CustomException";
import { CustomErrorType } from "App/Utils/CommonTypes";
import PledgesRepositories from "App/Repositories/PledgeRepositories";
import PledgesService from "App/Services/PledgeService";
import { IPledge } from "App/Shared/Interfaces/IProjects";

export default class PledgesController {
  private initializeServices() {
    const projectsRepositories = new PledgesRepositories();
    const projectsService = new PledgesService(projectsRepositories);
    return { projectsRepositories, projectsService };
  }

  public async storePledge({ request }: HttpContextContract) {
    try {
      const pledge: IPledge = request.input("pledge");
      const { projectsService } = this.initializeServices();
      await projectsService.storePledge(pledge);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }
}
