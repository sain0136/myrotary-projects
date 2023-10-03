<script lang="ts">
export default {
  name: "District",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref, watch } from "vue";
import DistrictsTable from "@/modules/admin/components/district/DistrictsTable.vue";
import { useRoute } from "vue-router";
import DistrictAdminsTable from "@/modules/admin/components/district/DistrictAdminsTable.vue";
/* Data */
const { langTranslations } = useLanguage();
const route = useRoute();
const activeTab = ref(sessionStorage.getItem("settingsLastTab") || "District");
const tabs = ref([
  {
    name: "district",
    label: langTranslations.value.districtView.distictTabLabel,
  },
  { name: "admins", label: langTranslations.value.districtView.adminsTabLabel },
]);

/* Hooks */
onMounted(async () => {
  if (route.query.tabNameProp) {
    activeTab.value = "district";
  }
});
/* Methods */
const setActiveTab = (tabName: string) => {
  activeTab.value = tabName;
  sessionStorage.setItem("settingsLastTab", tabName);
};
</script>

<template>
  <ul
    class="tabs flex flex-wrap text-sm font-medium text-center justify-center text-gray-500 border-b border-gray-200"
  >
    <li class="mr-2" v-for="tab in tabs" :key="tab.name">
      <a
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
    <DistrictsTable :callBack="setActiveTab" class="mt-8" />
  </div>
  <div v-if="activeTab === 'admins'" class="mt-8">
    <DistrictAdminsTable />
  </div>
</template>

<style lang="scss" scoped></style>
