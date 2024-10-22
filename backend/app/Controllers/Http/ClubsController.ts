import CustomException from "App/Exceptions/CustomException";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ClubsRepositories from "App/Repositories/ClubsRepositories";
import { CustomErrorType } from "App/Utils/CommonTypes";
import ClubsService from "App/Services/ClubsService";
import { IClub } from "App/Shared/Interfaces/IClub";

export default class ClubsController {
  private initializeServices() {
    const clubsRepositories = new ClubsRepositories();
    const clubService = new ClubsService(clubsRepositories);
    return { clubsRepositories, clubService };
  }

  public async clubsInDistrict({ response, request }: HttpContextContract) {
    try {
      const currentPage: number = request.input("currentPage", 1);
      const limit: number = request.input("limit", 10);
      const districtID: number = request.input("districtId");
      const excludeNotSubscribed: boolean = request.input(
        "excludeNotSubscribed",
        true
      );
      const { clubService } = this.initializeServices();
      const allClubsInDistrict = await clubService.clubsInDistrict(
        districtID,
        currentPage,
        limit,
        excludeNotSubscribed
      );
      return response.json(allClubsInDistrict);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async createClub({ request, response }: HttpContextContract) {
    try {
      const club = request.body() as IClub;
      const { clubService } = this.initializeServices();
      await clubService.createClub(club);
      return response.json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async updateClub({ request, response }: HttpContextContract) {
    try {
      const club = request.body() as IClub;
      const { clubService } = this.initializeServices();
      await clubService.updateClub(club);
      return response.json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async getById({ request, response }: HttpContextContract) {
    try {
      const id: number = request.input("id");
      const { clubService } = this.initializeServices();
      const club = await clubService.getById(id);
      return response.json(club);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async deleteClub({ request, response }: HttpContextContract) {
    try {
      const id: number = request.input("id");
      const { clubService } = this.initializeServices();
      await clubService.deleteClub(id);
      return response.json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async getClubUsers({ request, response }: HttpContextContract) {
    try {
      const id: number = request.input("id");
      const currentPage: number = request.input("currentPage", 1);
      const limit: number = request.input("limit", 10);
      const { clubService } = this.initializeServices();
      const users = await clubService.getClubUsers(id, currentPage, limit);
      return response.json(users);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }
}
