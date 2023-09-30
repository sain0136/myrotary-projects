import { Assets } from "@/utils/classes/Assests";
import type { IAssets } from "@/utils/interfaces/IAssets";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useSiteAssets = defineStore(
  "siteAssets",
  () => {
    const siteAssets = reactive(new Assets() as IAssets);

    function setSiteAssets(assets: IAssets) {
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
