import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CustomException from "App/Exceptions/CustomException";
import UploadsRepositories from "App/Repositories/UploadsRepositories";
import UploadsService from "App/Services/UploadsService";
import { CustomErrorType } from "App/Utils/CommonTypes";

export default class UploadsController {
  private initializeServices() {
    const uploadsRepositories = new UploadsRepositories();
    const uploadsService = new UploadsService(uploadsRepositories);
    return { uploadsRepositories, uploadsService };
  }

  public async test({ request, response }: HttpContextContract) {
    try {
      const coverImage = request.file("test");
      const { uploadsService } = this.initializeServices();
      const path = await uploadsService.test(coverImage);
      return response.json(path);
    } catch (error) {
      console.log(error);
    }
  }

  public async uploadFiles({ request, response }: HttpContextContract) {
    try {
      const files = request.files("files");
      const storagePath = request.input("storagePath");
      const databaseTarget = request.input("databaseTarget");
      const fileTypes = request.input("fileTypes");
      const userId = request.input("userId", null);
      const projectId = request.input("projectId", null);

      const { uploadsService } = this.initializeServices();
      const result = await uploadsService.uploadFiles(
        files,
        storagePath,
        databaseTarget,
        fileTypes,
        userId,
        projectId
      );
      return response.json(result);
    } catch (error) {
      console.log(error);
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    try {
      const filenames: Array<string> = request.input("filenames");
      const { uploadsService } = this.initializeServices();
      await uploadsService.delete(filenames);
      return response.json({});
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }
}
