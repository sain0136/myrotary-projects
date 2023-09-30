<script lang="ts">
export default {
  name: "District",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { ref, watch } from "vue";
import DistrictsTable from "@/modules/admin/components/district/DistrictsTable.vue";

/* Data */
const showDistrictForm = ref(false);
const { langTranslations } = useLanguage();
const activeTab = ref("district");
const tabs = ref([
  {
    name: "district",
    label: langTranslations.value.districtView.distictTabLabel,
  },
  {
    name: "disrictForm",
    label: "bacon",
    hidden: true,
  },
  { name: "admins", label: langTranslations.value.districtView.adminsTabLabel },
]);

/* Hooks */
watch(showDistrictForm, () => {
  if (showDistrictForm.value) {
    activeTab.value = "disrictForm";
  }
});

/* Methods */
const setActiveTab = (tabName: string) => {
  activeTab.value = tabName;
};
</script>

<template>
  <ul
    class="tabs flex flex-wrap text-sm font-medium text-center justify-center text-gray-500 border-b border-gray-200"
  >
    <li class="mr-2" v-for="tab in tabs" :key="tab.name">
      <a
        v-if="!tab.hidden"
        @click="setActiveTab(tab.name)"
        class="inline-block cursor-pointer rounded-t-lg p-4 text-2xl hover:bg-gray-300 hover:text-gray-600"
        :class="{
          ' active  bg-gray-100 text-nearBlack': tab.name === activeTab,
        }"
      >
        {{ tab.label }}
      </a>
    </li>
  </ul>
  <div v-if="activeTab === 'district'">
    <DistrictsTable v-model:model-value="showDistrictForm" class="mt-8" />
  </div>
  <div v-if="activeTab === 'disrictForm'">
    <h1>disrictForm</h1>
  </div>
</template>

<style lang="scss" scoped></style>
