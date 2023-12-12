<script lang="ts">
export default {
  name: "SiteConfigForm",
};
</script>

<script setup lang="ts">
import { useLanguage, type lang } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import BaseInput from "@/components/form/BaseInput.vue";
import BaseTextarea from "@/components/form/BaseTextarea.vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { AssetsApi } from "@/api/services/AssestsApi";
import { ApiClient } from "@/api/ApiClient";
import type { CustomError } from "@/utils/classes/CustomError";
import { Assets } from "@/utils/classes/Assests";
import { useSiteAssets } from "@/stores/SiteAssets";

/* Bug with reactivity of BaseTextArea on change idk why lang verson
 but its written to the db
*/

/* Data */
const { langTranslations } = useLanguage();
const assetsApi = new AssetsApi(new ApiClient());
const { handleError, handleSuccess } = errorHandler();
const formLanguage = ref<lang>("en");
let state = reactive(new Assets());
const assetsStore = useSiteAssets();

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
    assetsStore.setSiteAssets(response);
    handleSuccess(langTranslations.value.toastSuccess);
  } catch (error) {
    handleError(error as CustomError);
  }
};
</script>

<template>
  <div class="mt-4 flex justify-center">
    <RotaryButton
      @click="
        () => {
          if (formLanguage === 'en') {
            formLanguage = 'fr';
          } else {
            formLanguage = 'en';
          }
        }
      "
      :theme="'primary'"
      :label="
        formLanguage === 'en'
          ? langTranslations.french + ' ' + langTranslations.versionLabel
          : langTranslations.english + ' ' + langTranslations.versionLabel
      "
    />
  </div>
  <form @submit.prevent>
    <div class="form-block">
      <BaseInput
        v-model="state.assets.contentManagement.myRotaryEmail[formLanguage]"
        :label="
          langTranslations.myRotaryProjectsLabel + ' ' + langTranslations.email
        "
        :type="'email'"
        :error-message="''"
      />
      <BaseInput
        v-model="state.assets.contentManagement.myRotaryPhone[formLanguage]"
        :label="
          langTranslations.myRotaryProjectsLabel + ' ' + langTranslations.phone
        "
        :type="'text'"
        :error-message="''"
      />
      <BaseInput
        v-model="
          state.assets.contentManagement.myRotaryAdminFullName[formLanguage]
        "
        :label="
          langTranslations.myRotaryProjectsLabel +
          ' ' +
          langTranslations.configFormLabels.adminFullNam
        "
        :type="'text'"
        :error-message="''"
      />
      <BaseInput
        v-model="
          state.assets.contentManagement.myRotaryAdminEmail[formLanguage]
        "
        :label="langTranslations.webmasterLabel + ' ' + langTranslations.email"
        :type="'email'"
        :error-message="''"
      />
      <BaseInput
        v-model="state.assets.contentManagement.myRotaryAddress[formLanguage]"
        :label="
          langTranslations.myRotaryProjectsLabel +
          ' ' +
          langTranslations.addressLabel
        "
        :type="'text'"
        :error-message="''"
      />
      <BaseInput
        v-model="state.assets.contentManagement.myRotaryCity[formLanguage]"
        :label="
          langTranslations.myRotaryProjectsLabel +
          ' ' +
          langTranslations.cityLabel
        "
        :type="'text'"
        :error-message="''"
      />
      <BaseInput
        v-model="state.assets.contentManagement.myRotaryProvince[formLanguage]"
        :label="
          langTranslations.myRotaryProjectsLabel +
          ' ' +
          langTranslations.stateOrProvinceLabel
        "
        :type="'text'"
        :error-message="''"
      />
      <BaseInput
        v-model="state.assets.contentManagement.myRotaryCountry[formLanguage]"
        :label="
          langTranslations.myRotaryProjectsLabel +
          ' ' +
          langTranslations.countryLabel
        "
        :type="'text'"
        :error-message="''"
      />
      <BaseInput
        v-model="
          state.assets.contentManagement.myRotaryPostalCode[formLanguage]
        "
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
        v-model="state.assets.contentManagement.myRotaryAbout[formLanguage]"
        :label="
          langTranslations.myRotaryProjectsLabel +
          ' ' +
          langTranslations.aboutLabel
        "
      />
      <BaseTextarea
        v-model="
          state.assets.contentManagement.myRotaryfooterDescription[formLanguage]
        "
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
