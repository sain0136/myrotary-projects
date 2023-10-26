<script lang="ts">
export default {
  name: "ProjectDetails",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import type {
  IDsgProject,
  IDmProject,
  IClubProject,
} from "@/utils/interfaces/IProjects";
import Banners from "@/components/banners/Banners.vue";
import { useRoute } from "vue-router";

/* Data */
const route = useRoute();
const { langTranslations } = useLanguage();
const projectId = route.query.id;
// IDsgProject | IDmProject | IClubProject
/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <Banners :banner-text="langTranslations.landingpageBannerText" />
  <p>{{ projectId ?? "Loading..." }}</p>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
