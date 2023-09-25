import UploadsRepositories from "App/Repositories/UploadsRepositories";
import Drive from "@ioc:Adonis/Core/Drive";
import type {
  uploadedFile,
  uploadedFiletypes,
  databaseTarget,
} from "App/Utils/CommonTypes";
export default class UploadsService {
  constructor(private uploadsRepositories: UploadsRepositories) {}

  public async test(file: any) {
    return await this.uploadsRepositories.test(file);
  }

  public async uploadFiles(
    files: any,
    storagePath = "./",
    databaseTarget: databaseTarget,
    fileTypes: uploadedFiletypes
  ) {
    const postUploadedFiles: Array<uploadedFile> = [];
    for await (const file of files) {
      await file.moveToDisk(storagePath);
      const path = file.filePath;
      const link = path ? await Drive.getUrl(path as string) : "Error";
      const upload: uploadedFile = {
        databaseTarget: databaseTarget,
        fileType: fileTypes,
        s3UrlLink: link,
        s3Name: file.fileName,
      };
      postUploadedFiles.push(upload);
    }
    return await this.uploadsRepositories.uploadFiles(
      postUploadedFiles,
      databaseTarget
    );
  }

  public async delete(filesToDelete: Array<string>) {
    for await (const filename of filesToDelete) {
      await Drive.delete(filename);
    }
  }
}
