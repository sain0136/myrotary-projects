<script lang="ts">
export default {
  name: "District",
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

<template>
  <div>{{ langTranslations.adminDash.settingsLabel }}</div>
</template>

<style lang="scss" scoped></style>
