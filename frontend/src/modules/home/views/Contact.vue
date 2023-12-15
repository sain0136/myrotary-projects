<script lang="ts">
export default {
  name: "Contact",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref, reactive, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import ResourceList from "@/utils/classes/ResourceList";
import BaseSelect from "@/components/form/BaseSelect.vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import Banners from "@/components/banners/Banners.vue";



import { errorHandler } from "@/utils/composables/ErrorHandler";
import router from "@/router";
import H2 from "@/components/headings/H2.vue";
import Hr from "@/components/hr/Hr.vue";
import { email, helpers, required } from "@vuelidate/validators/dist/index.mjs";
import BaseTextarea from "@/components/form/BaseTextarea.vue";
import Contact from "@/utils/classes/Contact"
import BaseInput from "@/components/form/BaseInput.vue";


/* Data */
const { langTranslations } = useLanguage();
const contact = reactive(new Contact());


/* Hooks */
onMounted(async () => {});

/* Methods */

/* Validation */
const rules = {
  firstname: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  lastname: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  user_city: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  user_province: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  user_country: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  phone: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  email:{
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  query: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  }
}
const v$ = useVuelidate(rules, contact);


</script>

<template>
  <form @submit.prevent class="">
    <Banners :banner-text="langTranslations.contactusBannerText" />
    <Hr />
    <div class="form-block">
      <BaseInput
        v-model="contact.firstname"
        :label="langTranslations.nameLabel"
        :type="'text'"
        :errorMessage="v$.firstname?.$errors[0]?.$message as string | undefined"
      />
      <BaseInput
        v-model="contact.phone"
        :label="langTranslations.phone"
        :type="'text'"
        :errorMessage="v$.phone?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="contact.email"
        :label="langTranslations.email"
        :type="'email'"
        :errorMessage="v$.email?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="contact.user_city"
        :label="langTranslations.cityLabel"
        :type="'text'"
        :errorMessage="v$.user_city?.$errors[0]?.$message as string | undefined "
      />
      <BaseSelect
        v-model="contact.user_country"
        :label="langTranslations.countryLabel"
        :options="ResourceList.countryList"
        :errorMessage="v$.user_country?.$errors[0]?.$message as string | undefined "
      />
      <BaseSelect
        v-if="
          (contact.user_country !== '' && contact.user_country === 'United States') ||
          contact.user_country === 'Canada'
        "
        v-model="contact.user_province"
        :label="langTranslations.stateOrProvinceLabel"
        :options="
          contact.user_country === 'United States'
            ? ResourceList.usaStatesList
            : ResourceList.canadaProvinceList
        "
        :errorMessage="v$.user_province?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-else-if="contact.user_country !== ''"
        v-model="contact.user_province"
        :label="langTranslations.stateOrProvinceLabel"
        :type="'text'"
        :errorMessage="v$.user_province?.$errors[0]?.$message as string | undefined"
      />
    </div>
    <div>
      <BaseTextarea
      v-model="contact.query"
      :label="langTranslations.queryLabel"
      :type="'text'"
      :errorMessage="v$.query?.$errors[0]?.$message as string | undefined"
      />
    </div>
    <div class="button_row mt-4 flex justify-center gap-4">
      <RotaryButton
        :theme="'primary'"
        :label="'Submit'"
      />
    </div>
    
  </form>
</template>


<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
