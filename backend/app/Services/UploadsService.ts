import UploadsRepositories from "App/Repositories/UploadsRepositories";
import Drive from "@ioc:Adonis/Core/Drive";

import type {
  uploadedFiletypes,
  databaseTarget,
} from "App/Shared/Types/commonTypes";
import { uploadedFile } from "App/Shared/Interfaces/IUser";
export default class UploadsService {
  constructor(private uploadsRepositories: UploadsRepositories) {}

  public async test(file: any) {
    return await this.uploadsRepositories.test(file);
  }

  public async uploadFiles(
    files: any,
    storagePath = "./",
    databaseTarget: databaseTarget,
    fileTypes: uploadedFiletypes,
    userId?: number
  ) {
    // TODO : ENV variable for cdn ?
    const cdnEndpoint = "https://rotary-s3.nyc3.cdn.digitaloceanspaces.com/";
    const postUploadedFiles: Array<uploadedFile> = [];
    for await (const file of files) {
      if (userId) {
        const filePath = `${storagePath}/${userId}`;
        await file.moveToDisk(filePath);
      } else {
        await file.moveToDisk(storagePath);
      }
      const path = file.filePath;
      const link = path ? await Drive.getUrl(path as string) : null;
      if (link) {
        const cdnFileUrl = cdnEndpoint + file.fileName;
        const upload: uploadedFile = {
          databaseTarget: databaseTarget,
          fileType: fileTypes,
          s3UrlLink: cdnFileUrl,
          s3Name: file.fileName,
        };
        postUploadedFiles.push(upload);
      } else {
        throw new Error("File not uploaded");
      }
    }
    const response = await this.uploadsRepositories.uploadFiles(
      postUploadedFiles,
      databaseTarget,
      userId
    );
    if (response && Array.isArray(response) && response.length === 1) {
      return response[0];
    } else {
      return response;
    }
  }

  public async delete(filesToDelete: Array<string>) {
    for await (const filename of filesToDelete) {
      await Drive.delete(filename);
    }
  }
}
