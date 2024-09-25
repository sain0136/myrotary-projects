import { CustomErrors } from "@/utils/classes/CustomErrors";
import type { ICustomError } from "@/utils/interfaces/ICustomError";
import axios from "axios";

export class ApiClient {
  private baseURL = import.meta.env.VITE_BASE_API_URL;
  constructor() {}

  // TODO: add Return Type in future
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
    const jsonData = await response.json();
    if (response.status === 601) {
      await this.handleSessionTimeout();
    }
    if (response.status !== 200) {
      const partialError = jsonData as unknown as ICustomError;

      if (partialError.message?.includes("JSON")) {
        throw new CustomErrors(501, {
          en: "Internal Server Error. Please try again later.",
          fr: "Erreur interne du serveur. Veuillez reessayer plus tard.",
        });
      }
      throw new CustomErrors(
        partialError.statusCode,
        partialError.translatedMessage
      );
    }
    return jsonData;
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
    if (response.status === 601) {
      this.handleSessionTimeout();
    }
    if (response.status !== 200) {
      const partialError = response.data as unknown as ICustomError;
      throw new CustomErrors(
        partialError.statusCode,
        partialError.translatedMessage
      );
    }
    return response.data;
  }

  private async handleSessionTimeout() {
    try {
      // TODO: delete this modal component  and that modal when it's ready
      // const { langTranslations } = useLanguage();
      // const { changeShowModal, setModal } = modalHandler();

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
}
