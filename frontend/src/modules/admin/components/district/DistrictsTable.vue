<script lang="ts">
export default {
  name: "DistrictsTable",
};
</script>

<script setup lang="ts">
import { ApiClient } from "@/api/ApiClient";
import { DistrictApi } from "@/api/services/DistrictsApi";
import BaseDisplayTable from "@/components/tables/BaseDisplayTable.vue";
import { CustomErrors } from "@/utils/classes/CustomErrors";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import type { IDistrict } from "@/utils/interfaces/IDistrict";
import { onMounted, reactive, ref, watch } from "vue";
import { useLanguage } from "@/utils/languages/UseLanguage";
import router from "@/router";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { modalHandler } from "@/utils/composables/ModalHandler";
import type { PaginationResult } from "@/utils/types/commonTypes";
import type { ICustomError } from "@/utils/interfaces/ICustomError";

/* Data */
const { langTranslations } = useLanguage();
const { handleError, handleSuccess } = errorHandler();
const districtApi = new DistrictApi(new ApiClient());
const allDistricts = reactive<IDistrict[]>([]);
const { changeShowModal, setModal } = modalHandler();
const pagination = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  limit: 5,
});
/* Hooks */
onMounted(async () => {
  await getAllDistricts();
});

watch(
  () => pagination.limit,
  async () => {
    await getAllDistricts();
  }
);

/* Methods */
const getAllDistricts = async () => {
  try {
    allDistricts.splice(0, allDistricts.length);
    const response = (await districtApi.getAllDistricts(
      false,
      1,
      10
    )) as PaginationResult;
    Object.assign(allDistricts, response.data);
    pagination.currentPage = response.meta.current_page;
    pagination.lastPage = response.meta.last_page;
    pagination.total = response.meta.total;
  } catch (error) {
    handleError(error as CustomErrors);
  }
};

const handlePageChange = (nextOrPrevious: "next" | "previous") => {
  pagination.currentPage =
    nextOrPrevious === "next"
      ? pagination.currentPage + 1
      : pagination.currentPage - 1;
  getAllDistricts();
};

const confirmMultiDelete = async (selectedItems: unknown[]) => {
  try {
    if (selectedItems) {
      let toDeleteNames = "";
      const ids = (selectedItems as IDistrict[]).map((d) => {
        toDeleteNames += d.district_name + ", ";
        return d.district_id;
      });
      setModal(
        langTranslations.value.deleteLabel,
        langTranslations.value.confirmationDelete +
          " " +
          toDeleteNames.replace(/,\s*$/, "")
      );
      const confirmed = await changeShowModal(true);
      if (confirmed && ids) {
        await districtApi.deleteDistrict(ids);
        handleSuccess(langTranslations.value.succssDeleteToast);
      }
      await getAllDistricts();
    }
    throw new Error();
  } catch (error) {
    handleError(error as CustomErrors);
  }
};

const deleteDistrict = async (district: unknown) => {
  const toDelete = { ...(district as IDistrict) };
  const id = toDelete.district_id;
  try {
    setModal(
      langTranslations.value.deleteLabel,
      langTranslations.value.confirmationDelete + " " + toDelete.district_name
    );
    const confirmed = await changeShowModal(true);
    if (id && confirmed) {
      await districtApi.deleteDistrict([id]);
      handleSuccess(langTranslations.value.succssDeleteToast);
    }
    await getAllDistricts();
  } catch (error) {
    handleError(error as CustomErrors);
  }
};
</script>

<template>
  <div class="flex flex-col gap-8">
    <BaseDisplayTable
      :multi-select-delete="confirmMultiDelete"
      :show-checkboxes="true"
      :handle-page-change="handlePageChange"
      :current-page="pagination.currentPage"
      :last-page="pagination.lastPage"
      :total-results="pagination.total"
      :limit="pagination.limit"
      @update:limit="pagination.limit = $event"
      :delete-button="{
        show: true,
        callBack: deleteDistrict,
      }"
      :edit-button="{
        show: true,
        callBack: (district) => {
          const id = (district as IDistrict).district_id
          if (id) {
            router.push({
              path: `district-form/${id}`,
            });
          }
        },
      }"
      :table-data="allDistricts"
      :columns="[
        { name: langTranslations.districtLabel, colName: 'district_name' },
        {
          name: langTranslations.districtLabel + ' #',
          collapsable: true,
          colName: 'district_number',
        },
      ]"
    />
    <div class="flex justify-center">
      <RotaryButton
        @click="router.push({ name: 'DistrictAddEdit' })"
        :label="
          langTranslations.createLabel + ' ' + langTranslations.districtLabel
        "
        :theme="'primary'"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
