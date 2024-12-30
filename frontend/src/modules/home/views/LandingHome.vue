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
import { updateLandingCurrentPage } from "@/utils/utils";

/* Data */
const landingCurrentPage = sessionStorage.getItem("landingCurrentPage")
  ? Number(sessionStorage.getItem("landingCurrentPage"))
  : 1;
const { handleError } = errorHandler();
const { langTranslations, customPrintf } = useLanguage();
const filterSearchMode = ref(false);
const projectsApi = new ProjectsApi(new ApiClient());
type viewmodes = "list" | "grid";
const viewmode = ref<viewmodes>("grid");
const loaded = ref(false);
const savedview = sessionStorage.getItem("landingViewMode");
if (savedview) {
  viewmode.value = savedview === "list" ? "list" : "grid";
}
const pagination = reactive({
  current_page: landingCurrentPage,
  last_page: 1,
  total: 0,
  limit: viewmode.value === "list" ? 15 : 6,
  per_page: 6,
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
    updateLandingCurrentPage("reset");
  }
  if (viewmode.value === "grid") {
    pagination.current_page = 1;
    pagination.limit = 6;
    filters.limit = 6;
    sessionStorage.setItem("landingViewMode", "grid");
    updateLandingCurrentPage("reset");
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
  pagination.per_page = response.meta.per_page;
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
  try {
    switch (direction) {
      case "next":
        if (filterSearchMode.value) {
          filters.current_page = filters.current_page + 1;
          filterProjects();
        } else {
          pagination.current_page = pagination.current_page + 1;
          getAllProjects();
        }
        updateLandingCurrentPage("increment");
        break;
      case "previous":
        if (filterSearchMode.value) {
          filters.current_page = filters.current_page - 1;
          filterProjects();
        } else {
          pagination.current_page = pagination.current_page - 1;
          getAllProjects();
        }
        updateLandingCurrentPage("decrement");
        break;
      case "first":
        if (filterSearchMode.value) {
          filters.current_page = 1;
          filterProjects();
        } else {
          pagination.current_page = 1;
          getAllProjects();
        }
        updateLandingCurrentPage("first");
        break;
      case "last":
        if (filterSearchMode.value) {
          filters.current_page = pagination.last_page;
          filterProjects();
        } else {
          pagination.current_page = pagination.last_page;
          getAllProjects();
        }
        updateLandingCurrentPage("last", pagination.last_page);
        break;
      default:
        break;
    }
  } catch (error) {
    handleError(error as CustomError);
  }
};

const chooseViewMode = () => {
  viewmode.value = viewmode.value === "list" ? "grid" : "list";
};

const page = () => {
  let p = pagination.current_page * pagination.per_page;
  let pp = p - (pagination.per_page - 1);
  if (pagination.current_page === pagination.last_page) {
    p = pagination.total;
    pp = pagination.total - projects.length + 1;
  }
  return customPrintf(
    langTranslations.value.landingPagePagination,
    `<strong>${pp}</strong>`,
    `<strong>${p}</strong>`,
    `<strong>${pagination.total}</strong>`
  );
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
      <!-- empty div for alignment -->
      <div></div>
      <div class="flex flex-col gap-2 justify-center items-center">
        <span v-html="page()" class="text-sm text-gray-700 dark:text-gray-400">
        </span>
        <div class="pagination-bttn flex justify-center gap-4 flex-wrap">
          <!-- First Button -->
          <a
            @click="handlePageChange('first')"
            v-if="pagination.current_page !== 1"
            href="#"
            class="flex items-center justify-center px-3 h-8 text-sm font-medium text-nearWhite bg-nearBlack hover:bg-primaryHover focus:ring-primaryFocus rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="mr-1"
            >
              <g fill="none">
                <path
                  d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"
                />
                <path
                  fill="currentColor"
                  d="M5 6a1 1 0 0 0-2 0v12a1 1 0 1 0 2 0zm7.703 10.95a1 1 0 0 0 0-1.415L10.167 13H20a1 1 0 1 0 0-2h-9.833l2.536-2.536a1 1 0 0 0-1.415-1.414l-4.242 4.243a1 1 0 0 0 0 1.414l4.242 4.243a1 1 0 0 0 1.415 0"
                />
              </g>
            </svg>
            {{ langTranslations.firstButtonLabel }}
          </a>
          <!-- Previous Button -->
          <a
            @click="handlePageChange('previous')"
            v-if="pagination.current_page !== 1"
            href="#"
            class="flex items-center justify-center px-3 h-8 text-sm font-medium text-nearWhite bg-nearBlack hover:bg-primaryHover focus:ring-primaryFocus rounded-lg"
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
          <!-- Next Button -->
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
          <!-- Last Button -->
          <a
            @click="handlePageChange('last')"
            v-if="pagination.current_page !== pagination.last_page"
            href="#"
            class="flex items-center justify-center px-3 h-8 text-sm font-medium text-nearWhite bg-nearBlack hover:bg-primaryHover focus:ring-primaryFocus rounded-lg"
          >
            {{ langTranslations.lastButtonLabel }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              class="ml-1"
            >
              <g fill="none">
                <path
                  d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"
                />
                <path
                  fill="currentColor"
                  d="M19 19a1 1 0 1 0 2 0V5a1 1 0 1 0-2 0zM11.297 7.05a1 1 0 0 0 0 1.415L13.833 11H4a1 1 0 0 0 0 2h9.833l-2.536 2.536a1 1 0 0 0 1.415 1.414l4.242-4.243a1 1 0 0 0 0-1.414L12.712 7.05a1 1 0 0 0-1.415 0"
                />
              </g>
            </svg>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

#paginationrow {
  height: 10rem;
  @media screen and (min-width: $tablet) {
    height: 8rem;
  }
}

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
