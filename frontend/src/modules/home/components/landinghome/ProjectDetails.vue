<script lang="ts">
export default {
  name: "ProjectDetails",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import type {
  IDsgProject,
  IDmProject,
  IClubProject,
  IGenericProject,
} from "@/utils/interfaces/IProjects";
import Banners from "@/components/banners/Banners.vue";
import { useRoute } from "vue-router";
import { ProjectsApi } from "@/api/services/ProjectsApi";
import { ApiClient } from "@/api/ApiClient";
import { CustomErrors } from "@/utils/classes/CustomErrors";
import H1 from "@/components/headings/H1.vue";
import H3 from "@/components/headings/H3.vue";
import { useCurrencyFormatter } from "@/utils/composables/CurrencyFormatter";
import Hr from "@/components/hr/Hr.vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import ResourceList from "@/utils/classes/ResourceList";
import GenericProject from "@/utils/classes/GenericProject";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import { useActiveProjectStore } from "@/stores/ActiveProjectStore";
import LoadingSpinner from "@/components/loading/LoadingSpinner.vue";

/* Data */
const router = useRouter();
const { currencyFormatterFunding } = useCurrencyFormatter();
const projectsApi = new ProjectsApi(new ApiClient());
const route = useRoute();
const { langTranslations } = useLanguage();
const projectId = route.query.id ? Number(route.query.id as string) : undefined;
const { handleError } = errorHandler();
const project: IDsgProject | IDmProject | IClubProject | IGenericProject =
  reactive(new GenericProject());
const areasOfFocus = ref<string[]>([]);
const { setActiveProject, resetActiveProject } = useActiveProjectStore();
const loaded = ref(false);

/* Hooks */
onMounted(async () => {
  try {
    if (projectId) {
      const response = await projectsApi.getProject(projectId);
      Object.assign(project, response);
      resetActiveProject();
      setActiveProject(project);
      const conversion = ResourceList.reverseTermConversionMap;
      for (const [key, value] of Object.entries(response.area_focus)) {
        if (value === true) {
          areasOfFocus.value.push(conversion().get(key) as string);
        }
      }
      loaded.value = true;
    } else {
      throw new CustomErrors(900, "Project not found", {
        en: "Project not found",
        fr: "Projet non trouvé",
      });
    }
  } catch (error) {
    handleError(error as CustomErrors, true);
  }
});

/* Methods */
</script>

<template>
  <Banners :banner-text="langTranslations.landingpageBannerText" />

  <div class="fluid-container pt-8 p-2" v-if="project && loaded">
    <H3 :content="project.project_name" class="text-center" />
    <Hr />
    <div
      class="upper-container items-center flex flex-col gap-6 md:flex-row justify-between"
    >
      <div class="flex flex-col">
        <span class="flex gap-2">
          <p class="font-bold">{{ langTranslations.projectCodeLabel }}:</p>
          {{ project.project_code }}
        </span>
        <span
          class="flex gap-2"
          v-if="project.projectDetails?.districtClubData.clubName"
        >
          <p class="font-bold">{{ langTranslations.clubLabel }}:</p>
          {{ project.projectDetails.districtClubData.clubName }}
        </span>
        <span
          class="flex gap-2"
          v-if="project.projectDetails?.districtClubData.district_name"
        >
          <p class="font-bold">{{ langTranslations.districtLabel }}:</p>
          {{ project.projectDetails.districtClubData.district_name }}
        </span>
        <span class="flex gap-2">
          <p class="font-bold">
            {{ langTranslations.landingPage.grantTypeLabel }}:
          </p>
          {{ project.grant_type }}
        </span>
        <span class="flex gap-2">
          <p class="font-bold">
            {{ langTranslations.projectLabels.raisedLabel }}:
          </p>
          {{ currencyFormatterFunding(project.anticipated_funding) }}</span
        >
        <span class="flex gap-2"
          ><p class="font-bold">
            {{ langTranslations.projectLabels.goalLabel }}:
          </p>
          {{ currencyFormatterFunding(project.funding_goal) }}
        </span>
        <span class="flex gap-2"
          ><p class="font-bold">
            {{ langTranslations.projectLabels.estimatedLabel }}:
          </p>
          {{ project.completion_date }}</span
        >
        <span class="flex gap-2"
          ><p class="font-bold">{{ langTranslations.statusLabel }}:</p>
          {{ project.project_status }}</span
        >
      </div>
      <div class="flex flex-col justify-end">
        <div v-if="project.anticipated_funding != project.funding_goal">
          <RotaryButton
            :theme="'secondary'"
            :label="langTranslations.projectLabels.pledgeLabel"
            @click="router.push({ name: 'PledgeForm' })"
          />
        </div>
        <div
          class="fully"
          v-else-if="project.anticipated_funding == project.funding_goal"
        >
          <h1 class="bg-secondary py-2 px-4 font-bold">
            {{ langTranslations.projectLabels.fullyFundedLabel }}
          </h1>
        </div>
      </div>
    </div>
    <Hr />
    <div class="lower-container">
      <div>
        <H3
          class="mb-4"
          :content="`${langTranslations.projectLabel} ${langTranslations.desciptionLabel}`"
        >
        </H3>
        <blockquote class="w-5/6 border-l-4 border-gray-400 py-4 px-4">
          {{ project.project_description ?? "" }}
        </blockquote>
      </div>
      <div class="text mt-4">
        <blockquote>
          <ul>
            <li>
              <span class="text-xl font-bold"
                >{{ langTranslations.landingPage.regionLabel }}:</span
              >
              {{ project.region }}
            </li>
            <li class="mt-8">
              <span class="text-xl font-bold">
                {{ langTranslations.countryLabel }}:
              </span>
              {{ project.country }}
            </li>
            <li class="mt-8">
              <span class="text-xl font-bold">
                {{ langTranslations.landingPage.areaOfFocusLabel }}:
              </span>
              <ul class="mt-4 flex flex-col gap-4 p-4">
                <li
                  v-for="area in areasOfFocus"
                  :key="area + 'area_focus'"
                  class="ml-4 flex gap-2 text-xl items-center italic"
                >
                  <Icon icon="ep:right" class="text-primary font-bold" />{{
                    area
                  }}
                </li>
              </ul>
            </li>
          </ul>
        </blockquote>
      </div>
      <hr class="mt-8 h-px w-full border-0 bg-gray-500" />

      <div class="faq-section my-8 flex justify-between">
        <div class="content_column">
          <h1 class="mb-2 text-2xl font-bold">
            {{ langTranslations.pledgeProcess.pledgeProcessLabel }}
          </h1>
          <ol start="1" class="faq_steps flex flex-col gap-6 md:gap-2">
            <li class="flex gap-2 items-center">
              <Icon
                icon="fluent-mdl2:radio-bullet"
                class="text-primary hidden md:block md:text-lg"
              />
              <span class="md:font-semibold">{{
                langTranslations.pledgeProcess.bulletPoint1
              }}</span>
            </li>
            <li class="flex gap-2 items-center">
              <Icon
                icon="fluent-mdl2:radio-bullet"
                class="text-primary hidden md:block md:text-lg"
              />
              <span class="md:font-semibold">{{
                langTranslations.pledgeProcess.bulletPoint2
              }}</span>
            </li>
            <li class="flex gap-2 items-center">
              <Icon
                icon="fluent-mdl2:radio-bullet"
                class="text-primary hidden md:block md:text-lg"
              />
              <span class="md:font-semibold">{{
                langTranslations.pledgeProcess.bulletPoint3
              }}</span>
            </li>
            <li class="flex gap-2 items-center">
              <Icon
                icon="fluent-mdl2:radio-bullet"
                class="text-primary hidden md:block md:text-lg"
              />
              <span class="md:font-semibold">{{
                langTranslations.pledgeProcess.bulletPoint4
              }}</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
  <LoadingSpinner v-else-if="!loaded" />
  <div v-else-if="!project">
    <H1 :content="langTranslations.projectNotFoundError" />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
