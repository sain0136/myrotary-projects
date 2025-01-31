<script lang="ts">
export default {
  name: "SuperAdmin",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { analyticsIcon } from "@/modules/admin/components/Icons/icons";

/* Data */
const { langTranslations } = useLanguage();
const { handleError } = errorHandler();
// const { exampleProperty } = defineProps({
//   exampleProperty: string;
// });

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <div
    class="h-full justify-center text-center gap-4 flex items-center flex-col text-2xl font-bold"
  >
    <a
      href="#"
      class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
    >
      <div class="icon flex justify-center mb-4" v-html="analyticsIcon"></div>
      <a
        class="text-blue-600 hover:text-primary mt-4"
        target="_blank"
        href="https://analytics.myrotaryprojects.org"
        >{{ langTranslations.adminDash.rotaryAnalyticsLink }}</a
      >
      <p class="font-normal text-gray-700 mt-4 text-left">
        {{ langTranslations.rotaryAnalyticsDescription }}
      </p>
    </a>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.icon {
  color: #2f4f4f;
}
</style>
