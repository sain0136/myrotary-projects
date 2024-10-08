import { ApiClient } from "@/api/ApiClient";
import type { uploadFileData, uploadedFile } from "@/utils/types/commonTypes";
import { CustomErrors } from "@/utils/classes/CustomErrors";
import type { ICustomError } from "@/utils/interfaces/ICustomError";
import type { IUser } from "@/utils/interfaces/IUser";
const BASE_ROUTE = "/uploads";

export class UploadsApi {
  constructor(private apiClient: ApiClient) {}

  public async uploadFile(
    uploadFileData: uploadFileData,
    userId?: number,
    projectId?: number,
    districtId?: number,
    customIdentifier?: string
  ): Promise<object | undefined | IUser> {
    const fd = new FormData();
    if (uploadFileData.fileTypes) {
      if (uploadFileData.files.length > 1) {
        for (let i = 0; i < uploadFileData.files.length; i++) {
          fd.append("files", uploadFileData.files[i]);
        }
      } else {
        fd.append("files", uploadFileData.files[0]);
      }
      fd.append("storagePath", uploadFileData.storagePath);
      fd.append("databaseTarget", uploadFileData.databaseTarget);
      fd.append("fileTypes", uploadFileData.fileTypes);
      if (userId) {
        fd.append("userId", userId.toString());
      }
      if (projectId) {
        fd.append("projectId", projectId.toString());
      }
      if (districtId) {
        fd.append("districtId", districtId.toString());
      }
      if (customIdentifier) {
        fd.append("customIdentifier", customIdentifier);
      }
      const response = await this.apiClient.axiosWrapper("/uploadFiles", fd);
      return response;
    }
  }

  public async deleteFiles(
    toDeleteUploads: uploadedFile[],
    projectId?: number,
    districtId?: number,
    userId?: number
  ) {
    return await this.apiClient.fetchWrapper("POST", `${BASE_ROUTE}/delete`, {
      toDeleteUploads,
      projectId,
      districtId,
      userId,
    });
  }
}
