<script lang="ts">
export default {
  name: "ProjectDetails",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref, watch } from "vue";
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
import Carousel from "primevue/carousel";
import type { uploadFileData, uploadedFile } from "@/utils/types/commonTypes";

/* Data */
const router = useRouter();
const { currencyFormatterFunding } = useCurrencyFormatter();
const projectsApi = new ProjectsApi(new ApiClient());
const route = useRoute();
const { langTranslations, languagePref } = useLanguage();
const projectId = route.query.id ? Number(route.query.id as string) : undefined;
const { handleError } = errorHandler();
const project: IDsgProject | IDmProject | IClubProject | IGenericProject =
  reactive(new GenericProject());
const areasOfFocus = ref<
  Array<{
    name: string;
    imgLink: string;
  }>
>([]);
const { setActiveProject, resetActiveProject } = useActiveProjectStore();
const loaded = ref(false);
const galleryImages = ref<Array<uploadFileData | uploadedFile>>([]);

const responsiveOptions = [
  {
    breakpoint: "1400px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "1199px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "767px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "575px",
    numVisible: 1,
    numScroll: 1,
  },
];
const conversion = ref(ResourceList.reverseTermConversionMap());

/* Hooks */
watch(
  () => languagePref.value,
  async () => {
    setAreaOfFocusLanguage();
  }
);

onMounted(async () => {
  try {
    if (projectId) {
      const response = await projectsApi.getProject(projectId);
      Object.assign(project, response);
      resetActiveProject();
      setActiveProject(project);
      setAreaOfFocusLanguage();
      galleryImages.value = useActiveProjectStore().activeProject.file_uploads
        .project_gallery
        ? (useActiveProjectStore().activeProject.file_uploads
            .project_gallery as Array<uploadFileData | uploadedFile>)
        : [];
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
const setAreaOfFocusLanguage = () => {
  areasOfFocus.value = [];
  for (const [key, value] of Object.entries(project.area_focus)) {
    if (value === true) {
      const keyOf = conversion.value.get(key) ?? {
        en: "",
        fr: "",
      };
      areasOfFocus.value.push({
        name: keyOf[languagePref.value] as string,
        imgLink: keyOf.imgLink as string,
      });
    }
  }
};

const viewFullDescription = (
  project: IDsgProject | IDmProject | IClubProject
) => {
  try {
    const id = project.project_id ?? null;
    if (id) {
      switch (project.grant_type) {
        case "Club Project":
          router.push({
            path: `club/${id}`,
            query: {
              formType: "readOnlyView",
            },
          });
          return;
        case "District Simplified Project":
          router.push({
            path: `simplified/${id}`,
            query: {
              formType: "readOnlyView",
            },
          });
          return;
        case "District Matching Project":
          router.push({
            path: `matching/${id}`,
            query: {
              formType: "readOnlyView",
            },
          });
          return;
        default:
          throw new CustomErrors(900, "Project not found", {
            en: "Project not found",
            fr: "Projet introuvable",
          });
      }
    } else {
      throw new CustomErrors(900, "Project not found", {
        en: "Project not found",
        fr: "Projet introuvable",
      });
    }
  } catch (error) {
    handleError(error as CustomErrors);
  }
};
</script>

<template>
  <Banners :banner-text="langTranslations.landingpageBannerText" />
  <div class="fluid-container pt-8 p-2" v-if="project && loaded">
    <H3 :content="project.project_name" class="text-center" />
    <!-- Basic Info -->
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
    <!-- Project Description -->
    <Hr />
    <div
      class="project-description flex flex-col items-center gap-8 md:flex-row md:gap-0"
    >
      <div>
        <H3
          class="mb-4"
          :content="`${langTranslations.projectLabel} ${langTranslations.desciptionLabel}`"
        >
        </H3>
        <blockquote class="w-5/6 border-l-4 border-gray-400 py-4 px-4">
          {{ project.project_description ?? "" }}
        </blockquote>
        <div class="details-container text mt-4 w-1/2">
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
                    <!-- <Icon icon="ep:right" class="text-primary font-bold" />{{
                      area
                    }} -->
                    <div class="flex">
                      <div class="flex gap-4">
                        <img
                          class="w-12"
                          :src="'/area-focus/' + area.imgLink"
                          alt=""
                        />
                        <p class="flex items-center">{{ area.name }}</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </blockquote>
        </div>
      </div>
      <div class="view-full-description flex flex-col justify-center w-1/2">
        <RotaryButton
          :theme="'secondary'"
          :label="langTranslations.viewFullDescriptionLabel"
          @click="
            viewFullDescription(
              useActiveProjectStore().activeProject as
                | IDsgProject
                | IDmProject
                | IClubProject
            )
          "
        />
      </div>
    </div>
    <!-- Gallery -->
    <Hr v-if="galleryImages.length > 0" />
    <div v-if="galleryImages.length > 0" class="flex flex-col gap-8">
      <H3 :content="langTranslations.projectLabels.galleryLabel" />
      <Carousel
        :value="galleryImages"
        :numVisible="3"
        :numScroll="3"
        :responsive-options="responsiveOptions"
      >
        <template #item="slotProps: { data: uploadedFile }">
          <div
            class="border-1 surface-border border-round m-2 text-center py-5 px-3"
          >
            <div class="mb-3">
              <img
                :src="slotProps.data.s3UrlLink"
                :alt="slotProps.data.s3BaseUrlLink"
                class="aspect-ratio cursor-pointer object-cover shadow-2"
              />
            </div>
          </div>
        </template>
      </Carousel>
    </div>
    <!-- Rotary Pledge Process -->
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
  <LoadingSpinner v-else-if="!loaded" />
  <div v-else-if="!project">
    <H1 :content="langTranslations.projectNotFoundError" />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
