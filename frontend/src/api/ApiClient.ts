import { CustomErrors } from "@/utils/classes/CustomErrors";
import type { ICustomError } from "@/utils/interfaces/ICustomError";
import axios from "axios";
import router from "@/router";

export class ApiClient {
  private baseURL = import.meta.env.VITE_BASE_API_URL;
  constructor() { }

  public async fetchWrapper(
    method: string,
    endpoint: string,
    data?: object | string | FormData | null
  ): Promise<any | ICustomError> {
    const browserType = this.getBrowserType();

    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "browser-type": browserType,
    };
    const { useLoggedInUserStore } = await import("@/stores/LoggedInUser");

    if (useLoggedInUserStore().isUserLoggedIn) {
      headers["logged-in"] = "true";
    }

    const options: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : null,
      credentials: "include",
    };
    const response = await fetch(url, options);
    let jsonData;
    try {
      jsonData = await response.json();
    } catch (error) {
      jsonData = {};
    }
    return await this.processResponse(response, jsonData);
  }

  public async axiosWrapper(
    endpoint: string,
    data?: object | string | FormData | null,
    headers: Record<string, string> = {}
  ): Promise<any | ICustomError> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await axios.post(url, data, {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    await this.processResponse(response, response.data);
    return response.data;
  }

  private async handleSessionTimeout() {
    try {
      const { logoutUser } = await import("@/utils/utils"); // Lazy load logout to ensure userStore is initialized
      await logoutUser();
      return;
    } catch (error) {
      console.log(error);
    }
  }

  private getBrowserType() {
    const userAgent = navigator.userAgent;

    if (
      userAgent.includes("Chrome") &&
      !userAgent.includes("Edge") &&
      !userAgent.includes("OPR")
    ) {
      return "Chrome";
    } else if (userAgent.includes("Firefox")) {
      return "Firefox";
    } else {
      return "Other";
    }
  }

  private async processResponse(response: any, jsonData: any) {
    const errorObject = jsonData as unknown as ICustomError;
    if (response.status === 601) {
      await this.handleSessionTimeout();
    }
    if (response.status === 402) {
      this.handleClubNotSubscribed(errorObject);
      return undefined;
    }
    if (response.status === 504) {
      throw new CustomErrors(504, {
        en: "Internal Server Error. Please try again later.",
        fr: "Erreur interne du serveur. Veuillez reessayer plus tard.",
      });
    }
    if (response.status !== 200) {
      if (errorObject.message?.includes("JSON")) {
        throw new CustomErrors(501, {
          en: "Internal Server Error. Please try again later.",
          fr: "Erreur interne du serveur. Veuillez reessayer plus tard.",
        });
      }
      throw new CustomErrors(
        errorObject.statusCode,
        errorObject.translatedMessage
      );
    }
    return jsonData;
  }

  private handleClubNotSubscribed(errorObject: ICustomError) {
    if (
      errorObject.errorData &&
      errorObject.errorData.clubId &&
      errorObject.errorData.userId
    ) {
      router.push({
        name: "ClubNotSubscribed",
        query: {
          userId: errorObject.errorData.userId,
          clubId: errorObject.errorData.clubId,
        },
      });
    } else {
      throw new CustomErrors(402, {
        en: "Club not subscribed. Contact your administrator.",
        fr: "Club non souscrit. Contactez votre administrateur.",
      });
    }
  }
}
