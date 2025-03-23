<script lang="ts">
export default {
  name: "PasswordSet",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref, watch } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import img from "@/assets/pass-reset.jpg";
import { object, string } from "yup";
import { ValidationError } from "yup";
import { CustomErrors } from "@/utils/classes/CustomErrors";

/* Data */
const { langTranslations } = useLanguage();
const { handleError } = errorHandler();
const password = ref<string>("");
const confirmPassword = ref<string>("");
const errorMessage = ref<string>("");

/* Validation Schema */
const schema = object({
  password: string()
    .required(langTranslations.value.passwordRequired)
    .matches(/^.{8,}$/, langTranslations.value.passwordMinLimit),
  confirmPassword: string()
    .required(langTranslations.value.confirmPasswordRequired)
    .test(
      "passwords-match",
      langTranslations.value.passwordMismatch,
      function (
        this: { parent: { password: string } },
        value: string
      ): boolean {
        return this.parent.password === value;
      }
    ),
});

/* Hooks */
onMounted(async () => {});

watch([password, confirmPassword], () => {
  errorMessage.value = "";
});

/* Methods */
const submit = async () => {
  try {
    await schema.validate({
      password: password.value,
      confirmPassword: confirmPassword.value,
    });
    console.log("Password set successfully");
  } catch (error) {
    if (error instanceof ValidationError) {
      errorMessage.value = error.errors[0];
    } else {
      handleError(error as CustomErrors);
    }
  }
};
</script>
<template>
  <section class="bg-gray-50" :style="{ backgroundImage: `url(${img})` }">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <div
        class="w-full p-6 bg-white rounded-lg shadow border md:mt-0 sm:max-w-md sm:p-8"
      >
        <h2
          class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
        >
          {{ langTranslations.setPassword }}
        </h2>
        <form
          class="mt-4 space-y-4 lg:mt-5 md:space-y-5"
          action="#"
          @submit.prevent
        >
          <div>
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900"
            >
              {{ langTranslations.password }}</label
            >
            <input
              type="password"
              name="password"
              id="password"
              v-model="password"
              placeholder="••••••••"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              required="true"
            />
          </div>
          <div>
            <label
              for="confirm-password"
              class="block mb-2 text-sm font-medium text-gray-900"
              >{{ langTranslations.confirmPassword }}</label
            >
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              placeholder="••••••••"
              v-model="confirmPassword"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              required="true"
            />
          </div>
          <p v-if="errorMessage" class="text-red-600 text-sm">
            {{ errorMessage }}
          </p>
          <RotaryButton
            :label="langTranslations.submit"
            theme="primary"
            class="w-full"
            type="submit"
            :disable="!password || !confirmPassword"
            @click="submit"
          />
        </form>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

section {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}
</style>
