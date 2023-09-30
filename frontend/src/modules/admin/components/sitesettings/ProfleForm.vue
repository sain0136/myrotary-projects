<script lang="ts">
export default {
  name: "ProfleForm",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import BaseFileUpload from "@/components/form/BaseFileUpload.vue";
import { ApiClient } from "@/api/ApiClient";
import { UploadsApi } from "@/api/services/UploadsApi";
import type { uploadFileData } from "@/utils/types/commonTypes";
/* Data */
const { langTranslations } = useLanguage();

const reqData = {
  databaseTarget: "assets",
  storagePath: "./siteadmin",
  files: [],
  fileTypes: "profile-picture",
} as uploadFileData;
/* Hooks */
onMounted(async () => {});
</script>

<template>
  <BaseFileUpload
    :submit-label="langTranslations.saveLabel"
    :req-data="reqData"
  />
</template>

<style lang="scss" scoped></style>
