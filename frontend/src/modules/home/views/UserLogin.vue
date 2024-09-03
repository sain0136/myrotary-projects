<script lang="ts">
export default {
  name: "UserLogin",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive } from "vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import BaseInput from "@/components/form/BaseInput.vue";
import { UsersApi } from "@/api/services/UserApi";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { ApiClient } from "@/api/ApiClient";
import type { CustomError } from "@/utils/classes/CustomError";
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers, minLength } from "@vuelidate/validators";
import router from "@/router";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import Banners from "@/components/banners/Banners.vue";
import { useLoggedInDistrict } from "@/stores/LoggedInDistrict";
import { useLoggedInClub } from "@/stores/LoggedInClub";
import { useProspectUserStore } from "@/stores/ProspecUserStore";
import { DistrictApi } from "@/api/services/DistrictsApi";

/* Data */
const { langTranslations, customPrintf } = useLanguage();
const { handleError, handleSuccess } = errorHandler();
const state = reactive({
  email: "",
  password: "",
});
const userStore = useLoggedInUserStore();
const prospectUserStore = useProspectUserStore();
const districtStore = useLoggedInDistrict();
const clubStore = useLoggedInClub();
const usersApi = new UsersApi(new ApiClient());
const districtApi = new DistrictApi(new ApiClient());

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
onMounted(async () => {});

/* Methods */
const handleSubmit = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  try {
    const response = await usersApi.authenticateUser(
      state.email,
      state.password
    );
    userStore.setLoggedInUser(response.user);
    districtStore.setLoggedInDistrict(response.district);
    clubStore.setLoggedInClub(response.club);
    handleSuccess(
      customPrintf(
        langTranslations.value.adminLoginForm.successfulLogin,
        userStore.loggedInUser.fullName
      )
    );
    router.push({ name: "AdminWelcome" });
    const districtId =
      userStore.loggedInUser.user_type === "SUPER"
        ? undefined
        : userStore.loggedInUser.district_id!;
    // use ProspectUserStore so we can update our notification icon
    const allProspectUsers = await usersApi.getAllUsers(
      true,
      undefined,
      undefined,
      districtId
    );
    prospectUserStore.setHasProspectUsers(Object(allProspectUsers).length > 0);
  } catch (error) {
    handleError(error as CustomError);
  }
};
</script>

<template>
  <Banners :banner-text="langTranslations.loginLabel" />
  <div class="flex justify-center items-center my-8">
    <form
      @submit.prevent="handleSubmit"
      class="bg-nearWhite w-4/5 md:w-auto lg:w-1/4 p-5 rounded-lg border-solid border-primary border-2"
    >
      <div class="py-10">
        <BaseInput
          v-model="state.email"
          :label="langTranslations.email"
          :type="'email'"
          :required="true"
          :errorMessage="v$.email?.$errors[0]?.$message as string | undefined"
        />
        <BaseInput
          v-model="state.password"
          :label="langTranslations.password"
          :type="'password'"
          :required="true"
          :errorMessage="v$.password?.$errors[0]?.$message as string | undefined"
        />
        <RotaryButton
          :label="langTranslations.adminLoginForm.signIn"
          theme="primary"
          class="w-full"
          type="submit"
        />
        <router-link :to="{ name: 'CreateAccount' }">
          <!--Path-->
          <span
            href="#"
            class="block py-2 pl-3 pr-4 font-bold text-gray-900 rounded hover:text-primary text-center"
            aria-current="page"
            >{{ langTranslations.createAccountLabel }}</span
          >
        </router-link>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
