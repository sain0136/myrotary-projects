import { CustomErrors } from "@/utils/classes/CustomErrors";
import type { ICustomError } from "@/utils/interfaces/ICustomError";
import axios from "axios";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import router from "@/router";
import { useLoggedInClub } from "@/stores/LoggedInClub";
import { useLoggedInDistrict } from "@/stores/LoggedInDistrict";
import type { IUser } from "@/utils/interfaces/IUser";

export class ApiClient {
  private baseURL = import.meta.env.VITE_BASE_API_URL;
  private sid: string | null = null;
  constructor() {
    this.sid = useLoggedInUserStore().$state.isUserLoggedIn
      ? useLoggedInUserStore().$state.SID
      : null;
  }

  // TODO: add Return Type in future
  public async fetchWrapper(
    method: string,
    endpoint: string,
    data?: object | string | FormData | null,
    sourceUser?: IUser // The user who is making the api call
  ): Promise<any | ICustomError> {
    const url = `${this.baseURL}${endpoint}${
      this.sid ? `?sid=${this.sid}` : ""
    }`;
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
      credentials: "include",
    };
    const response = await fetch(url, options);
    const jsonData = await response.json();
    if (response.status === 601) {
      this.handleSessionTimeout();
    }
    if (response.status !== 200) {
      const partialError = jsonData as unknown as ICustomError;

      if (partialError.message?.includes("JSON")) {
        throw new CustomErrors(501, partialError.message as string, {
          en: "Internal Server Error. Please try again later.",
          fr: "Erreur interne du serveur. Veuillez reessayer plus tard.",
        });
      }
      throw new CustomErrors(
        partialError.statusCode,
        partialError.rawMessage,
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
    const url = `${this.baseURL}${endpoint}${
      this.sid ? `?sid=${this.sid}` : ""
    }`;
    const response = await axios.post(url, data, {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    if (response.status !== 200) {
      const partialError = response.data as unknown as ICustomError;
      throw new CustomErrors(
        partialError.statusCode,
        partialError.rawMessage,
        partialError.translatedMessage
      );
    }
    return response.data;
  }

  private async handleSessionTimeout() {
    try {
      // TODO: delete this and that modal when it's ready
      // const { langTranslations } = useLanguage();
      // const { changeShowModal, setModal } = modalHandler();
      // setModal(
      //   langTranslations.value.sessionTimeoutHeader,
      //   langTranslations.value.sessionTimeoutBody
      // );
      // changeShowModal();
      const userStore = useLoggedInUserStore();
      const districtStore = useLoggedInDistrict();
      const clubStore = useLoggedInClub();
      await userStore.logOut();
      districtStore.resetDistrict();
      clubStore.resetClub();
      router.push({ name: "UserLogin" });
      return;
    } catch (error) {
      console.log(error);
    }
  }
}
