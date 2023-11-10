<script lang="ts">
export default {
  name: "ProjectUploads",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import BaseFileUpload from "@/components/form/BaseFileUpload.vue";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import type { uploadFileData } from "@/utils/types/commonTypes";
import H4 from "@/components/headings/H4.vue";
import { useRoute } from "vue-router";

/* Data */
const { langTranslations } = useLanguage();
const { handleError } = errorHandler();
const coverImageReqData = {
  databaseTarget: "project-media",
  storagePath: "./projects",
  files: [],
  fileTypes: "project-coverImage",
} as uploadFileData;
const route = useRoute();
// required form data
const projectId =
  route.params.projectId !== "" ? Number(route.params.projectId) : null;
//

const { projectType } = defineProps<{
  projectType: "club" | "dsg" | "dm";
}>();
/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <div class="flex flex-col gap-8 justify-center items-center py-8">
    <!-- Cover Image Upload -->
    <div
      class="flex h-1/2 w-full md:w-1/3 max-w-md flex-col gap-2 rounded-lg border border-primary p-4"
    >
      <H4
        class="text-center"
        :content="langTranslations.projectFormLabels.coverImageUploadHeader"
      />
      <BaseFileUpload
        :submit-label="langTranslations.saveLabel"
        :req-data="coverImageReqData"
        :acceptedFileTypes="'/image/*'"
        :project-id="projectId ?? 0"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
