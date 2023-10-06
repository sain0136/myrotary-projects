import CustomException from "App/Exceptions/CustomException";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ClubsRepositories from "App/Repositories/ClubsRepositories";
import { CustomErrorType } from "App/Utils/CommonTypes";
import ClubsService from "App/Services/ClubsService";

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
      const { clubService } = this.initializeServices();
      const allClubsInDistrict = await clubService.clubsInDistrict(
        districtID,
        currentPage,
        limit
      );
      return response.json(allClubsInDistrict);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }
}
