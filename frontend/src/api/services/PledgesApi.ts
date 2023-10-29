import { ApiClient } from "@/api/ApiClient";
import type { IPledge } from "@/utils/interfaces/IPledge";
const BASE_ROUTE = "/pledge";

export class PledgesApi {
  constructor(private apiClient: ApiClient) {}

  public async storePledge(pledge: IPledge): Promise<boolean> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/store`,
      pledge
    );
  }
}
