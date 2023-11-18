import UploadsRepositories from "App/Repositories/UploadsRepositories";
import Drive from "@ioc:Adonis/Core/Drive";
import { v4 as uuidv4 } from "uuid";

import type {
  uploadedFiletypes,
  databaseTarget,
} from "App/Shared/Types/commonTypes";
import { uploadedFile } from "App/Shared/Interfaces/IUser";
import Projects from "App/Models/Projects";
import { IUploads } from "App/Shared/Interfaces/IProjects";

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
    userId?: number,
    projectId?: number
  ) {
    // TODO : ENV variable for cdn ?

    const cdnEndpoint = "https://rotary-s3.nyc3.cdn.digitaloceanspaces.com/";
    const postUploadedFiles: Array<uploadedFile> = [];
    for await (const file of files) {
      const uniqueId = uuidv4();
      const uniqueFileName = `${fileTypes}-${uniqueId}_${file.clientName}`;
      const filePath = `${storagePath}/${userId}`;
      if (userId) {
        // const filenameWithoutExtension = file.clientName.replace(/\.[^/.]+$/, "");
        await file.moveToDisk(filePath, {
          name: uniqueFileName,
        });
      } else if (projectId) {
        const filePath = `${storagePath}/${projectId}`;
        await file.moveToDisk(filePath, {
          name: uniqueFileName,
        });
      } else {
        await file.moveToDisk(storagePath, {
          name: uniqueFileName,
        });
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
      userId,
      projectId
    );
    if (response && Array.isArray(response) && response.length === 1) {
      return response[0];
    } else {
      return response;
    }
  }

  public async delete(filesToDelete: Array<string>, projectId: number) {
    for await (const filename of filesToDelete) {
      const project = await Projects.findOrFail(projectId);
      const projectMedia = project.fileUploads as IUploads;
      projectMedia.evidence_files = projectMedia.evidence_files.filter(
        (file: uploadedFile) => file.s3Name !== filename
      );
      projectMedia.reports_files = projectMedia.reports_files.filter(
        (file: uploadedFile) => file.s3Name !== filename
      );
      await project
        .merge({
          fileUploads: JSON.stringify(projectMedia),
        })
        .save();
      await Drive.delete(filename);
    }
  }
}
