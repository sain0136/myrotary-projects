<script lang="ts">
export default {
  name: "template",
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
  <div></div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
