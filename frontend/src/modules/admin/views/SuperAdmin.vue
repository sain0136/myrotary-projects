<script lang="ts">
export default {
  name: "SuperAdmin",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";

/* Data */
const { langTranslations } = useLanguage();
const { handleError } = errorHandler();
// const { exampleProperty } = defineProps<{
//   exampleProperty: string;
// }>();

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <div
    class="h-full justify-center text-center gap-4 flex items-center flex-col text-2xl font-bold"
  >
    <a
      class="text-blue-600 hover:text-primary"
      target="_blank"
      href="https://analytics.myrotaryprojects.org"
      >{{ langTranslations.adminDash.rotaryAnalticsLink }}</a
    >
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
