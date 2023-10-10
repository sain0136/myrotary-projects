<script lang="ts">
export default {
  name: "About",
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

<template>HI</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
