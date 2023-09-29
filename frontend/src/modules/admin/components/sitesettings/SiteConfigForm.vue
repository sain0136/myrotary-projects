<script lang="ts">
export default {
  name: "SiteConfigForm",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import BaseInput from "@/components/form/BaseInput.vue";
/* Data */
const { langTranslations } = useLanguage();

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <form @submit.prevent>
    <div class="form-container">
      <BaseInput
        v-model="langTranslations.adminDash.logoTabLabel"
        :label="
          langTranslations.myRotaryProjectsLabel + ' ' + langTranslations.email
        "
        :type="'email'"
        required
        :error-m-essage="''"
      />
      <BaseInput
        v-model="langTranslations.adminDash.settingsLabel"
        :label="
          langTranslations.myRotaryProjectsLabel + ' ' + langTranslations.email
        "
        :type="'text'"
        required
        :error-m-essage="''"
      />
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
