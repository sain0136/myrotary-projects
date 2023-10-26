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
import { ProjectsApi } from "@/api/services/ProjectsApi";
import { ApiClient } from "@/api/ApiClient";
import type { CustomError } from "@/utils/classes/CustomError";

/* Data */
const projectsApi = new ProjectsApi(new ApiClient());
const route = useRoute();
const { langTranslations } = useLanguage();
const projectId = route.query.id ? Number(route.query.id as string) : undefined;
const { handleError } = errorHandler();
const project = ref<IClubProject | IDsgProject | IDmProject>();
//
/* Hooks */
onMounted(async () => {
  try {
    if (projectId) {
      const response = await projectsApi.getProject(projectId);
      project.value = response;
    }
  } catch (error) {
    handleError(error as CustomError);
  }
});

/* Methods */
</script>

<template>
  <Banners :banner-text="langTranslations.landingpageBannerText" />
  <p>{{ projectId ?? "Loading..." }}</p>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
