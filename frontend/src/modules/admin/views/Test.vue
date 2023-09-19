<script lang="ts">
export default {
  name: "Test",
};
</script>

<script setup lang="ts">
import { UsersApi } from "@/api/services/UserApi";
import type { IUser } from "@/utils/interfaces/IUser";
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { ApiClient } from "@/api/ApiClient";
import { useToast } from "primevue/usetoast";
import { toastHandler } from "@/utils/composables/ToastHandler";
import type { ICustomError } from "@/utils/interfaces/ICustomError";

const { langTranslations, languagePref } = useLanguage();

const { handleToast } = toastHandler();

const toast = useToast();

const showSuccess = () => {
  toast.add({
    severity: "success",
    summary: "Success Message",
    detail: "Message Content",
    life: 3000,
  });
};

const apiClient = new ApiClient();
const usersApi = new UsersApi(apiClient);
const users = ref<Array<IUser>>([]);
onMounted(async () => {
  try {
    const alluser = await usersApi.getAllUsers();
    showSuccess();
    users.value = alluser;
  } catch (error) {
    const customError = error as ICustomError;
    if (customError.translatedMessage[languagePref.value]) {
      handleToast(
        "error",
        langTranslations.value.toastError,
        customError.translatedMessage[languagePref.value],
        "5000"
      );
    } else if (customError.message) {
      handleToast(
        "error",
        langTranslations.value.toastError,
        customError.message,
        "5000"
      );
    }
  }
});

const toastControler = () => {
  handleToast("warn", "You suck", "My dick", "5000");
};
</script>

<template>
  <div>
    <button
      @click="toastControler"
      class="text-xl text-near-white bg-amber-300 p-4 my-3 rounded-sm"
    >
      Yo BRo
    </button>
    <ul
      class="w-48 text-lg font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    >
      <li
        v-for="user in users"
        :key="user.user_id"
        class="w-full px-4 text-neutral-950 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600"
      >
        {{ user.fullName + " " + user.role_type }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped></style>
