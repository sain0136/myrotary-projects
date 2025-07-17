import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import type { IUser } from "@/utils/interfaces/IUser";
import User from "@/utils/classes/User";

import { UsersApi } from "@/api/services/UserApi";
import { ApiClient } from "@/api/ApiClient";
import type { ClubRole, DistrictRole } from "@/utils/types/commonTypes";
import * as luxon from "luxon";
import { useLoggedInDistrict } from "./LoggedInDistrict";

export const useLoggedInUserStore = defineStore(
  "loggedInUser",
  () => {
    const loggedInUser: IUser = reactive(new User());
    const isUserLoggedIn = ref(false);
    const serverSent = ref({
      connected: false,
      errorDisconnect: false,
      lastPing: luxon.DateTime.now(),
    });

    function setLoggedInUser(user: IUser) {
      Object.assign(loggedInUser, user);
      setServerSentEvents(user);
      isUserLoggedIn.value = true;
    }

    async function logOut() {
      const usersApi = new UsersApi(new ApiClient());
      await usersApi.logoutUser(loggedInUser);
      isUserLoggedIn.value = false;
      Object.assign(loggedInUser, new User());
    }

    function getLoggedInUserRole():
      | DistrictRole
      | ClubRole
      | "SuperAdmin"
      | "" {
      if (!loggedInUser) return "";
      if (loggedInUser.user_type === "SUPER") {
        return "SuperAdmin";
      }
      if (loggedInUser.user_type === "CLUB") {
        return loggedInUser.role as ClubRole;
      } else {
        return loggedInUser.role as DistrictRole;
      }
    }

    /**
     * When user refreshes the page, this function is called to check if user is
     * logged in, if yes, it will establish the server sent events connection again.
     * The credentials sent will overwrite the entry in the backend and the connection
     * will be re-established.
     */
    function initializeSSEForLoggedInUser() {
      if (isUserLoggedIn.value) {
        setServerSentEvents(loggedInUser);
      }
    }

    return {
      loggedInUser,
      setLoggedInUser,
      isUserLoggedIn,
      logOut,
      getLoggedInUserRole,
      initializeSSEForLoggedInUser,
      serverSent,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);

/**
 * Establishes a server-sent event connection with the server, listening for events
 * specific to the given user. The connection is persisted in the store as
 * `serverSent.connected`, and any errors are stored as `serverSent.errorDisconnect`.
 */
const setServerSentEvents = (user: IUser) => {
  const userId = user.user_id ?? undefined;
  const districtId = user.district_id ?? undefined;
  const eventSource = new EventSource(
    `${import.meta.env.VITE_BASE_API_URL}/user/events/${userId}/${districtId}`
  );

  eventSource.onmessage = (event) => {
    const eventData = JSON.parse(event.data);
    if (eventData.data === "PING") {
      useLoggedInUserStore().serverSent.lastPing = luxon.DateTime.now();
      return;
    }
    if (eventData.dataType === "DISTRICT_UPDATE") {
      console.log("District Update Received");
      useLoggedInDistrict().setLoggedInDistrict(eventData);
      return;
    }
    useLoggedInUserStore().serverSent.connected = true;
  };

  eventSource.onerror = (err) => {
    console.error(err);
    useLoggedInUserStore().serverSent.errorDisconnect = true;
    eventSource.close();
  };
};
