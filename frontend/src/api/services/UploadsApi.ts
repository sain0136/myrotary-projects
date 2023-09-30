import { ApiClient } from "@/api/ApiClient";
import type { uploadFileData } from "@/utils/types/commonTypes";
import { CustomError } from "@/utils/classes/CustomError";
import type { ICustomError } from "@/utils/interfaces/ICustomError";
export class UploadsApi {
  constructor(private apiClient: ApiClient) {}

  public async uploadFile(
    uploadFileData: uploadFileData
  ): Promise<object | undefined> {
    let fd = new FormData();
    if (uploadFileData.fileTypes) {
      fd.append("files", uploadFileData.files[0]);
      fd.append("storagePath", uploadFileData.storagePath);
      fd.append("databaseTarget", uploadFileData.databaseTarget);
      fd.append("fileTypes", uploadFileData.fileTypes);
      const response = await this.apiClient.axiosWrapper("/uploadFiles", fd);
      return response;
    }
  }
}
