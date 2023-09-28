import { defineStore } from "pinia";
import { reactive, ref } from "vue";

import type { IClub } from "@/utils/interfaces/IClub";
import Club from "@/utils/classes/Club";

export const useLoggedInClub = defineStore(
  "loggedInClub",
  () => {
    const loggedInClub = reactive<IClub>(new Club());

    function setLoggedInClub(club: IClub) {
      Object.assign(loggedInClub, club);
    }

    function resetClub() {
      Object.assign(loggedInClub, new Club());
    }

    return {
      loggedInClub,
      setLoggedInClub,
      resetClub,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
