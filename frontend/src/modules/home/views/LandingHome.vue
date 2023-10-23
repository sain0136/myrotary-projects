<script lang="ts">
export default {
  name: "LandingHome",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import Banners from "@/components/banners/Banners.vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import FilterTab from "@/modules/home/components/landinghome/FilterTab.vue";
import { ApiClient } from "@/api/ApiClient";
import { ProjectsApi } from "@/api/services/ProjectsApi";
import ProjectCard from "@/modules/home/components/landinghome/ProjectCard.vue";
import type { CustomError } from "@/utils/classes/CustomError";
import type {
  IClubProject,
  IDmProject,
  IDsgProject,
} from "@/utils/interfaces/IProjects";
import ResourceList from "@/utils/classes/ResourceList";

import type { ProjectFilters } from "@/utils/types/commonTypes";

/* Data */
const { handleError, handleSuccess } = errorHandler();
const { langTranslations } = useLanguage();
const projectsApi = new ProjectsApi(new ApiClient());
const pagination = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  limit: 6,
});
const projects: Array<IDsgProject | IDmProject | IClubProject> = reactive([]);
const filters: ProjectFilters = reactive({
  current_page: 1,
  limit: 6,
  club_id: 0,
  search_text: "",
  project_status: "",
  project_region: "",
  area_focus: "",
  rotary_year: "",
  district_id: 0,
  grant_type: "",
});
/* Hooks */
onMounted(async () => {
  try {
    const response = await projectsApi.getAllProjects(
      pagination.currentPage,
      pagination.limit
    );
    projects.push(
      ...(response.data as Array<IDsgProject | IDmProject | IClubProject>)
    );
  } catch (error) {
    handleError(error as CustomError);
  }
});

/* Methods */
const recieveFilters = (f: ProjectFilters) => {
  Object.assign(filters, f);
  filterProjects();
};

const filterProjects = async () => {
  try {
    const filterConverter = ResourceList.searchTermConversionMap();
    const aof = filterConverter.get(filters.area_focus)
      ? filterConverter.get(filters.area_focus)
      : "";
    const response = await projectsApi.filter({
      ...filters,
      area_focus: aof ? aof : "",
    });
    projects.splice(0, projects.length);
    projects.push(
      ...(response.data as Array<IDsgProject | IDmProject | IClubProject>)
    );
  } catch (error) {
    handleError(error as CustomError);
  }
};
</script>

<template>
  <Banners :banner-text="langTranslations.landingpageBannerText" />
  <div class="container">
    <div
      class="mt-8 md:pr-4 flex justify-center md:justify-end"
      id="viewButton"
    >
      <RotaryButton :label="'View'" :theme="'secondary'" />
    </div>
    <main class="landing-grid">
      <FilterTab @sendFilters="recieveFilters" />
      <div class="project-cards">
        <ProjectCard
          v-for="project in projects"
          :key="project.project_id"
          :project="project"
        />
      </div>
    </main>
    <section id="paginationrow" class="landing-grid">
      <div></div>
      <div class="flex justify-center items-center">
        <div class="flex justify-center">
          <!-- Previous Button -->
          <!-- @click="handlePageChange('previous')"
        v-if="currentPage > 1" -->
          <a
            href="#"
            class="flex items-center justify-center px-3 h-8 mr-3 text-sm font-medium text-nearWhite bg-nearBlack hover:bg-primaryHover focus:ring-primaryFocus rounded-lg"
          >
            <svg
              class="w-3.5 h-3.5 mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 5H1m0 0 4 4M1 5l4-4"
              />
            </svg>
            {{ langTranslations.prevButtonLabel }}
          </a>
          <!--         @click="handlePageChange('next')"
        v-if="currentPage !== lastPage" -->
          <a
            href="#"
            class="flex items-center justify-center px-3 h-8 text-sm font-medium text-nearWhite bg-nearBlack hover:bg-primaryHover focus:ring-primaryFocus rounded-lg"
          >
            {{ langTranslations.nextButtonLabel }}
            <svg
              class="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
#paginationrow {
  height: 5rem;
}
@import "@/assets/_variables.scss";
.container {
  width: 100%;
  max-width: $wideDesktop;
  margin: 0 auto;
}
.landing-grid {
  @media screen and (min-width: $smallMobile) {
    display: grid;
    grid-template-columns: [first] 30% [second] 70%;
    grid-template-rows: [row1-start] 100%;
  }
  @media screen and (max-width: $tablet) {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .project-cards {
    position: relative;
    padding: 0 1rem;
    div {
      height: 500px;
    }
    @media screen and (max-width: $tablet) {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      align-items: center;
    }
    @media screen and (min-width: $tablet) {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      row-gap: 1rem;
      column-gap: 1rem;
    }
    @media screen and (min-width: $wideDesktop) {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      row-gap: 4rem;
      column-gap: 1rem;
    }
  }
}
</style>
