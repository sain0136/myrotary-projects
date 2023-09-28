import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import type { IUser } from "@/utils/interfaces/IUser";
import User from "@/utils/classes/User";

import { UsersApi } from "@/api/services/UserApi";
import { ApiClient } from "@/api/ApiClient";

export const useLoggedInUserStore = defineStore(
  "loggedInUser",
  () => {
    const loggedInUser: IUser = reactive(new User());

    const isUserLoggedIn = ref(false);

    function setLoggedInUser(user: IUser) {
      // loggedInUser = user;
      Object.assign(loggedInUser, user);
      isUserLoggedIn.value = true;
    }

    async function logOut() {
      Object.assign(loggedInUser, new User());
      isUserLoggedIn.value = false;
      const usersApi = new UsersApi(new ApiClient());
      await usersApi.logoutUser();
      // loggedInUser = reactive(new User());
    }

    function getLoggedInUserRole() {
      if (!loggedInUser) return;
      if (loggedInUser.user_id === 2) {
        return "Webmaster";
      }
      if (loggedInUser.user_type === "CLUB") {
        return loggedInUser.role[0].club_role;
      } else {
        return loggedInUser.role[0].district_role;
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
