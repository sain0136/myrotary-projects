<script lang="ts">
export default {
  name: "ProjectsTable",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import BaseDisplayTable from "@/components/tables/BaseDisplayTable.vue";
import type {
  IDsgProject,
  IDmProject,
  IClubProject,
  IGenericProject,
} from "@/utils/interfaces/IProjects";
import router from "@/router";

/* Data */
const { langTranslations } = useLanguage();

/* Hooks */
onMounted(async () => {});
const { projects } = defineProps<{
  projects: Array<IDsgProject | IDmProject | IClubProject>;
}>();

/* Methods */
const handleRowEvent = (row: IGenericProject) => {
  const project = row;
  router.push({
    name: "ProjectDetails",
    params: {
      name: project.project_name.replace(/\s/g, "-"),
    },
    query: {
      id: project.project_id,
    },
  });
};
</script>

<template>
  <div class="p-4">
    <BaseDisplayTable
      :row-events="(row) => handleRowEvent(row as IGenericProject)"
      :hide-actions-column="true"
      :disable-pagination="true"
      :show-checkboxes="false"
      :current-page="1"
      :last-page="1"
      :total-results="1"
      :handle-page-change="() => {}"
      :limit="1"
      :table-data="projects"
      :columns="[
        {
          name: langTranslations.nameLabel,
          colName: 'project_name',
          columnWidth: 'w-2/12',
          elipsis: {
            show: true,
            length: 20,
          },
          title: true,
        },
        {
          name: langTranslations.landingPage.grantTypeLabel,
          colName: 'grant_type',
        },
        {
          name: langTranslations.countryLabel,
          lgScreenCollapsable: true,
          colName: 'country',
        },
        {
          name: langTranslations.statusLabel,
          collapsable: true,
          colName: 'project_status',
        },
      ]"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
