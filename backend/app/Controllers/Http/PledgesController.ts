import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CustomException from "App/Exceptions/CustomException";
import { CustomErrorType } from "App/Utils/CommonTypes";
import PledgesRepositories from "App/Repositories/PledgesRepositories";
import PledgesService from "App/Services/PledgesService";
import { IPledge } from "App/Shared/Interfaces/IPledge";

export default class PledgesController {
  private initializeServices() {
    const pledgesRepository = new PledgesRepositories();
    const pledgesService = new PledgesService(pledgesRepository);
    return { pledgesService, pledgesRepository };
  }

  public async storePledge({ request, response }: HttpContextContract) {
    try {
      const pledge = request.body() as IPledge;
      const { pledgesService } = this.initializeServices();
      await pledgesService.storePledge(pledge);
      return response.status(200).json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async deletePledge({ request, response }: HttpContextContract) {
    try {
      const pledgeId = request.input("pledgeId");
      const { pledgesService } = this.initializeServices();
      await pledgesService.deletePledge(pledgeId);
      return response.status(200).json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async getPledgesByProject({ request, response }: HttpContextContract) {
    try {
      const projectId = request.input("projectId");
      const { pledgesService } = this.initializeServices();
      const pledges = await pledgesService.getPledgesByProject(projectId);
      return response.status(200).json(pledges);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }
}
