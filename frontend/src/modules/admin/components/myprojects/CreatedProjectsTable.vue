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
import { CustomErrors } from "@/utils/classes/CustomErrors";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import LoadingSpinner from "@/components/loading/LoadingSpinner.vue";
import BaseDisplayTable from "@/components/tables/BaseDisplayTable.vue";
import H3 from "@/components/headings/H3.vue";
import router from "@/router";
import { modalHandler } from "@/utils/composables/ModalHandler";
import {
  projectStatus,
  type PaginationResult,
} from "@/utils/types/commonTypes";

/* Data */
const { changeShowModal, setModal } = modalHandler();
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
const {
  adminstratingView,
  districtAdminView,
  allProjectsView,
  clubProjectsView,
} = defineProps<{
  adminstratingView?: boolean;
  districtAdminView?: boolean;
  allProjectsView?: boolean;
  clubProjectsView?: boolean;
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
    handleError(error as CustomErrors);
  }
});

/* Methods */
const changeProjectStatus = async (
  project: IDsgProject | IDmProject | IClubProject,
  report?: boolean,
  complete?: boolean
) => {
  try {
    if (!report) {
      await projectsApi.updateProjectStatus(
        projectStatus.PENDINGAPPROVAL,
        project.project_id
      );
    }
    if (report) {
      await projectsApi.updateProjectStatus(
        projectStatus.REPORTSDUE,
        project.project_id
      );
    }
    if (complete) {
      await projectsApi.updateProjectStatus(
        projectStatus.COMPLETED,
        project.project_id
      );
    }
    router.go(0);
  } catch (error) {
    handleError(error as CustomErrors);
  }
};
const getMyProjects = async () => {
  loaded.value = false;
  projects.splice(0, projects.length);
  let response: PaginationResult;
  if (districtAdminView) {
    response = await projectsApi.fetchConditionalProjects(
      useLoggedInUserStore().loggedInUser.district_id as number,
      pagination.currentPage,
      pagination.limit,
      "district_id"
    );
  } else if (clubProjectsView) {
    response = await projectsApi.fetchConditionalProjects(
      useLoggedInUserStore().loggedInUser.club_id as number,
      pagination.currentPage,
      pagination.limit,
      "club_id"
    );
  } else if (allProjectsView) {
    response = await projectsApi.getAllProjects(
      pagination.currentPage,
      pagination.limit
    );
  } else {
    response = await projectsApi.fetchConditionalProjects(
      useLoggedInUserStore().loggedInUser.user_id,
      pagination.currentPage,
      pagination.limit,
      "created_by",
      adminstratingView === true ? true : false
    );
  }

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
    const id = project.project_id ?? null;
    setModal(
      langTranslations.value.deleteLabel,
      langTranslations.value.confirmationDelete + " " + project.project_name
    );
    const confirmed = await changeShowModal(true);
    if (id && confirmed) {
      await projectsApi.deleteProject(id, false);
      handleSuccess(langTranslations.value.succssDeleteToast);
    }
    getMyProjects();
  } catch (error) {
    handleError(error as CustomErrors);
  }
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
        :project-complete-button="{
          show: true,
          callBack: (project) => {
            changeProjectStatus(project as IDsgProject | IDmProject | IClubProject, false, true);
          }
        }"
        :submit-for-reports-button="
          {
            show: true,
            callBack: (project) => {
              changeProjectStatus(project as IDsgProject | IDmProject | IClubProject, true);
            }
          }
        "
        :send-for-approval-button="{
          show: true,
          callBack: (project) => {
            changeProjectStatus(project as IDsgProject | IDmProject | IClubProject, false);
          },
        }"
        :delete-button="{
        show: true,
        callBack: (project) => {
          deleteProject(project as IDsgProject | IDmProject | IClubProject);
        },
      }"
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
            elipsis: {
              show: true,
              length: 15,
            },
            title: false,
            toolTip: {
              show: true,
              columnsApplied: ['project_name'],
            }
          },
          {
            name: langTranslations.projectCodeLabel,
            colName: 'project_code',
            collapsable: true,
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
