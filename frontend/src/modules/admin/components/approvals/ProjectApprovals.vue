<script lang="ts">
export default {
  name: "ProjectApprovals",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import H3 from "@/components/headings/H3.vue";

/* Data */
const { langTranslations } = useLanguage();
const { handleError } = errorHandler();
const { exampleProperty } = defineProps<{
  exampleProperty: string;
}>();

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <H3
    class="text-center py-8"
    :content="
      langTranslations.projectsLabel + ' ' + langTranslations.approvalsLabel
    "
  />
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
