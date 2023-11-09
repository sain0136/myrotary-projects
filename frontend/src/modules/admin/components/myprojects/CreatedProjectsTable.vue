<script lang="ts">
export default {
  name: "CreatedProjectsTable",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref, watch } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { ApiClient } from "@/api/ApiClient";
import { ProjectsApi } from "@/api/services/ProjectsApi";
import type {
  IClubProject,
  IDmProject,
  IDsgProject,
} from "@/utils/interfaces/IProjects";
import type { CustomError } from "@/utils/classes/CustomError";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import LoadingSpinner from "@/components/loading/LoadingSpinner.vue";
import BaseDisplayTable from "@/components/tables/BaseDisplayTable.vue";
import type { IUser } from "@/utils/interfaces/IUser";
import H3 from "@/components/headings/H3.vue";

/* Data */
const { langTranslations } = useLanguage();
const { handleError, handleSuccess } = errorHandler();
const projectsApi = new ProjectsApi(new ApiClient());
const projects: Array<IDsgProject | IDmProject | IClubProject> = reactive([]);
const pagination = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  limit: 10,
});
const loaded = ref(false);
const { adminstratingView } = defineProps<{
  adminstratingView: boolean;
}>();
/* Hooks */
watch(
  () => pagination.limit,
  () => {
    getMyProjects();
  }
);

onMounted(async () => {
  try {
    await getMyProjects();
  } catch (error) {
    handleError(error as CustomError);
  }
});

/* Methods */
const getMyProjects = async () => {
  loaded.value = false;
  projects.splice(0, projects.length);
  const response = await projectsApi.fetchConditionalProjects(
    useLoggedInUserStore().loggedInUser.user_id,
    pagination.currentPage,
    pagination.limit,
    "created_by",
    adminstratingView
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
  getMyProjects();
};

const deleteProject = async (
  project: IDsgProject | IDmProject | IClubProject
) => {
  try {
  } catch (error) {}
};
</script>

<template>
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
        :delete-button="{
        show: true,
        callBack: (project) => {
          deleteProject(project as IDsgProject | IDmProject | IClubProject);
        },
      }"
        :edit-button="{
          show: true,
          callBack: (project) => {},
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
            lgScreenCollapsable: true,
            colName: 'project_code',
          },
          {
            name: langTranslations.landingPage.grantTypeLabel,
            lgScreenCollapsable: true,
            colName: 'project_type',
          },
          {
            name: langTranslations.statusLabel,
            lgScreenCollapsable: true,
            colName: 'grant_type',
          },
        ]"
      />
    </div>
    <div v-else class="text-center flex justify-center">
      <LoadingSpinner v-if="!loaded" />
      <H3
        class="py-10"
        v-else
        :content="langTranslations.myprojectsView.noProjectsFoundLabel"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
