<script lang="ts">
export default {
  name: "MyProjects",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import CreatedProjectsTable from "@/modules/admin/components/myprojects/CreatedProjectsTable.vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import H3 from "@/components/headings/H3.vue";
/* Data */
const { langTranslations } = useLanguage();
const { handleError } = errorHandler();
const activeTab = ref(
  sessionStorage.getItem("myprojectsViewLastTab") || "created"
);
const tabs = ref([
  {
    name: "created",
    label: langTranslations.value.myprojectsView.createdProjectsLabel,
  },
  {
    name: "administrating",
    label: langTranslations.value.myprojectsView.administratingProjectsLabel,
  },
  {
    name: "newProject",
    label: langTranslations.value.myprojectsView.newProjectsLabel,
  },
]);

/* Hooks */
onMounted(async () => {});

/* Methods */
const setActiveTab = (tabName: string) => {
  activeTab.value = tabName;
  sessionStorage.setItem("myprojectsViewLastTab", tabName);
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
  <div v-if="activeTab === 'created'">
    <CreatedProjectsTable :adminstrating-view="false" />
  </div>
  <div v-if="activeTab === 'administrating'">
    <CreatedProjectsTable :adminstrating-view="true" />
  </div>
  <div
    class="py-8 flex flex-col items-center gap-4"
    v-if="activeTab === 'newProject'"
  >
    <H3 :content="langTranslations.projectTypeLabel + ':'" />
    <div class="buttons-container flex justify-center">
      <RotaryButton
        :label="langTranslations.myprojectsView.dsgProjectsLabel"
        :theme="'primary'"
        class="w-48"
      />
      <RotaryButton
        :label="langTranslations.myprojectsView.dmProjectsLabel"
        :theme="'primary'"
        class="w-48"
      />
      <RotaryButton
        :label="langTranslations.clubLabel"
        :theme="'primary'"
        class="w-48"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
