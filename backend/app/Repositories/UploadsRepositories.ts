import Drive from "@ioc:Adonis/Core/Drive";
import type {
  uploadedFile,
  databaseTarget,
  IAssets,
} from "App/Shared/Interfaces/IAssets";
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
  ): Promise<Array<uploadedFile> | undefined> {
    try {
      switch (databaseTarget) {
        case "assets":
          for await (const file of uploadedFiles) {
            const rotaryAssets = await Assets.findOrFail(1);
            const main = rotaryAssets.$attributes.main_logo as uploadedFile;
            if (main) {
              await Drive.delete(main.s3Name);
            }
            await rotaryAssets
              .merge({
                main_logo: JSON.stringify(file),
              })
              .save();
          }
          const updatedAssets = await Assets.findOrFail(1);
          return [updatedAssets.main_logo as unknown as uploadedFile];
        case "profile-picture":
          for await (const file of uploadedFiles) {
            const rotaryAssets = await Assets.findOrFail(1);
            if ((rotaryAssets.$attributes as IAssets).assets.profilePicture) {
              const fileToDelete = (rotaryAssets.$attributes as IAssets).assets
                .profilePicture;
              if (fileToDelete) {
                await Drive.delete(fileToDelete.s3Name);
              }
            }
            (rotaryAssets.$attributes as IAssets).assets.profilePicture = file;
            await rotaryAssets
              .merge({
                assets: JSON.stringify(rotaryAssets.$attributes.assets),
              })
              .save();
          }
          const updatedAssets2 = await Assets.findOrFail(1);
          return updatedAssets2.$attributes.assets.profilePicture ?? [];
        default:
          return [];
      }
    } catch (error) {
      console.error("Database Error:", error);
    }
  }
}
