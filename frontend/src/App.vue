<script lang="ts">
export default {
  name: "App",
};
</script>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { onMounted, ref, watch } from "vue";
import { toastHandler } from "@/utils/composables/ToastHandler";
import BaseModal from "./components/modal/BaseModal.vue";
import { AssetsApi } from "@/api/services/AssestsApi";
import { ApiClient } from "@/api/ApiClient";
import { useSiteAssets } from "@/stores/SiteAssets";
import { useLanguage } from "@/utils/languages/UseLanguage";

const assetsStore = useSiteAssets();
const { setLocalLanguage } = useLanguage();
const { toastRecord, refCounter } = toastHandler();
const toast = useToast();
const assetsApi = new AssetsApi(new ApiClient());

watch(refCounter, () => {
  toast.add(toastRecord);
});

onMounted(async () => {
  try {
    setLocalLanguage();
    if (!sessionStorage.getItem("siteAssets")) {
      const response = await assetsApi.getMainAssets();
      assetsStore.setSiteAssets(response);
    }
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <BaseModal />
  <div>
    <Toast />
    <main class="flex flex-col">
      <router-view></router-view>
    </main>
  </div>
</template>

<style lang="scss" scoped>
main {
  min-height: 100vh;
}
</style>
