import Drive from "@ioc:Adonis/Core/Drive";
import type { uploadedFile, databaseTarget } from "App/Utils/CommonTypes";
import Assets from "App/Models/Assets";

export default class UploadsController {
  public async test(file: any) {
    await file.moveToDisk("./siteadmin");
    let path = file.filePath;
    if (path) {
      path = await Drive.getUrl(path as string);
    }
    return path;
  }

  public async uploadFiles(
    uploadedFiles: Array<uploadedFile>,
    databaseTarget: databaseTarget
  ) {
    try {
      switch (databaseTarget) {
        case "assets":
          for await (const file of uploadedFiles) {
            const rotaryAssets = await Assets.findOrFail(1);
            await rotaryAssets
              .merge({
                main_logo: JSON.stringify(file),
              })
              .save();
          }
          const updatedAssets = await Assets.findOrFail(1);
          return updatedAssets.main_logo;
        default:
          return [];
      }
    } catch (error) {
      console.error("Database Error:", error);
    }
  }
}
