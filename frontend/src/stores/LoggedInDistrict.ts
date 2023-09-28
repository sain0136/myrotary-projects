import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import District from "@/utils/classes/District";
import type { IDistrict } from "@/utils/interfaces/IDistrict";

export const useLoggedInDistrict = defineStore(
  "loggedInDistrict",
  () => {
    const loggedInDistrict = reactive(new District());

    function setLoggedInDistrict(district: IDistrict) {
      Object.assign(loggedInDistrict, district);
    }

    function resetDistrict() {
      Object.assign(loggedInDistrict, new District());
    }

    return {
      loggedInDistrict,
      setLoggedInDistrict,
      resetDistrict,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
