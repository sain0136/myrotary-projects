<script lang="ts">
export default {
  name: "DistrictsTable",
};
</script>

<script setup lang="ts">
import { ApiClient } from "@/api/ApiClient";
import { DistrictApi } from "@/api/services/DistrictsApi";
import BaseDisplayTable from "@/components/tables/BaseDisplayTable.vue";
import type { CustomError } from "@/utils/classes/CustomError";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import type { IDistrict } from "@/utils/interfaces/IDistrict";
import { onMounted, reactive } from "vue";
import { useLanguage } from "@/utils/languages/UseLanguage";
import router from "@/router";
import RotaryButton from "@/components/buttons/RotaryButton.vue";

/* Data */
const { langTranslations } = useLanguage();
const { handleError, handleSuccess } = errorHandler();
const districtApi = new DistrictApi(new ApiClient());
const allDistricts = reactive<IDistrict[]>([]);
defineProps({
  modelValue: Boolean,
});
defineEmits(["update:modelValue"]);
/* Hooks */
onMounted(async () => {
  try {
    const response = await districtApi.getAllDistricts(true);
    Object.assign(allDistricts, response);
    console.log(response);
  } catch (error) {
    handleError(error as CustomError);
  }
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <BaseDisplayTable
      :delete-button="{
        show: true,
        callBack: () => {
          router.push({
            name: 'AdminWelcome',
          });
        },
      }"
      :edit-button="{
        show: true,
        callBack: () => {
          $emit('update:modelValue', true);
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
        @click="$emit('update:modelValue', true)"
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
