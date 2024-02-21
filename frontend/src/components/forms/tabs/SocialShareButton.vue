<script lang="ts">
export default {
  name: "SocialShareButton",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { useActiveProjectStore } from "@/stores/ActiveProjectStore";
import { Icon } from "@iconify/vue";

/* Data */
const { langTranslations } = useLanguage();
const urlForShare = ref("");
if (import.meta.env.MODE === "development") {
  urlForShare.value = "http://localhost:5173/";
} else {
  urlForShare.value = import.meta.env.VITE_APP_BASE_URL;
}
console.log(urlForShare.value); //TO
const data = {
  urlForShare: urlForShare.value,
  title: useActiveProjectStore().activeProject?.project_name ?? "Lorem",
  description:
    useActiveProjectStore().activeProject?.project_description ?? "Lorem",
};

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <div class="share py-8 flex justify-center">
    <button
      class="inline-flex items-center rounded-full bg-blue-700 py-4 px-4 text-white hover:bg-blue-800"
    >
      <Icon icon="uiw:facebook" class="mr-2 text-2xl" />
      <ShareNetwork
        network="facebook"
        :url="data.urlForShare"
        :title="data.title"
        :description="data.description"
        quote="Check Out this rotary project and make a pledge!"
        hashtags="myrotaryprojects,rotary,projects, rotary club"
        class="link"
      >
        {{ langTranslations.projectFormLabels.vueSocialSharingLabel }}
      </ShareNetwork>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
