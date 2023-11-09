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
import { CustomError } from "@/utils/classes/CustomError";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import LoadingSpinner from "@/components/loading/LoadingSpinner.vue";
import BaseDisplayTable from "@/components/tables/BaseDisplayTable.vue";
import type { IUser } from "@/utils/interfaces/IUser";
import H3 from "@/components/headings/H3.vue";
import router from "@/router";
import { modalHandler } from "@/utils/composables/ModalHandler";

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
    handleError(error as CustomError);
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
        default:
          throw new CustomError(900, "Project not found", {
            en: "Project not found",
            fr: "Projet introuvable",
          });
      }
    } else {
      throw new CustomError(900, "Project not found", {
        en: "Project not found",
        fr: "Projet introuvable",
      });
    }
  } catch (error) {
    handleError(error as CustomError);
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
          },
          {
            name: langTranslations.projectCodeLabel,
            lgScreenCollapsable: true,
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
