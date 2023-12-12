import { Assets } from "@/utils/classes/Assests";
import type { IAssets } from "@/utils/interfaces/IAssets";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { cloneDeep } from "lodash";

export const useSiteAssets = defineStore(
  "siteAssets",
  () => {
    const siteAssets = reactive(new Assets() as IAssets);

    function setSiteAssets(assets: IAssets) {
      Object.assign(siteAssets, assets);
      sessionStorage.setItem(
        "siteAssets",
        JSON.stringify(cloneDeep(siteAssets))
      );
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
