import { ApiClient } from "@/api/ApiClient";
import type { uploadFileData } from "@/utils/types/commonTypes";
export class UploadsApi {
  constructor(private apiClient: ApiClient) {}

  public async uploadFile(
    uploadFileData: uploadFileData
  ): Promise<object | undefined> {
    let fd = new FormData();
    switch (uploadFileData.fileTypes) {
      case "main-logo":
        fd.append("files", uploadFileData.files[0]);
        fd.append("storagePath", uploadFileData.storagePath);
        fd.append("databaseTarget", uploadFileData.databaseTarget);
        fd.append("fileTypes", uploadFileData.fileTypes);
        const response = await this.apiClient.axiosWrapper("/uploadFiles", fd);
        return response;
        break;
      default:
        break;
    }
  }
}
