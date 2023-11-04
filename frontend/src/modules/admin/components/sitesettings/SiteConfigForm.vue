<script lang="ts">
export default {
  name: "SiteConfigForm",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import BaseInput from "@/components/form/BaseInput.vue";
import BaseTextarea from "@/components/form/BaseTextarea.vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { AssetsApi } from "@/api/services/AssestsApi";
import { ApiClient } from "@/api/ApiClient";
import type { CustomError } from "@/utils/classes/CustomError";
import { Assets } from "@/utils/classes/Assests";

/* Data */
const { langTranslations } = useLanguage();
const assetsApi = new AssetsApi(new ApiClient());
const { handleError, handleSuccess } = errorHandler();
let state = reactive(new Assets());
/* Hooks */
onMounted(async () => {
  try {
    const response = await assetsApi.getMainAssets();
    state = Object.assign(state, response);
  } catch (error) {
    handleError(error as CustomError);
  }
});

/* Methods */
const submit = async () => {
  try {
    const response = await assetsApi.updateAssets(state);
    state = Object.assign(state, response);
    handleSuccess(langTranslations.value.toastSuccess);
  } catch (error) {
    handleError(error as CustomError);
  }
};
</script>

<template>
  <form @submit.prevent>
    <div class="form-block">
      <BaseInput
        v-model="state.assets.contentManagement.myRotaryEmail"
        :label="
          langTranslations.myRotaryProjectsLabel + ' ' + langTranslations.email
        "
        :type="'email'"
        :error-message="''"
      />
      <BaseInput
        v-model="state.assets.contentManagement.myRotaryPhone"
        :label="
          langTranslations.myRotaryProjectsLabel + ' ' + langTranslations.phone
        "
        :type="'text'"
        :error-message="''"
      />
      <BaseInput
        v-model="state.assets.contentManagement.myRotaryAdminFullName"
        :label="
          langTranslations.myRotaryProjectsLabel +
          ' ' +
          langTranslations.configFormLabels.adminFullNam
        "
        :type="'text'"
        :error-message="''"
      />
      <BaseInput
        v-model="state.assets.contentManagement.myRotaryAdminEmail"
        :label="langTranslations.webmasterLabel + ' ' + langTranslations.email"
        :type="'email'"
        :error-message="''"
      />
      <BaseInput
        v-model="state.assets.contentManagement.myRotaryAddress"
        :label="
          langTranslations.myRotaryProjectsLabel +
          ' ' +
          langTranslations.addressLabel
        "
        :type="'text'"
        :error-message="''"
      />
      <BaseInput
        v-model="state.assets.contentManagement.myRotaryCity"
        :label="
          langTranslations.myRotaryProjectsLabel +
          ' ' +
          langTranslations.cityLabel
        "
        :type="'text'"
        :error-message="''"
      />
      <BaseInput
        v-model="state.assets.contentManagement.myRotaryProvince"
        :label="
          langTranslations.myRotaryProjectsLabel +
          ' ' +
          langTranslations.stateOrProvinceLabel
        "
        :type="'text'"
        :error-message="''"
      />
      <BaseInput
        v-model="state.assets.contentManagement.myRotaryCountry"
        :label="
          langTranslations.myRotaryProjectsLabel +
          ' ' +
          langTranslations.countryLabel
        "
        :type="'text'"
        :error-message="''"
      />
      <BaseInput
        v-model="state.assets.contentManagement.myRotaryPostalCode"
        :label="
          langTranslations.myRotaryProjectsLabel +
          ' ' +
          langTranslations.postalCodeLabel
        "
        :type="'text'"
        :error-message="''"
      />
    </div>
    <div class="form-block">
      <BaseTextarea
        v-model="state.assets.contentManagement.myRotaryAbout"
        :label="
          langTranslations.myRotaryProjectsLabel +
          ' ' +
          langTranslations.aboutLabel
        "
      />
      <BaseTextarea
        v-model="state.assets.contentManagement.myRotaryfooterDescription"
        :label="
          langTranslations.myRotaryProjectsLabel +
          ' ' +
          langTranslations.footerLabel
        "
      />
    </div>
    <div class="flex justify-center">
      <RotaryButton
        @click="submit"
        :theme="'black'"
        :label="langTranslations.saveLabel"
      />
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
