<script lang="ts">
export default {
  name: "ProjectsTable",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import BaseDisplayTable from "@/components/tables/BaseDisplayTable.vue";
import type {
  IDsgProject,
  IDmProject,
  IClubProject,
} from "@/utils/interfaces/IProjects";

/* Data */
const { langTranslations } = useLanguage();

/* Hooks */
onMounted(async () => {});
const { projects } = defineProps<{
  projects: Array<IDsgProject | IDmProject | IClubProject>;
}>();

/* Methods */
</script>

<template>
  <div class="p-4">
    <BaseDisplayTable
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
