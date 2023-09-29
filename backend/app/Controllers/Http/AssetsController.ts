import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CustomException from "App/Exceptions/CustomException";
import AssetsService from "App/Services/AssetsService";
import AssetsRepositories from "App/Repositories/AssetsRepositories";
import { CustomErrorType } from "App/Utils/CommonTypes";

export default class AssetsController {
  private initializeServices() {
    const assetsRepositories = new AssetsRepositories();
    const assetsService = new AssetsService(assetsRepositories);
    return { assetsService, assetsRepositories };
  }

  public async index({ response }: HttpContextContract) {
    try {
      const { assetsService } = this.initializeServices();
      const mainAssets = await assetsService.index();
      return response.json(mainAssets);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async updateAssets({ request, response }: HttpContextContract) {
    try {
      const newAssets = request.body() as object;
      const { assetsService } = this.initializeServices();
      const mainAssets = await assetsService.updateAssets(newAssets);
      return response.json(mainAssets);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }
}
