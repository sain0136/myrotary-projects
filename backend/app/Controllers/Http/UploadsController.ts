import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UploadsRepositories from "App/Repositories/UploadsRepositories";
import UploadsService from "App/Services/UploadsService";
import Drive from "@ioc:Adonis/Core/Drive";

export default class UploadsController {
  private initializeServices() {
    const uploadsRepositories = new UploadsRepositories();
    const uploadsService = new UploadsService(uploadsRepositories);
    return { uploadsRepositories, uploadsService };
  }

  public async test({ request, response }: HttpContextContract) {
    const coverImage = request.file("test");
    const { uploadsService } = this.initializeServices();

    try {
      const path = await uploadsService.test(coverImage);
      return response.json(path);
    } catch (error) {
      debugger;
      console.log(error);
    }
  }

  public async delete({ request }: HttpContextContract) {
    const filename = request.input("filename");
    try {
      await Drive.delete(filename);
    } catch (error) {
      console.log(error);
    }
  }
}
