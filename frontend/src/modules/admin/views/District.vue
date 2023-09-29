<script lang="ts">
export default {
  name: "District",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { UsersApi } from "@/api/services/UserApi";
import { ApiClient } from "@/api/ApiClient";
/* Data */
const { langTranslations } = useLanguage();
const usersApi = new UsersApi(new ApiClient());
/* Hooks */
onMounted(async () => {
  const response = await usersApi.getAllUsers();
});

/* Methods */
</script>

<template>
  <div>hoi</div>
</template>

<style lang="scss" scoped></style>
