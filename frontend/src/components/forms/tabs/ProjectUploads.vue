<script lang="ts">
export default {
  name: "ProjectUploads",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import BaseFileUpload from "@/components/form/BaseFileUpload.vue";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import type { uploadFileData, uploadedFile } from "@/utils/types/commonTypes";
import H4 from "@/components/headings/H4.vue";
import { useRoute } from "vue-router";
import { useActiveProjectStore } from "@/stores/ActiveProjectStore";
import { Icon } from "@iconify/vue";
import { ApiClient } from "@/api/ApiClient";
import { UploadsApi } from "@/api/services/UploadsApi";
import type { CustomErrors } from "@/utils/classes/CustomErrors";
import { ProjectsApi } from "@/api/services/ProjectsApi";

/* Data */
const projectsApi = new ProjectsApi(new ApiClient());
const uploadsApi = new UploadsApi(new ApiClient());
const { langTranslations } = useLanguage();
const { handleError } = errorHandler();
const coverImageReqData = {
  databaseTarget: "project-media",
  storagePath: "./projects",
  files: [],
  fileTypes: "project-coverImage",
} as uploadFileData;

const evidenceFlieReqData = {
  databaseTarget: "project-media",
  storagePath: "./projects",
  files: [],
  fileTypes: "project-document-evidence",
} as uploadFileData;

const reportFlieReqData = {
  databaseTarget: "project-media",
  storagePath: "./projects",
  files: [],
  fileTypes: "project-report-files",
} as uploadFileData;
const route = useRoute();
// required form data
const projectId =
  route.params.projectId !== "" ? Number(route.params.projectId) : null;
//

const { projectType } = defineProps<{
  projectType: "club" | "dsg" | "dm";
}>();
/* Hooks */
onMounted(async () => {});

/* Methods */

const fetchUpdatedData = async () => {
  try {
    const response = await projectsApi.getProject(projectId ?? 0);
    useActiveProjectStore().setActiveProject(response);
  } catch (error) {
    handleError(error as CustomErrors);
  }
};

const deleteFiles = async (file: uploadedFile) => {
  try {
    await uploadsApi.deleteFiles([file.s3Name], projectId ?? 0);
    fetchUpdatedData();
  } catch (error) {
    handleError(error as CustomErrors);
  }
};

const stripUrlPart = (url: string) => {
  // Regular expression to match the pattern and capture the filename

  const split = url.split("_");
  const filename = split[split.length - 1];
  // If matches are found, return the filename, else return the original URL
  return filename;
};
</script>

<template>
  <div class="flex flex-col gap-8 justify-center items-center py-8">
    <!-- Cover Image Upload -->
    <H4
      class="text-center"
      :content="langTranslations.projectFormLabels.coverImageUploadHeader"
    />
    <div
      class="flex w-full md:w-1/2 max-w-md flex-col gap-2 rounded-lg border border-primary p-4"
    >
      <div class="flex justify-center">
        <img
          :src="(useActiveProjectStore().activeProject.file_uploads.project_image as uploadedFile).s3UrlLink "
          class="w- h-2/4 aspect-ratio object-cover"
          alt=""
        />
      </div>
      <BaseFileUpload
        :submit-label="langTranslations.saveLabel"
        :req-data="coverImageReqData"
        :acceptedFileTypes="'imageOnly'"
        :project-id="projectId ?? 0"
      />
    </div>
    <!-- Evidence Upload -->
    <div
      class="w-9/12 py-4"
      v-if="projectType === 'dsg' || projectType === 'dm'"
    >
      <H4
        class="text-center pb-4"
        :content="langTranslations.uploadEvidenceLabel"
      />
      <BaseFileUpload
        :submit-label="langTranslations.saveLabel"
        :req-data="evidenceFlieReqData"
        :acceptedFileTypes="'docsOnly'"
        :project-id="projectId ?? 0"
        :dropzone-mode="true"
      />
    </div>
    <div
      v-if="
        useActiveProjectStore().activeProject.file_uploads.evidence_files
          .length > 0
      "
    >
      <table class="w-full text-sm text-left text-nearWhite">
        <thead class="text-xs text-nearWhite uppercase bg-gray-500">
          <th scope="col" class="px-6 py-3">
            {{ "File" }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ langTranslations.deleteLabel }}
          </th>
        </thead>
        <tbody>
          <tr
            v-for="file in (useActiveProjectStore().activeProject
              .file_uploads.evidence_files as uploadedFile[])"
            :key="file.s3Name"
            class="bg-gray-800 border-b border-gray-700"
          >
            <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
              <a target="_blank" :href="file.s3UrlLink">
                {{ stripUrlPart(file.s3Name) }}
              </a>
            </th>
            <td class="px-6 py-4 flex justify-center">
              <a
                @click="deleteFiles(file)"
                :title="langTranslations.deleteLabel"
                href=""
                class="font-bold text-lg lg:text-xl text-primary hover:text-primaryHover hover:underline"
                ><Icon icon="tabler:trash"
              /></a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Report Upload -->
    <div
      class="w-9/12 py-4"
      v-if="projectType === 'dsg' || projectType === 'dm'"
    >
      <H4
        class="text-center pb-4"
        :content="langTranslations.uploadreportsLabel"
      />
      <BaseFileUpload
        :submit-label="langTranslations.saveLabel"
        :req-data="reportFlieReqData"
        :acceptedFileTypes="'allTypes'"
        :project-id="projectId ?? 0"
        :dropzone-mode="true"
      />
    </div>
    <div
      v-if="
        useActiveProjectStore().activeProject.file_uploads.reports_files
          .length > 0
      "
    >
      <table class="w-full text-sm text-left text-nearWhite">
        <thead class="text-xs text-nearWhite uppercase bg-gray-500">
          <th scope="col" class="px-6 py-3">
            {{ "File" }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ langTranslations.deleteLabel }}
          </th>
        </thead>
        <tbody>
          <tr
            v-for="file in (useActiveProjectStore().activeProject
              .file_uploads.reports_files as uploadedFile[])"
            :key="file.s3Name"
            class="bg-gray-800 border-b border-gray-700"
          >
            <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
              <a target="_blank" :href="file.s3UrlLink">
                {{ stripUrlPart(file.s3Name) }}
              </a>
            </th>
            <td class="px-6 py-4 flex justify-center">
              <a
                @click="deleteFiles(file)"
                :title="langTranslations.deleteLabel"
                href=""
                class="font-bold text-lg lg:text-xl text-primary hover:text-primaryHover hover:underline"
                ><Icon icon="tabler:trash"
              /></a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
