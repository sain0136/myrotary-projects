import { ApiClient } from "@/api/ApiClient";
import type { IClub } from "@/utils/interfaces/IClub";
import type { IDistrict } from "@/utils/interfaces/IDistrict";
import type { IUser } from "@/utils/interfaces/IUser";
export class UsersApi {
  constructor(private apiClient: ApiClient) {}

  public async getAllUsers(): Promise<Array<IUser>> {
    return await this.apiClient.fetchWrapper("GET", "/user/");
  }

  public async authenticateUser(
    email: string,
    password: string,
    webAdmin?: boolean
  ): Promise<{ user: IUser; district: IDistrict; club: IClub }> {
    return await this.apiClient.fetchWrapper("POST", "/user/authenticate/", {
      email,
      password,
      webAdmin,
    });
  }
}
