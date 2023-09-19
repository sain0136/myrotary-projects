import { ApiClient } from "@/api/ApiClient";
import type { IUser } from "@/utils/interfaces/IUser";

export class UsersApi {
  constructor(private apiClient: ApiClient) {}

  public async getAllUsers(): Promise<Array<IUser>> {
    try {
      return await this.apiClient.fetchWrapper("GET", "/user/");
    } catch (error) {
      throw error;
    }
  }
}
