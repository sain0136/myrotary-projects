import Drive from "@ioc:Adonis/Core/Drive";
import type { IAssets } from "App/Shared/Interfaces/IAssets";

import Assets from "App/Models/Assets";
import Users from "App/Models/Users";
import { IUser, uploadedFile } from "App/Shared/Interfaces/IUser";
import { databaseTarget } from "App/Shared/Types/commonTypes";
import Projects from "App/Models/Projects";
import { IUploads } from "App/Shared/Interfaces/IProjects";
import { IDistrictDetails } from "App/Shared/Interfaces/IDistrict";
import Districts from "App/Models/Districts";

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
    databaseTarget: databaseTarget,
    userId?: number,
    projectId?: number,
    districtId?: number
  ): Promise<Array<uploadedFile> | undefined | Users> {
    try {
      switch (databaseTarget) {
        case "assets":
          for await (const file of uploadedFiles) {
            const rotaryAssets = await Assets.findOrFail(1);
            const mainAsses = (rotaryAssets as unknown as IAssets).assets; // TODO: Fix this main asses lol
            if (mainAsses.main_logo && mainAsses.main_logo.s3Name) {
              await Drive.delete(mainAsses.main_logo.s3Name);
            }
            mainAsses.main_logo = file;
            await rotaryAssets
              .merge({
                assets: JSON.stringify(mainAsses),
              })
              .save();
          }
          const updatedAssets = await Assets.findOrFail(1);
          return [
            (updatedAssets.assets as unknown as IAssets)
              .main_logo as unknown as uploadedFile,
          ];
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
        case "profile-picture-user":
          for await (const file of uploadedFiles) {
            const userProfile = await Users.findOrFail(userId);
            const toDeleteName = (userProfile.extraDetails as IUser)
              ?.profilePicture?.s3Name;
            if (toDeleteName) {
              await Drive.delete(toDeleteName);
            }
            let extraDetails = {
              ...(userProfile.$attributes as IUser).extra_details,
            };
            if (Object.keys(extraDetails).length > 0) {
              extraDetails.profilePicture = file;
            } else {
              extraDetails = { profilePicture: file };
            }
            await userProfile
              .merge({
                extraDetails: JSON.stringify(extraDetails),
              })
              .save();
          }
          const updatedUser = await Users.findOrFail(userId);
          return updatedUser ?? [];
        case "project-media":
          const project = await Projects.findOrFail(projectId);
          const projectMedia = project.fileUploads as IUploads;
          for await (const file of uploadedFiles) {
            if (file.fileType === "project-coverImage") {
              const toDeleteName =
                (projectMedia?.project_image as uploadedFile)?.s3Name || null;
              if (toDeleteName) {
                await Drive.delete(toDeleteName);
              }
              projectMedia.project_image = file as uploadedFile;
            }
            if (file.fileType === "project-document-evidence") {
              if (!projectMedia.evidence_files) {
                projectMedia.evidence_files = [];
              }
              projectMedia.evidence_files.push(file as uploadedFile);
            }
            if (file.fileType === "project-report-files") {
              if (!projectMedia.reports_files) {
                projectMedia.reports_files = [];
              }
              projectMedia.reports_files.push(file as uploadedFile);
            }
            if (file.fileType === "project-gallery") {
              if (!projectMedia.project_gallery) {
                projectMedia.project_gallery = [];
              }
              projectMedia.project_gallery.push(file as uploadedFile);
            }
          }
          await project
            .merge({
              fileUploads: JSON.stringify(projectMedia),
            })
            .save();
          return [];
        case "district-report-files":
          const district = await Districts.findOrFail(districtId);
          const districtDetails =
            district.districtDetails as unknown as IDistrictDetails;
          for await (const file of uploadedFiles) {
            districtDetails.reportLinks.push(file as uploadedFile);
          }
          await district
            .merge({
              districtDetails: JSON.stringify(districtDetails),
            })
            .save();
          return [];
        default:
          return [];
      }
    } catch (error) {
      console.error("Database Error:", error);
    }
  }
}
