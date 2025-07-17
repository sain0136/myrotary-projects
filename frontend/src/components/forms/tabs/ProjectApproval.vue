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
import router from "@/router";
import { MailApi } from "@/api/services/MailApi";
import type { IEmail } from "@/utils/interfaces/IMail";

const projectsApi = new ProjectsApi(new ApiClient());
const mailApi = new MailApi(new ApiClient());

/* Data */
const { langTranslations, customPrintf } = useLanguage();
const { handleError, handleSuccess } = errorHandler();
const projectApproval = ref("");
const mailTemplates: Record<string, IEmail> = {
  projectRejectTemplate: {
    receiverEmail:
      useActiveProjectStore().activeProject.projectDetails.creatorData.email, 
    subject: langTranslations.value.mailTemplates.projectRejectTemplate.subject,
    messageBody: {
      message: customPrintf(
        langTranslations.value.mailTemplates.projectRejectTemplate.message,
        `${useActiveProjectStore().activeProject.project_name}`,
        `${useLoggedInUserStore().loggedInUser.role} - ${
          useLoggedInUserStore().loggedInUser.fullName
        }`
      ),
      messageIntructions: customPrintf(
        langTranslations.value.mailTemplates.projectRejectTemplate
          .messageIntructions,
        `${useLoggedInUserStore().loggedInUser.email}`
      ),
    },
  },
  reportRejectTemplate: {
    receiverEmail:
      useActiveProjectStore().activeProject.projectDetails.creatorData.email, 
    subject: langTranslations.value.mailTemplates.reportRejectTemplate.subject,
    messageBody: {
      message: customPrintf(
        langTranslations.value.mailTemplates.reportRejectTemplate.message,
        `${useActiveProjectStore().activeProject.project_name}`,
        `${useLoggedInUserStore().loggedInUser.role} - ${
          useLoggedInUserStore().loggedInUser.fullName
        }`
      ),
      messageIntructions: customPrintf(
        langTranslations.value.mailTemplates.reportRejectTemplate
          .messageIntructions,
        `${useLoggedInUserStore().loggedInUser.email}`
      ),
    },
  },
};
/* Hooks */
onMounted(async () => {});

/* Methods */
const approveProject = async (reject?: boolean) => {
  try {
    if (reject) {
      await projectsApi.updateProjectStatus(
        projectStatus.FULLYFUNDED,
        useActiveProjectStore().activeProject.project_id
      );
      await mailApi.sendMail(mailTemplates.projectRejectTemplate);
      handleSuccess(langTranslations.value.toastSuccess);
      redirect();
      return
    }
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
    redirect();
  } catch (error) {
    handleError(error as CustomError);
  }
};

const approveReports = async (reject?: boolean) => {
  try {
    if (reject) {
      await projectsApi.updateProjectStatus(
        projectStatus.APPROVED,
        useActiveProjectStore().activeProject.project_id
      );
      await mailApi.sendMail(mailTemplates.reportRejectTemplate);
      handleSuccess(langTranslations.value.toastSuccess);
      redirect();
      return  
    }
    if (
      useActiveProjectStore().activeProject.project_status !==
      projectStatus.REPORTSDUE
    ) {
      projectApproval.value =
        langTranslations.value.projectFormLabels.projectApprovalError;
      setTimeout(() => {
        projectApproval.value = "";
      }, 3000);
      return;
    }
    await projectsApi.updateProjectStatus(
      projectStatus.COMPLETED,
      useActiveProjectStore().activeProject.project_id
    );
    handleSuccess(langTranslations.value.toastSuccess);
    redirect();
  } catch (error) {
    handleError(error as CustomError);
  }
};

const redirect = () => {
  router.push({ name: "Approvals" });
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
      class="text-xs text-red-600 dark:text-red-400 mb-4"
    >
      <span class="font-medium">{{ projectApproval }}</span>
    </p>
    <div class="border border-primary p-4 font-bold">
      <div
        class="flex flex-col gap-4 justify-center items-center"
        v-if="
          (useLoggedInUserStore().loggedInUser.role === 'District Admin' ||
            useLoggedInUserStore().loggedInUser.role ===
              'District Grants Chair') &&
          useActiveProjectStore().activeProject.project_status ===
            projectStatus.PENDINGAPPROVAL
        "
      >
        <p>{{ langTranslations.projectFormLabels.approveProjectLabel }}</p>
        <div class="flex gap-4">
          <RotaryButton
            :label="langTranslations.approveLabel"
            :theme="'black'"
            @click="approveProject()"
          />
          <RotaryButton
            :label="langTranslations.rejectLabel"
            :theme="'black'"
            @click="approveProject(true)"
          />
        </div>
      </div>
      <h6
        v-else-if="
          useActiveProjectStore().activeProject.project_status !==
          projectStatus.PENDINGAPPROVAL
        "
        class="text-center font-bold"
      >
        {{ langTranslations.projectFormLabels.projectWasAprrovedLabel }}
      </h6>
    </div>
    <div
      class="border border-primary p-4 font-bold flex flex-col gap-4 justify-center items-center"
      v-if="
        (useLoggedInUserStore().loggedInUser.role === 'District Admin' ||
          useLoggedInUserStore().loggedInUser.role ===
            'District Grants Chair') &&
        useActiveProjectStore().activeProject.project_status ===
          projectStatus.REPORTSDUE
      "
    >
      <p>{{ langTranslations.projectFormLabels.approveReportsLabel }}</p>
      <div class="flex gap-4">
        <RotaryButton
          :label="langTranslations.approveLabel"
          :theme="'black'"
          @click="approveReports()"
        />
        <RotaryButton
          :label="langTranslations.rejectLabel"
          :theme="'black'"
          @click="approveReports(true)"
        />
      </div>
    </div>
    <h6
      class="border border-primary p-4 font-bold flex flex-col gap-4"
      v-else-if="
        useActiveProjectStore().activeProject.project_status ===
          projectStatus.COMPLETED &&
        useActiveProjectStore().activeProject.grant_type !==
          grantType.CLUBPROJECT
      "
    >
      {{ langTranslations.projectFormLabels.projectReportsAprrovedLabel }}
    </h6>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
