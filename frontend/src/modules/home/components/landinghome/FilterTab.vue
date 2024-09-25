<script lang="ts">
export default {
  name: "FilterTab",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { computed, onMounted, reactive, ref, watch } from "vue";
import District from "@/utils/classes/District";
import { DistrictApi } from "@/api/services/DistrictsApi";
import { ApiClient } from "@/api/ApiClient";
import type { CustomError } from "@/utils/classes/CustomError";
import { ClubApi } from "@/api/services/ClubApi";
import BaseInput from "@/components/form/BaseInput.vue";
import BaseSelect from "@/components/form/BaseSelect.vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import type { IClub } from "@/utils/interfaces/IClub";
import type { ProjectFilters } from "@/utils/types/commonTypes";
import { ProjectsApi } from "@/api/services/ProjectsApi";
import { cloneDeep } from "lodash";

/* Data */
const {
  langTranslations,
  languagePref,
  translateProjectTypeList,
  convertProjectLang,
  translateProjectStatusList,
  translateRegionList,
  convertRegionLang,
  convertProjectStatusLang,
  translateAreaOfFocusList,
  convertAreaOfFocusLang,
} = useLanguage();
const districtMap = reactive<Map<string, number>>(new Map());
const clubMap = reactive<Map<string, number>>(new Map());
const { handleError } = errorHandler();
const clubApi = new ClubApi(new ApiClient());
const districtApi = new DistrictApi(new ApiClient());
const projectsApi = new ProjectsApi(new ApiClient());
const showFilter = ref(false);
const filterData: ProjectFilters = reactive({
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
  reset: false,
});
const rotary_year_long_format = ref("");
const emit = defineEmits(["sendFilters"]);
const chosenDistrict = ref("");
const chosenClub = ref("");
const rotaryYearsList = ref([langTranslations.value.allYearsLabel] as string[]);
const longYearToYear = reactive(new Map<string, string>());
const arrayLongYearToYear = computed(() => {
  return ["", ...longYearToYear.keys()];
});

/* Hooks */
onMounted(async () => {
  try {
    const response = (await districtApi.getAllDistricts(true)) as District[];
    response.forEach((district) => {
      districtMap.set(district.district_name, district.district_id);
    });
    await getRotaryYears();
  } catch (error) {
    handleError(error as CustomError);
  }
});

watch(chosenDistrict, () => {
  const id = districtMap.get(chosenDistrict.value);
  if (id) {
    filterData.district_id = id;
    filterData.club_id = 0;
  }
});

watch(chosenClub, () => {
  const id = clubMap.get(chosenClub.value);
  if (id) {
    filterData.club_id = id;
  }
});

watch(
  () => filterData.district_id,
  async () => {
    try {
      if (filterData.district_id > 0) {
        clubMap.clear();
        const response = await clubApi.clubsInDistrict(
          filterData.district_id,
          1,
          10000000
        );
        (response.data as IClub[]).forEach((club) => {
          clubMap.set(club.club_name, club.club_id as number);
        });
      }
    } catch (error) {
      handleError(error as CustomError);
    }
  }
);

/* Methods */
const getRotaryYears = async () => {
  const response = await projectsApi.getRotaryYears();
  response.allRotaryYears.forEach((rotaryYear, index) => {
    rotaryYearsList.value.push(rotaryYear);
    longYearToYear.set(rotaryYear, rotaryYear.replace(/-\d{4}$/, ""));
  });
};

const filterProjects = async () => {
  const copy = cloneDeep(filterData);
  copy.grant_type = convertProjectLang(filterData.grant_type);
  copy.project_region = convertRegionLang(filterData.project_region);
  copy.project_status = convertProjectStatusLang(copy.project_status);
  copy.area_focus = convertAreaOfFocusLang(filterData.area_focus);
  const year = longYearToYear.get(rotary_year_long_format.value) ?? "";
  copy.rotary_year = year;
  emit("sendFilters", copy);
  showFilter.value = false;
};

const resetSearch = () => {
  chosenClub.value = "";
  chosenDistrict.value = "";
  clubMap.clear();
  Object.assign(filterData, {
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
    reset: true,
  });
  rotary_year_long_format.value = "";
  emit("sendFilters", filterData);
  filterData.reset = false;
  showFilter.value = false;
};
</script>

<template>
  <div
    class="flex justify-center md:justify-start flex-col items-center relative"
  >
    <div class="md:hidden pb-4 w-8/12 flex justify-center">
      <button
        @click="showFilter = !showFilter"
        id="dropdownDefault"
        data-dropdown-toggle="dropdown"
        class="font-bold md:hidden inline-flex w-8/12 text-nearBlack bg-primary hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm px-4 py-2.5 text-center justify-center items-center"
        type="button"
      >
        {{ langTranslations.filterProjectsLabel }}
        <svg
          class="w-4 h-4 ml-2"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
    </div>
    <div
      :class="{ hidden: !showFilter }"
      class="z-10 md:z-0 flex items-center md:flex flex-col p-8 filter-tab rounded-lg absolute md:static top-12 md:top-0"
    >
      <span class="font-extrabold py-8 text-center" v-if="!showFilter">
        {{ langTranslations.filterProjectsLabel }}
      </span>
      <div class="filters flex flex-col gap-6">
        <BaseInput
          class="flex-1"
          :label="langTranslations.landingPage.searchTermsLabel"
          type="text"
          v-model="filterData.search_text"
           @keydown.enter="filterProjects"
        />
        <BaseSelect
          :label="langTranslations.districtLabel"
          :options="[...districtMap.keys()]"
          v-model="chosenDistrict"
        />
        <BaseSelect
          :label="langTranslations.clubLabel"
          :options="[...clubMap.keys()]"
          v-model="chosenClub"
        />
        <BaseSelect
          :label="langTranslations.landingPage.grantTypeLabel"
          :options="translateProjectTypeList(languagePref)"
          v-model="filterData.grant_type"
        />
        <BaseSelect
          :label="langTranslations.statusLabel"
          :options="translateProjectStatusList(languagePref)"
          v-model="filterData.project_status"
        />
        <BaseSelect
          :label="langTranslations.landingPage.yearLabel"
          :options="arrayLongYearToYear"
          v-model="rotary_year_long_format"
        />
        <BaseSelect
          :label="langTranslations.landingPage.areaOfFocusLabel"
          :options="translateAreaOfFocusList(languagePref)"
          v-model="filterData.area_focus"
        />
        <BaseSelect
          :label="langTranslations.landingPage.regionLabel"
          :options="translateRegionList(languagePref)"
          v-model="filterData.project_region"
        />
        <div
          class="button-row flex flex-col lg:flex-row gap-2 px-8 items-center"
        >
          <RotaryButton
            :label="langTranslations.landingPage.searchButtonLabel"
            :theme="'primary'"
            @click="filterProjects"
          />
          <RotaryButton
            :label="langTranslations.landingPage.resetLabel"
            :theme="'secondary'"
            @click="resetSearch"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.filter-tab {
  width: 90%;
  background-color: #dedede;
  gap: 1rem;
  // @media screen and (max-width: $smallMobile) {
  //   display: none;
  // }

  .filters {
    width: 100%;
  }
}
</style>
