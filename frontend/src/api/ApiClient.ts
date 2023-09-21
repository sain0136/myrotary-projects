import { CustomError } from "@/utils/classes/customError";
import type { ICustomError } from "@/utils/interfaces/ICustomError";

export class ApiClient {
  private baseURL = import.meta.env.VITE_BASE_API_URL;

  constructor() {}

  // TODO: add Return Type in future
  public async fetchWrapper(
    method: string,
    endpoint: string,
    data?: object | string | FormData | null
  ): Promise<any | ICustomError> {
    const url = `${this.baseURL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    };
    const response = await fetch(url, options);
    const jsonData = await response.json();
    if (response.status !== 200) {
      const partialError = jsonData as unknown as ICustomError;
      throw new CustomError(
        partialError.statusCode,
        partialError.rawMessage,
        partialError.translatedMessage
      );
    }
    return jsonData;
  }
}
