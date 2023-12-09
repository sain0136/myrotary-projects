import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CustomException from "App/Exceptions/CustomException";
import AssetsService from "App/Services/AssetsService";
import AssetsRepositories from "App/Repositories/AssetsRepositories";
import { Currencies, CustomErrorType } from "App/Utils/CommonTypes";
import fs from "fs";
import path from "path";
import Application from "@ioc:Adonis/Core/Application";

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

  public async getCurrencies({ response }: HttpContextContract) {
    try {
      const filePath = path.join(
        Application.resourcesPath("Common-Currency.json")
      );
      const data = await fs.promises.readFile(filePath, "utf-8");
      const currencies: Currencies = JSON.parse(data);
      const formatedCurrencies = Object.keys(currencies).map((key) => {
        return {
          shortName: key,
          ...currencies[key],
        };
      });
      return response.json(formatedCurrencies);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }
}
