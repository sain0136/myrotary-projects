<script lang="ts">
export default {
  name: "AprrovalTable",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref, watch } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import H4 from "@/components/headings/H3.vue";
import BaseDisplayTable from "@/components/tables/BaseDisplayTable.vue";
import { ApiClient } from "@/api/ApiClient";
import { ProjectsApi } from "@/api/services/ProjectsApi";
import { CustomErrors } from "@/utils/classes/CustomErrors";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import LoadingSpinner from "@/components/loading/LoadingSpinner.vue";
import type {
  IClubProject,
  IDmProject,
  IDsgProject,
} from "@/utils/interfaces/IProjects";
import { projectStatus } from "@/utils/types/commonTypes";
import router from "@/router";

/* Data */
const { langTranslations } = useLanguage();
const { handleError } = errorHandler();
const { tableType } = defineProps<{
  tableType: "projectApproval" | "reportApproval";
}>();
const loaded = ref(false);

const projectsApi = new ProjectsApi(new ApiClient());
const projects: Array<IDsgProject | IDmProject | IClubProject> = reactive([]);
const pagination = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  limit: 10,
});
/* Hooks */
watch(
  () => pagination.limit,
  () => {
    getProjects();
  }
);
onMounted(async () => {
  try {
    await getProjects();
  } catch (error) {
    handleError(error as CustomErrors);
  }
});

/* Methods */
const getProjects = async () => {
  loaded.value = false;
  projects.splice(0, projects.length);
  const value =
    tableType === "projectApproval"
      ? projectStatus.PENDINGAPPROVAL
      : projectStatus.REPORTSDUE;
  const response = await projectsApi.fetchConditionalProjects(
    value,
    pagination.currentPage,
    pagination.limit,
    "project_status",
    false,
    useLoggedInUserStore().loggedInUser.district_id ?? 0,
    "district_id"
  );
  Object.assign(projects, response.data);
  pagination.currentPage = response.meta.current_page;
  pagination.lastPage = response.meta.last_page;
  pagination.total = response.meta.total;
  loaded.value = true;
};

const handlePageChange = (nextOrPrevious: "next" | "previous") => {
  pagination.currentPage =
    nextOrPrevious === "next"
      ? pagination.currentPage + 1
      : pagination.currentPage - 1;
  getProjects();
};

const editProject = (project: IDsgProject | IDmProject | IClubProject) => {
  try {
    const id = project.project_id ?? null;
    if (id) {
      switch (project.grant_type) {
        case "Club Project":
          router.push({
            path: `club-project-form/${id}`,
            query: {
              formType: "normalView",
            },
          });
          return;
        case "District Simplified Project":
          router.push({
            path: `simplified-project-form/${id}`,
            query: {
              formType: "normalView",
            },
          });
          return;
        case "District Matching Project":
          router.push({
            path: `matching-project-form/${id}`,
            query: {
              formType: "normalView",
            },
          });
          return;
        default:
          throw new CustomErrors(900, "Project not found", {
            en: "Project not found",
            fr: "Projet introuvable",
          });
      }
    } else {
      throw new CustomErrors(900, "Project not found", {
        en: "Project not found",
        fr: "Projet introuvable",
      });
    }
  } catch (error) {
    handleError(error as CustomErrors);
  }
};
</script>

<template>
  <H3
    class="text-center py-8"
    :content="
      langTranslations.projectsLabel +
      ' ' +
      (tableType === 'projectApproval'
        ? langTranslations.approvalsLabel
        : langTranslations.reportsLabel)
    "
  />
  <div class="my-8">
    <div v-if="projects.length > 0 && loaded" class="flex flex-col gap-8">
      <BaseDisplayTable
        :show-checkboxes="false"
        :handle-page-change="handlePageChange"
        :current-page="pagination.currentPage"
        :last-page="pagination.lastPage"
        :total-results="pagination.total"
        :limit="pagination.limit"
        @update:limit="pagination.limit = $event"
        :edit-button="{
          show: true,
          callBack: (project) => {
              editProject(project as IDsgProject | IDmProject | IClubProject);
          },
        }"
        :table-data="projects"
        :columns="[
          {
            name: langTranslations.nameLabel,
            colName: 'project_name',
            columnWidth: 'w-2/12',
          },
          {
            name: langTranslations.projectCodeLabel,
            colName: 'project_code',
          },
          {
            name: langTranslations.landingPage.grantTypeLabel,
            lgScreenCollapsable: true,
            colName: 'grant_type',
          },
          {
            name: langTranslations.statusLabel,
            lgScreenCollapsable: true,
            colName: 'project_status',
          },
        ]"
      />
    </div>
    <div v-else class="text-center flex justify-center">
      <LoadingSpinner v-if="!loaded" />
      <H4
        class="py-10"
        v-else
        :content="langTranslations.noProjectsFoundForApproval"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
