import { ApiClient } from "@/api/ApiClient";
import type { IClub } from "@/utils/interfaces/IClub";
import type { IDistrict } from "@/utils/interfaces/IDistrict";
import type { IUser } from "@/utils/interfaces/IUser";
import type { PaginationResult } from "@/utils/types/commonTypes";
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

  public async logoutUser(user: IUser): Promise<void> {
    return await this.apiClient.fetchWrapper("POST", `${BASE_ROUTE}/logout`, user);
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

  //TODO: This method can potentially only be implemented on the frontend, we`re using 
  //same obj, just passing an optional prop
  public async createProspectUser(user: IUser): Promise<boolean>{
    //return await this.apiClient.fetchWrapper("POST",`${BASE_ROUTE}/prospectUsers/create`,user)
    user.is_prospect = true
    return await this.apiClient.fetchWrapper("POST",`${BASE_ROUTE}/createProspect`,user);
  }

  public async getAllProspectUsers(): Promise<Array<IUser>>{
    const allUsers: Array<IUser> =  await this.apiClient.fetchWrapper("GET",`${BASE_ROUTE}`)
    return allUsers.filter((user)=> user.is_prospect)
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
