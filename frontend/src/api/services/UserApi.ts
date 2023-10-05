import { ApiClient } from "@/api/ApiClient";
import type { IClub } from "@/utils/interfaces/IClub";
import type { IDistrict } from "@/utils/interfaces/IDistrict";
import type { IUser } from "@/utils/interfaces/IUser";
const BASE_ROUTE = "/user";
export class UsersApi {
  constructor(private apiClient: ApiClient) {}

  public async getAllUsers(): Promise<Array<IUser>> {
    return await this.apiClient.fetchWrapper("GET", `${BASE_ROUTE}`);
  }

  public async authenticateUser(
    email: string,
    password: string,
    webAdmin?: boolean
  ): Promise<{ user: IUser; district: IDistrict; club: IClub }> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/authenticate`,
      {
        email,
        password,
        webAdmin,
      }
    );
  }

  public async logoutUser(): Promise<void> {
    return await this.apiClient.fetchWrapper("POST", `${BASE_ROUTE}/logout`);
  }

  public async getUser(userId: number): Promise<IUser> {
    return await this.apiClient.fetchWrapper("POST", `${BASE_ROUTE}/getuser`, {
      userId,
    });
  }

  public async createNewUser(user: IUser): Promise<boolean> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/create`,
      user
    );
  }

  public async updateUser(user: IUser) {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/update`,
      user
    );
  }

  public async deleteUser(userId: number): Promise<boolean> {
    return await this.apiClient.fetchWrapper("POST", `${BASE_ROUTE}/delete`, {
      userId,
    });
  }
}
