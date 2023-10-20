<script lang="ts">
export default {
  name: "ProfileForm",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted } from "vue";
import BaseFileUpload from "@/components/form/BaseFileUpload.vue";
import type { uploadFileData } from "@/utils/types/commonTypes";
/* Data */
const { langTranslations } = useLanguage();

const reqData = {
  databaseTarget: "profile-picture",
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
