<script lang="ts">
export default {
  name: "LandingHome",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref, watch } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import Banners from "@/components/banners/Banners.vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import FilterTab from "@/modules/home/components/landinghome/FilterTab.vue";
import { ApiClient } from "@/api/ApiClient";
import { ProjectsApi } from "@/api/services/ProjectsApi";
import ProjectCard from "@/modules/home/components/landinghome/ProjectCard.vue";
import type { CustomError } from "@/utils/classes/CustomError";
import ProjectsTable from "@/modules/home/components/landinghome/ProjectsTable.vue";
import type {
  IClubProject,
  IDmProject,
  IDsgProject,
} from "@/utils/interfaces/IProjects";
import ResourceList from "@/utils/classes/ResourceList";

import type { ProjectFilters } from "@/utils/types/commonTypes";

/* Data */
const { handleError } = errorHandler();
const { langTranslations } = useLanguage();
const filterSearchMode = ref(false);
const projectsApi = new ProjectsApi(new ApiClient());
const pagination = reactive({
  current_page: 1,
  last_page: 1,
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
type viewmodes = "list" | "grid";
const viewmode = ref<viewmodes>("grid");
const loaded = ref(false);

/* Hooks */
onMounted(async () => {
  const savedview = sessionStorage.getItem("landingViewMode");
  if (savedview) {
    viewmode.value = savedview === "list" ? "list" : "grid";
  }
  try {
    await getAllProjects();
    loaded.value = true;
  } catch (error) {
    handleError(error as CustomError);
  }
});

watch(viewmode, () => {
  if (viewmode.value === "list") {
    pagination.current_page = 1;
    pagination.limit = 15;
    filters.limit = 15;
    sessionStorage.setItem("landingViewMode", "list");
  }
  if (viewmode.value === "grid") {
    pagination.current_page = 1;
    pagination.limit = 6;
    filters.limit = 6;
    sessionStorage.setItem("landingViewMode", "grid");
  }
  if (filterSearchMode.value) {
    filterProjects();
  } else {
    getAllProjects();
  }
});
/* Methods */
const recieveFilters = (f: ProjectFilters) => {
  filterSearchMode.value = f.reset ? false : true; // if reset is true, the filterSearchMode is set to false
  Object.assign(filters, f);
  filterProjects();
};

const getAllProjects = async () => {
  const response = await projectsApi.getAllProjects(
    pagination.current_page,
    pagination.limit
  );
  projects.splice(0, projects.length);
  projects.push(
    ...(response.data as Array<IDsgProject | IDmProject | IClubProject>)
  );
  pagination.current_page = response.meta.current_page;
  pagination.last_page = response.meta.last_page;
  pagination.total = response.meta.total;
};

const filterProjects = async () => {
  if (viewmode.value === "list") {
    filters.limit = 15;
  }
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
    pagination.current_page = response.meta.current_page;
    pagination.last_page = response.meta.last_page;
    pagination.total = response.meta.total;
    window.scrollTo(0, 0);
  } catch (error) {
    handleError(error as CustomError);
  }
};

const handlePageChange = (direction: string) => {
  if (direction === "next") {
    if (pagination.current_page < pagination.last_page) {
      try {
        if (filterSearchMode.value) {
          filters.current_page = filters.current_page + 1;
          filterProjects();
        } else {
          pagination.current_page = pagination.current_page + 1;
          getAllProjects();
        }
      } catch (error) {
        handleError(error as CustomError);
      }
    }
  } else if (direction === "previous") {
    if (pagination.current_page > 1) {
      try {
        if (filterSearchMode.value) {
          filters.current_page = filters.current_page - 1;
          filterProjects();
        } else {
          pagination.current_page = pagination.current_page - 1;
          getAllProjects();
        }
      } catch (error) {
        handleError(error as CustomError);
      }
    }
  }
};

const chooseViewMode = () => {
  viewmode.value = viewmode.value === "list" ? "grid" : "list";
};
</script>

<template>
  <Banners :banner-text="langTranslations.landingpageBannerText" />
  <div class="container">
    <div
      class="mt-8 md:pr-4 flex justify-center md:justify-end"
      id="viewButton"
    >
      <RotaryButton
        :label="
          viewmode === 'list'
            ? langTranslations.gridviewlabel
            : langTranslations.listviewlabel
        "
        :theme="'secondary'"
        @click="chooseViewMode"
      />
    </div>
    <main class="landing-grid">
      <FilterTab @sendFilters="recieveFilters" />
      <div
        class="project-cards"
        v-if="projects.length > 0 && viewmode === 'grid'"
      >
        <ProjectCard
          v-for="project in projects"
          :key="project.project_id"
          :project="project"
        />
      </div>
      <ProjectsTable
        :projects="projects"
        v-else-if="viewmode === 'list' && projects.length > 0"
      />
      <div
        class="no-results-container"
        v-else-if="projects.length === 0 && loaded"
      >
        <div
          class="no-results-box m-auto flex flex-col items-center gap-4 pt-20"
        >
          <img src="/cube.svg" alt="Cube Icon" class="cube-icon w-1/4" />
          <h2 class="font-bold text-xl">
            {{ langTranslations.noResultsLabel }}
          </h2>
        </div>
      </div>
    </main>
    <section id="paginationrow" class="landing-grid">
      <div></div>
      <div class="flex justify-center items-center">
        <div class="flex justify-center">
          <!-- Previous Button -->
          <a
            @click="handlePageChange('previous')"
            v-if="pagination.current_page !== 1"
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
          <a
            @click="handlePageChange('next')"
            v-if="pagination.current_page !== pagination.last_page"
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
