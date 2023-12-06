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
import Districts from "App/Models/Districts";
import { IDistrictDetails } from "App/Shared/Interfaces/IDistrict";
import Env from "@ioc:Adonis/Core/Env";

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
    projectId?: number,
    districtId?: number,
    customIdentifier?: string
  ) {
    const cdnEndpoint = Env.get("S3_CDN_ENDPOINT_URL");
    const baseUrl = Env.get("S3_BASE_URL");
    const postUploadedFiles: Array<uploadedFile> = [];
    for await (const file of files) {
      const uniqueId = uuidv4();
      let uniqueFileName = `
      ${
        customIdentifier ? customIdentifier + "~" : ""
      }${fileTypes}-${uniqueId}_${file.clientName}`;
      uniqueFileName = uniqueFileName.replace(/\s+/g, "");
      if (userId) {
        const filePath = `${storagePath}/${userId}`;
        // const filenameWithoutExtension = file.clientName.replace(/\.[^/.]+$/, "");
        await file.moveToDisk(filePath, {
          name: uniqueFileName,
        });
      } else if (projectId) {
        const filePath = `${storagePath}/${projectId}`;
        await file.moveToDisk(filePath, {
          name: uniqueFileName,
        });
      } else if (districtId) {
        const filePath = `${storagePath}/${districtId}`;
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
        const baseUrlFileUrl = baseUrl + file.fileName;
        const upload: uploadedFile = {
          databaseTarget: databaseTarget,
          fileType: fileTypes,
          s3UrlLink: cdnFileUrl,
          s3Name: file.fileName,
          s3BaseUrlLink: baseUrlFileUrl,
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
      projectId,
      districtId
    );
    if (response && Array.isArray(response) && response.length === 1) {
      return response[0];
    } else {
      return response;
    }
  }

  public async delete(
    toDeleteUploads: Array<uploadedFile>,
    districtId?: number,
    projectId?: number,
    userId?: number
  ) {
    for await (const file of toDeleteUploads) {
      switch (file.fileType) {
        case "district-report-files":
          await Drive.delete(file.s3Name);
          if (districtId) {
            const district = await Districts.findOrFail(districtId);
            const districtDetails =
              district.districtDetails as unknown as IDistrictDetails;
            const index = districtDetails.reportLinks.findIndex(
              (storedFile: uploadedFile) => storedFile.s3Name === file.s3Name
            );
            if (index > -1) {
              districtDetails.reportLinks.splice(index, 1);
              await district
                .merge({ districtDetails: JSON.stringify(districtDetails) })
                .save();
            }
          }
          return true;
        case "project-document-evidence":
          if (projectId) {
            const project = await Projects.findOrFail(projectId);
            const projectMedia = project.fileUploads as IUploads;
            const index = projectMedia.evidence_files.findIndex(
              (storedFile: uploadedFile) => storedFile.s3Name === file.s3Name
            );
            if (index > -1) {
              projectMedia.evidence_files.splice(index, 1);
              await project
                .merge({ fileUploads: JSON.stringify(projectMedia) })
                .save();
              await Drive.delete(file.s3Name);
            }
          }
          return true;
        case "project-report-files":
          if (projectId) {
            const project = await Projects.findOrFail(projectId);
            const projectMedia = project.fileUploads as IUploads;
            const index = projectMedia.reports_files.findIndex(
              (storedFile: uploadedFile) => storedFile.s3Name === file.s3Name
            );
            if (index > -1) {
              projectMedia.reports_files.splice(index, 1);
              await project
                .merge({ fileUploads: JSON.stringify(projectMedia) })
                .save();
              await Drive.delete(file.s3Name);
            }
          }
        case "project-gallery":
          if (projectId) {
            const project = await Projects.findOrFail(projectId);
            const projectMedia = project.fileUploads as IUploads;
            const index = (
              projectMedia.project_gallery as uploadedFile[]
            ).findIndex(
              (storedFile: uploadedFile) => storedFile.s3Name === file.s3Name
            );
            if (index > -1) {
              (projectMedia.project_gallery as uploadedFile[]).splice(index, 1);
              await project
                .merge({ fileUploads: JSON.stringify(projectMedia) })
                .save();
              await Drive.delete(file.s3Name);
            }
          }
          return true;
      }
      console.log(userId);
    }
  }
}
