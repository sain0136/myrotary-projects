<script lang="ts">
export default {
  name: "ProjectApproval",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { useActiveProjectStore } from "@/stores/ActiveProjectStore";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import type { CustomError } from "@/utils/classes/CustomError";
import { grantType, projectStatus } from "@/utils/types/commonTypes";
import { ProjectsApi } from "@/api/services/ProjectsApi";
import { ApiClient } from "@/api/ApiClient";
const projectsApi = new ProjectsApi(new ApiClient());

/* Data */
const { langTranslations } = useLanguage();
const { handleError, handleSuccess } = errorHandler();
const projectApproval = ref("");
/* Hooks */
onMounted(async () => {});

/* Methods */
const approveProject = async () => {
  try {
    if (
      useActiveProjectStore().activeProject.project_status !==
      projectStatus.PENDINGAPPROVAL
    ) {
      projectApproval.value =
        langTranslations.value.projectFormLabels.projectApprovalError;
      setTimeout(() => {
        projectApproval.value = "";
      }, 3000);
      return;
    }
    await projectsApi.updateProjectStatus(
      projectStatus.APPROVED,
      useActiveProjectStore().activeProject.project_id
    );
    handleSuccess(langTranslations.value.toastSuccess);
  } catch (error) {
    handleError(error as CustomError);
  }
};
</script>

<template>
  <div class="details my-8 flex flex-col items-center gap-8">
    <h6 class="mt-4 text-center font-bold">
      {{ langTranslations.projectFormLabels.projectApprovalLabel }}
    </h6>
    <ul class="border border-primary p-4">
      <li>
        <strong>{{ langTranslations.nameLabel }}:</strong>
        {{
          useActiveProjectStore().activeProject.projectDetails.creatorData
            .fullName
        }}
      </li>
      <li>
        <strong>{{ langTranslations.email }}:</strong>
        {{
          useActiveProjectStore().activeProject.projectDetails.creatorData.email
        }}
      </li>
      <li>
        <strong>{{ langTranslations.phone }}:</strong>
        {{
          useActiveProjectStore().activeProject.projectDetails.creatorData.phone
        }}
      </li>
    </ul>
    <p
      id="filled_error_help"
      class="text-xs text-red-600 dark:text-red-400 mb-8"
    >
      <span class="font-medium">{{ projectApproval }}</span>
    </p>
    <RotaryButton
      v-if="
        useLoggedInUserStore().loggedInUser.role === 'District Admin' ||
        useLoggedInUserStore().loggedInUser.role === 'District Grants Chair'
      "
      :label="langTranslations.approveLabel"
      :theme="'black'"
      @click="approveProject()"
    />
    <h6 v-else class="mt-4 text-center font-bold">
      {{ langTranslations.projectFormLabels.projectApprovalHelpText }}
    </h6>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
