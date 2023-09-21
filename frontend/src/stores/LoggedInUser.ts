import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import type { IUser } from "@/utils/interfaces/IUser";
import User from "@/utils/classes/User";

export const useLoggedInUserStore = defineStore(
  "loggedInUser",
  () => {
    let loggedInUser: IUser = reactive(new User());

    const isUserLoggedIn = ref(false);

    function setLoggedInUser(user: IUser) {
      // loggedInUser = user;
      Object.assign(loggedInUser, user);
      isUserLoggedIn.value = true;
    }

    function logOut() {
      Object.assign(loggedInUser, new User());
      isUserLoggedIn.value = false;
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
