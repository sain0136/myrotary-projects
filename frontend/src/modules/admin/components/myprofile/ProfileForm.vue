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
import { useLoggedInUserStore } from "@/stores/LoggedInUser";

/* Data */
const userStore = useLoggedInUserStore();
const { langTranslations } = useLanguage();
const reqData = {
  databaseTarget: "profile-picture-user",
  storagePath: "./users",
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
    :user-id="userStore.loggedInUser.user_id"
    :acceptedFileTypes="'imageOnly'"
  />
</template>

<style lang="scss" scoped></style>
