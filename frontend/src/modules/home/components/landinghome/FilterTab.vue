<script lang="ts">
export default {
  name: "",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref, watch } from "vue";
import District from "@/utils/classes/District";
import { DistrictApi } from "@/api/services/DistrictsApi";
import { ApiClient } from "@/api/ApiClient";
import type { CustomError } from "@/utils/classes/CustomError";
import Club from "@/utils/classes/Club";
import { ClubApi } from "@/api/services/ClubApi";
import BaseInput from "@/components/form/BaseInput.vue";
import BaseSelect from "@/components/form/BaseSelect.vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import type { IClub } from "@/utils/interfaces/IClub";
import ResourceList from "@/utils/classes/ResourceList";

/* Data */
const { langTranslations } = useLanguage();
const districtMap = reactive<Map<string, number>>(new Map());
const clubMap = reactive<Map<string, number>>(new Map());
const { handleError, handleSuccess, handleValidationForm } = errorHandler();
const clubApi = new ClubApi(new ApiClient());
const districtApi = new DistrictApi(new ApiClient());
const showFilter = ref(false);
const filterData = reactive({
  filterText: "",
  filterStatus: "",
  filterRegion: "",
  filterAreaFocus: "",
  filterYear: 0,
  filterGrantType: "",
  filterDistrict: 0,
  fliterClub: 0,
});
const chosenDistrict = ref("");
const chosenClub = ref("");
const pagination = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  limit: 5,
});

/* Hooks */
onMounted(async () => {
  try {
    const response = (await districtApi.getAllDistricts(true)) as District[];
    response.forEach((district) => {
      districtMap.set(district.district_name, district.district_id);
    });
  } catch (error) {
    handleError(error as CustomError);
  }
});

watch(chosenDistrict, () => {
  const id = districtMap.get(chosenDistrict.value);
  if (id) {
    filterData.filterDistrict = id;
    filterData.fliterClub = 0;
  }
});
watch(chosenClub, () => {
  const id = clubMap.get(chosenClub.value);
  if (id) {
    filterData.fliterClub = id;
  }
});

watch(
  () => filterData.filterDistrict,
  async () => {
    try {
      if (filterData.filterDistrict > 0) {
        clubMap.clear();
        const response = await clubApi.clubsInDistrict(
          filterData.filterDistrict,
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
const resetSearch = () => {
  chosenClub.value = "";
  chosenDistrict.value = "";
  Object.assign(filterData, {
    filterText: "",
    filterStatus: "",
    filterRegion: "",
    filterAreaFocus: "",
    filterYear: 0,
    filterGrantType: "",
    filterDistrict: 0,
    fliterClub: 0,
  });
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
      <div class="filter flex flex-col gap-6">
        <BaseInput
          :label="langTranslations.landingPage.searchTermsLabel"
          type="text"
          v-model="filterData.filterText"
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
          :options="ResourceList.grantTypeList"
          v-model="filterData.filterGrantType"
        />
        <BaseSelect
          :label="langTranslations.statusLabel"
          :options="ResourceList.statusList"
          v-model="filterData.filterStatus"
        />
        <BaseSelect
          :label="langTranslations.landingPage.yearLabel"
          :options="[]"
          v-model="filterData.filterYear"
        />
        <BaseSelect
          :label="langTranslations.landingPage.areaOfFocusLabel"
          :options="ResourceList.areaOfFocusList"
          v-model="filterData.filterAreaFocus"
        />
        <BaseSelect
          :label="langTranslations.landingPage.regionLabel"
          :options="ResourceList.regionList"
          v-model="filterData.filterRegion"
        />
        <div class="button_row flex gap-2 px-8">
          <RotaryButton
            :label="langTranslations.landingPage.searchButtonLabel"
            :theme="'primary'"
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
}
</style>
