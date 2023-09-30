import { Assets } from "@/utils/classes/Assests";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useSiteAssets = defineStore(
  "siteAssets",
  () => {
    const siteAssets = reactive(new Assets());

    function setSiteAssets(assets: Assets) {
      Object.assign(siteAssets, assets);
    }

    return {
      siteAssets,
      setSiteAssets,
    };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  }
);
