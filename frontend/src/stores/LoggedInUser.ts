import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import type { IUser } from "@/utils/interfaces/IUser";
import User from "@/utils/classes/User";

import { UsersApi } from "@/api/services/UserApi";
import { ApiClient } from "@/api/ApiClient";
import type { ClubRole, DistrictRole } from "@/utils/types/commonTypes";

export const useLoggedInUserStore = defineStore(
  "loggedInUser",
  () => {
    const loggedInUser: IUser = reactive(new User());
    const isUserLoggedIn = ref(false);

    function setLoggedInUser(user: IUser) {
      Object.assign(loggedInUser, user);
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

    return {
      loggedInUser,
      setLoggedInUser,
      isUserLoggedIn,
      logOut,
      getLoggedInUserRole,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
