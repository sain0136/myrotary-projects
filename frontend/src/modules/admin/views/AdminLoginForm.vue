<script lang="ts">
export default {
  name: "AdminLoginForm",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import BaseInput from "@/components/form/BaseInput.vue";
import H3 from "@/components/headings/H3.vue";
import H2 from "@/components/headings/H2.vue";
import { UsersApi } from "@/api/services/UserApi";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { ApiClient } from "@/api/ApiClient";
import type { CustomError } from "@/utils/classes/CustomError";
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers, minLength } from "@vuelidate/validators";
import { loginUser } from "@/utils/utils";

/* Data */
const show = ref(false);
const { handleError, handleSuccess } = errorHandler();
const { langTranslations } = useLanguage();
const state = reactive({
  email: "",
  password: "",
});
// const logo = ref("");
const usersApi = new UsersApi(new ApiClient());

/* Validations */
const rules = {
  email: {
    emailFormat: helpers.withMessage(
      langTranslations.value.formErorrText.emailFormat,
      email
    ),
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  password: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    minLength: helpers.withMessage(
      langTranslations.value.formErorrText.minLength,
      minLength(6)
    ),
  },
};
const v$ = useVuelidate(rules, state);

/* Hooks */
onMounted(() => {
  show.value = true;
});
onUnmounted(() => {
  show.value = false;
});

/* Methods */
const handleSubmit = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  try {
    const response = await usersApi.authenticateUser(
      state.email,
      state.password,
      true
    );
    if (response) {
      loginUser(response);
      handleSuccess(langTranslations.value.adminLoginForm.successfulLogin);
    }
  } catch (error) {
    handleError(error as CustomError);
  }
};

const errorMessageForEmail = () => {
  const error = v$.value.email?.$errors[0];
  return error ? error.$message.toString() : undefined;
};

const errorMessageForPassword = () => {
  const error = v$.value.password?.$errors[0];
  return error ? error.$message.toString() : undefined;
};
</script>

<template>
  <div
    class="flex justify-center items-center min-h-screen bg-gradient-to-r from-primary to-secondary"
  >
    <Transition>
      <form
        v-if="show"
        @submit.prevent
        class="bg-nearWhite p-5 rounded-lg shadow-2xl"
      >
        <div class="flex items-center flex-col mb-5 format">
          <img src="/test.png" alt="Image" class="h-auto max-w-1/2 mx-auto" />
          <H2 :content="langTranslations.welcome" />
          <H3
            class="text-gray-600"
            :content="langTranslations.adminLoginForm.subHeading"
          ></H3>
        </div>

        <div>
          <BaseInput
            v-model="state.email"
            :label="langTranslations.email"
            :type="'email'"
            :required="true"
            :errorMessage="errorMessageForEmail()"
          />
          <BaseInput
            v-model="state.password"
            :label="langTranslations.password"
            :type="'password'"
            :required="true"
            :errorMessage="errorMessageForPassword()"
          />
          <RotaryButton
            @click="handleSubmit"
            :label="langTranslations.adminLoginForm.login"
            theme="primary"
            class="w-full"
          />
        </div>
      </form>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
