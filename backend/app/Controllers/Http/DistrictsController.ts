import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CustomException from "App/Exceptions/CustomException";
import DistrictsRepositories from "App/Repositories/DistrictsRepositories";
import DistrictsService from "App/Services/DistrictsService";
import { IDistrict } from "App/Shared/Interfaces/IDistrict";
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

  public async createDistrict({ request, response }: HttpContextContract) {
    try {
      const district = request.body() as IDistrict;
      const { districtsService } = this.initializeServices();
      await districtsService.createDistrict(district);
      return response.json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async updateDistrict({ request, response }: HttpContextContract) {
    try {
      const district = request.body() as IDistrict;
      const { districtsService } = this.initializeServices();
      await districtsService.updateDistrict(district);
      return response.json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async getById({ request, response }: HttpContextContract) {
    try {
      const id: number = request.input("id");
      const { districtsService } = this.initializeServices();
      const district = await districtsService.getById(id);
      return response.json(district);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async deleteDistrict({ request, response }: HttpContextContract) {
    try {
      const ids: number[] = request.input("ids");
      const { districtsService } = this.initializeServices();
      await districtsService.deleteDistrict(ids);
      return response.json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async getDistrictAdmins({ request, response }: HttpContextContract) {
    try {
      const districtId: number = request.input("districtId");
      const currentPage: number = request.input("currentPage", 1);
      const limit: number = request.input("limit", 10);
      const allFlag: boolean | undefined = request.input("allAdmins", false);
      const { districtsService } = this.initializeServices();
      const allDistricts = await districtsService.getDistrictAdmins(
        districtId,
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
