import { ApiClient } from "@/api/ApiClient";
import type { uploadFileData } from "@/utils/types/commonTypes";
import { CustomErrors } from "@/utils/classes/CustomErrors";
import type { ICustomError } from "@/utils/interfaces/ICustomError";
import type { IUser } from "@/utils/interfaces/IUser";
export class UploadsApi {
  constructor(private apiClient: ApiClient) {}

  public async uploadFile(
    uploadFileData: uploadFileData,
    userId?: number,
    projectId?: number
  ): Promise<object | undefined | IUser> {
    let fd = new FormData();
    if (uploadFileData.fileTypes) {
      fd.append("files", uploadFileData.files[0]);
      fd.append("storagePath", uploadFileData.storagePath);
      fd.append("databaseTarget", uploadFileData.databaseTarget);
      fd.append("fileTypes", uploadFileData.fileTypes);
      if (userId) {
        fd.append("userId", userId.toString());
      }
      if (projectId) {
        fd.append("projectId", projectId.toString());
      }
      const response = await this.apiClient.axiosWrapper("/uploadFiles", fd);
      return response;
    }
  }
}
