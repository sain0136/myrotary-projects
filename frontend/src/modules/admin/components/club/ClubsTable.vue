<script lang="ts">
export default {
  name: "ClubsTable",
};
</script>

<script setup lang="ts">
import { ApiClient } from "@/api/ApiClient";
import { DistrictApi } from "@/api/services/DistrictsApi";
import BaseDisplayTable from "@/components/tables/BaseDisplayTable.vue";
import type { CustomError } from "@/utils/classes/CustomError";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { onMounted, reactive, ref, watch } from "vue";
import { useLanguage } from "@/utils/languages/UseLanguage";
import router from "@/router";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { modalHandler } from "@/utils/composables/ModalHandler";
import type { PaginationResult } from "@/utils/types/commonTypes";
import BaseSelect from "@/components/form/BaseSelect.vue";
import { ClubApi } from "@/api/services/ClubApi";
import H3 from "@/components/headings/H3.vue";
import type { IClub } from "@/utils/interfaces/IClub";

/* Data */
const { langTranslations } = useLanguage();
const { handleError, handleSuccess } = errorHandler();
const { changeShowModal, setModal } = modalHandler();
const districtApi = new DistrictApi(new ApiClient());
const clubApi = new ClubApi(new ApiClient());
const chosenDistrict = ref("");
const chosenDistrictId = ref(0);
const allClubsInDistrict = reactive<IClub[]>([]);
const allDistricts = reactive<Map<string, number>>(new Map());
const pagination = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  limit: 5,
});

/* Hooks */
watch(chosenDistrict, () => {
  if (chosenDistrict.value !== undefined) {
    chosenDistrictId.value = allDistricts.get(chosenDistrict.value) as number;
    Object.assign(pagination, {
      currentPage: 1,
      lastPage: 1,
      total: 0,
      limit: 5,
    });
    getClubsByDistrict();
  }
});

onMounted(async () => {
  try {
    const response = (await districtApi.getAllDistricts(
      false,
      1,
      10
    )) as PaginationResult;
    response.data.map((district) => {
      allDistricts.set(district.district_name, district.district_id as number);
    });
  } catch (error) {
    handleError(error as CustomError);
  }
});
watch(
  () => pagination.limit,
  async () => {
    await getClubsByDistrict();
  }
);

/* Methods */
const getClubsByDistrict = async () => {
  try {
    const response = (await clubApi.clubsInDistrict(
      chosenDistrictId.value,
      pagination.currentPage,
      pagination.limit
    )) as PaginationResult;
    allClubsInDistrict.splice(0, allClubsInDistrict.length);
    Object.assign(allClubsInDistrict, response.data);
    pagination.currentPage = response.meta.current_page;
    pagination.lastPage = response.meta.last_page;
    pagination.total = response.meta.total;
  } catch (error) {
    handleError(error as CustomError);
  }
};

const handlePageChange = (nextOrPrevious: "next" | "previous") => {
  pagination.currentPage =
    nextOrPrevious === "next"
      ? pagination.currentPage + 1
      : pagination.currentPage - 1;
  getClubsByDistrict();
};
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex mt-8 justify-center flex-col gap-4 items-center">
      <H3 :content="langTranslations.clubsView.choseDistrictForClubs" />
      <BaseSelect
        class="w-1/2"
        :options="[...allDistricts.keys()]"
        v-model="chosenDistrict"
        :label="''"
      />
    </div>
    <BaseDisplayTable
      v-if="allClubsInDistrict.length > 0"
      :handle-page-change="handlePageChange"
      :current-page="pagination.currentPage"
      :last-page="pagination.lastPage"
      :total-results="pagination.total"
      :limit="pagination.limit"
      @update:limit="pagination.limit = $event"
      :delete-button="{
        show: true,
        callBack: async (club ) => {
          const toDelete =(club as IClub)
          const id = toDelete.club_id
          try {
            setModal(langTranslations.deleteLabel, langTranslations.confirmationDelete + ' ' + toDelete.club_name )
           const confirmed = await changeShowModal(true)
            if (id && confirmed) {
              // await districtApi.deleteDistrict([id])  
              handleSuccess(langTranslations.succssDeleteToast)
          }
          } catch (error) {
            handleError(error as CustomError);

          }
          router.go(0)
        },
      }"
      :edit-button="{
        show: true,
        callBack: (club) => {
          const id = (club as IClub).club_id
          if (id) {
            router.push({
              path: `club-form/${id}`,
            });
          }
        },
      }"
      :table-data="allClubsInDistrict"
      :columns="[
        {
          name: langTranslations.clubLabel,
          colName: 'club_name',
          columnWidth: 'w-1/6',
        },
      ]"
    />
    <div class="flex justify-center" v-else>
      <H3 :content="langTranslations.clubsView.noClubsInDistrict" />
    </div>
    <div class="flex justify-center">
      <RotaryButton
        @click="router.push({ name: 'DistrictAddEdit' })"
        :label="langTranslations.createLabel + ' ' + langTranslations.clubLabel"
        :theme="'primary'"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>