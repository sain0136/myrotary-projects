import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CustomException from "App/Exceptions/CustomException";
import DistrictsRepositories from "App/Repositories/DistrictsRepositories";
import DistrictsService from "App/Services/DistrictsService";
import { CustomErrorType } from "App/Utils/CommonTypes";

export default class DistrictsController {
  private initializeServices() {
    const districtsRepositories = new DistrictsRepositories();
    const districtsService = new DistrictsService(districtsRepositories);
    return { districtsRepositories, districtsService };
  }

  public async getAllDistricts({ request, response }: HttpContextContract) {
    try {
      const currentPage: number = request.input("current_page", 1);
      const limit: number = request.input("limit", 10);
      const allFlag: boolean | null = request.input("allFlag", null);
      const { districtsService } = this.initializeServices();
      const allDistricts = await districtsService.index(
        currentPage,
        limit,
        allFlag
      );
      return response.json(allDistricts);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }
}
