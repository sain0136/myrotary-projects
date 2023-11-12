<script lang="ts">
export default {
  name: "ErrorValidation",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";

/* Data */
const { langTranslations } = useLanguage();
const { handleError } = errorHandler();
const { errorMsg } = defineProps<{
  errorMsg: string | undefined;
}>();

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <p id="filled_error_help" class="text-xs text-red-600 dark:text-red-400 mb-8">
    <span class="font-medium">{{ errorMsg }}</span>
  </p>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
