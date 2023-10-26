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
import { CustomError } from "@/utils/classes/CustomError";
import H1 from "@/components/headings/H1.vue";
import H3 from "@/components/headings/H3.vue";
import { useCurrencyFormatter } from "@/utils/composables/CurrencyFormatter";
import Hr from "@/components/hr/Hr.vue";

/* Data */
const { currencyFormatterFunding } = useCurrencyFormatter();
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
    } else {
      throw new CustomError(900, "Project not found", {
        en: "Project not found",
        fr: "Projet non trouvé",
      });
    }
  } catch (error) {
    handleError(error as CustomError, true);
  }
});

/* Methods */
</script>

<template>
  <Banners :banner-text="langTranslations.landingpageBannerText" />
  <div class="fluid-container pt-8" v-if="project">
    <H3 :content="project.project_name" class="text-center" />
    <Hr />
    <div class="flex flex-col">
      <span>
        <strong>{{ langTranslations.projectCodeLabel }}:</strong>
        {{ project.project_code }}
      </span>
      <span v-if="project.projectDetails?.districtClubData.clubName">
        <Strong> {{ langTranslations.clubLabel }}: </Strong>
        {{ project.projectDetails.districtClubData.clubName }}
      </span>
      <span v-if="project.projectDetails?.districtClubData.district_name">
        <Strong> {{ langTranslations.districtLabel }}: </Strong>
        {{ project.projectDetails.districtClubData.district_name }}
      </span>
      <span>
        <Strong> {{ langTranslations.landingPage.grantTypeLabel }}: </Strong>
        {{ project.grant_type }}
      </span>
      <span>
        <strong>{{ langTranslations.projectLabels.raisedLabel }}:</strong>
        {{ currencyFormatterFunding(project.anticipated_funding) }}</span
      >
      <span
        ><strong>{{ langTranslations.projectLabels.goalLabel }}: </strong>
        {{ currencyFormatterFunding(project.funding_goal) }}
      </span>
      <span
        ><strong>{{ langTranslations.projectLabels.estimatedLabel }}: </strong
        >{{ project.completion_date }}</span
      >
      <span
        ><strong>{{ langTranslations.statusLabel }}: </strong
        >{{ project.project_status }}</span
      >
    </div>
    <Hr />
  </div>
  <div v-else>
    <H1 :content="langTranslations.projectNotFoundError" />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
