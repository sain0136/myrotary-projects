<script lang="ts">
export default {
  name: "",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";

/* Data */
const { langTranslations } = useLanguage();

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template></template>

<style lang="scss" scoped></style>