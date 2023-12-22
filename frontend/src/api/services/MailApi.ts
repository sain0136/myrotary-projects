import { ApiClient } from "@/api/ApiClient";
import type { IEmail } from "@/utils/interfaces/IMail";
const BASE_ROUTE = "/mail";

export class MailApi {
  constructor(private apiClient: ApiClient) {}

  public async sendMail(mail: IEmail): Promise<boolean> {
    return await this.apiClient.fetchWrapper(
      "POST",
      `${BASE_ROUTE}/send`,
      mail
    );
  }
}
