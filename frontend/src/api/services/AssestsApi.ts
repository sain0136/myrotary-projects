import { ApiClient } from "@/api/ApiClient";
import { type IAssets } from "@/utils/interfaces/IAssets";
const BASE_ROUTE = "/assets";
export class AssetsApi {
  constructor(private apiClient: ApiClient) {}

  public async getMainAssets(): Promise<IAssets> {
    return await this.apiClient.fetchWrapper("GET", BASE_ROUTE);
  }

  public async updateAssets(updateAssets: object): Promise<IAssets> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/update`,
      updateAssets
    );
  }

  public async getCurrencies(): Promise<[]> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/getCurrencies`
    );
  }
}
