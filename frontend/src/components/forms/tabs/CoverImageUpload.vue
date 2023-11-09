<script lang="ts">
export default {
  name: "CoverImageUpload",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";

/* Data */
const { langTranslations } = useLanguage();
const { handleError } = errorHandler();

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template></template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
