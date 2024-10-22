import { ApiClient } from "@/api/ApiClient";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import type { IClub } from "@/utils/interfaces/IClub";
import type { IDistrict } from "@/utils/interfaces/IDistrict";
import type { IUser } from "@/utils/interfaces/IUser";
import type { PaginationResult } from "@/utils/types/commonTypes";
const BASE_ROUTE = "/user";

export class UsersApi {
  constructor(private apiClient: ApiClient) {}

  private getLoggedInUser(): IUser {
    return useLoggedInUserStore().loggedInUser;
  }

  public async getAllUsers(
    isProspect: boolean,
    limit?: number,
    currentPage?: number,
    districtId?: number
  ): Promise<PaginationResult> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/getAllUsers`,
      {
        isProspect,
        limit,
        currentPage,
        districtId,
      }
    );
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

  public async logoutUser(user: IUser): Promise<void> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/logout`,
      user
    );
  }

  public async getUser(userId: number): Promise<IUser> {
    return await this.apiClient.fetchWrapper("POST", `${BASE_ROUTE}/getuser`, {
      userId,
    });
  }

  public async createNewUser(user: IUser): Promise<void> {
    const sourceUser = this.getLoggedInUser();
    console.log(
      "Logged in user asking to create " +
        sourceUser.fullName +
        " id: " +
        sourceUser.user_id
    );
    await this.apiClient.fetchWrapper("POST", `${BASE_ROUTE}/create`, {
      user,
      sourceUser,
    });
  }

  public async createProspectUser(user: IUser): Promise<boolean> {
    const sourceUser = this.getLoggedInUser();
    user.is_prospect = true;
    return await this.apiClient.fetchWrapper("POST", `${BASE_ROUTE}/create`, {
      user,
      sourceUser,
    });
  }

  public async updateUser(user: IUser) {
    const sourceUser = this.getLoggedInUser();
    return await this.apiClient.fetchWrapper("POST", `${BASE_ROUTE}/update`, {
      user,
      sourceUser,
    });
  }

  public async deleteUser(userId: number): Promise<boolean> {
    const sourceUser = this.getLoggedInUser();
    return await this.apiClient.fetchWrapper("POST", `${BASE_ROUTE}/delete`, {
      userId,
      sourceUser,
    });
  }

  public async deleteProspectUser(user: IUser): Promise<boolean> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/deleteProspectUser`,
      user
    );
  }

  public async stripeRegistration(
    userId: string,
    clubId: string,
    langCode?: string
  ): Promise<{ url: string }> {
    return await this.apiClient.fetchWrapper("POST", `/stripeRegistration`, {
      userId,
      clubId,
      langCode,
    });
  }
}
