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
import type { uploadFileData, uploadedFile } from "@/utils/types/commonTypes";
import H4 from "@/components/headings/H4.vue";
import { useRoute } from "vue-router";
import { useActiveProjectStore } from "@/stores/ActiveProjectStore";
import { Icon } from "@iconify/vue";
import { ApiClient } from "@/api/ApiClient";
import { UploadsApi } from "@/api/services/UploadsApi";
import type { CustomErrors } from "@/utils/classes/CustomErrors";
import { ProjectsApi } from "@/api/services/ProjectsApi";
import { useLoggedInDistrict } from "@/stores/LoggedInDistrict";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import Hr from "@/components/hr/Hr.vue";
/* Props */
const { projectType } = defineProps<{
  projectType: "club" | "dsg" | "dm";
}>();

/* Data */
type uploadedFileCheckbox = uploadedFile & { checked: boolean };
const projectsApi = new ProjectsApi(new ApiClient());
const uploadsApi = new UploadsApi(new ApiClient());
const toBeDeletedFiles = ref<Array<uploadedFile>>([]); // files to be deleted
const { langTranslations } = useLanguage();
const { handleError } = errorHandler();
const validStatuses = [
  "Pending Approval",
  "Approved",
  "Reports Due",
  "Completed",
];
const componentKey = ref(0);
const isAllSelected = ref({
  evidence: false,
  projectGallery: false,
  report: false,
});
const coverImageReqData = {
  databaseTarget: "project-media",
  storagePath: "./projects",
  files: [],
  fileTypes: "project-coverImage",
} as uploadFileData;

const projectGalleryReqData = {
  databaseTarget: "project-media",
  storagePath: "./projects",
  files: [],
  fileTypes: "project-gallery",
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

/* Hooks */
onMounted(async () => {});

/* Methods */
const fetchUpdatedData = async () => {
  try {
    const response = await projectsApi.getProject(projectId ?? 0);
    useActiveProjectStore().setActiveProject(response);
    componentKey.value += 1;
  } catch (error) {
    handleError(error as CustomErrors);
  }
};

const deleteFiles = async (file: uploadedFile | uploadedFile[]) => {
  try {
    const toDelete = Array.isArray(file) ? file : [file];
    await uploadsApi.deleteFiles(toDelete, projectId ?? 0);
    isAllSelected.value = {
      evidence: false,
      projectGallery: false,
      report: false,
    };
    fetchUpdatedData();
  } catch (error) {
    handleError(error as CustomErrors);
  }
};

const stripUrlPart = (url: string) => {
  if (url) {
    // Regular expression to match the pattern and capture the filename

    const split = url && url.split("_");
    const filename = split[split.length - 1];
    // If matches are found, return the filename, else return the original URL
    return filename;
  } else {
    return url;
  }
};

const handleCheckboxChange = (event: Event, row: uploadedFile) => {
  const target = event.target as HTMLInputElement;
  if (target.checked) {
    toBeDeletedFiles.value.push(row);
  } else {
    const index = toBeDeletedFiles.value
      .map((file) => file.s3Name)
      .indexOf(row.s3Name);
    if (index > -1) {
      toBeDeletedFiles.value.splice(index, 1);
    }
  }
};

const handleSelectAll = (e: Event, type: "gallery" | "evidence" | "report") => {
  const target = e.target as HTMLInputElement;

  if (target.checked) {
    if (type === "gallery") {
      toBeDeletedFiles.value = useActiveProjectStore().activeProject
        .file_uploads.project_gallery as uploadedFileCheckbox[];
      for (const file of useActiveProjectStore().activeProject.file_uploads
        .project_gallery as uploadedFileCheckbox[]) {
        file.checked = target.checked;
      }
    } else if (type === "evidence") {
      toBeDeletedFiles.value = useActiveProjectStore().activeProject
        .file_uploads.evidence_files as uploadedFileCheckbox[];
      for (const file of useActiveProjectStore().activeProject.file_uploads
        .evidence_files as uploadedFileCheckbox[]) {
        file.checked = target.checked;
      }
    } else if (type === "report") {
      toBeDeletedFiles.value = useActiveProjectStore().activeProject
        .file_uploads.reports_files as uploadedFileCheckbox[];
      for (const file of useActiveProjectStore().activeProject.file_uploads
        .reports_files as uploadedFileCheckbox[]) {
        file.checked = target.checked;
      }
    }
  } else {
    if (type === "gallery") {
      for (const file of useActiveProjectStore().activeProject.file_uploads
        .project_gallery as uploadedFileCheckbox[]) {
        file.checked = target.checked;
      }
    } else if (type === "evidence") {
      for (const file of useActiveProjectStore().activeProject.file_uploads
        .evidence_files as uploadedFileCheckbox[]) {
        file.checked = target.checked;
      }
    } else if (type === "report") {
      for (const file of useActiveProjectStore().activeProject.file_uploads
        .reports_files as uploadedFileCheckbox[]) {
        file.checked = target.checked;
      }
    }
    toBeDeletedFiles.value = [];
  }
};

const generateUploadLimits = (
  limitPer: number,
  type: "gallery" | "evidence" | "report",
  maxLimit: number
) => {
  const uploadLimit = {
    maxFilesUploadPer: limitPer,
    uploadMaxLimit: maxLimit,
    typeListLength: 0,
  };
  switch (type) {
    case "gallery":
      uploadLimit.typeListLength =
        (useActiveProjectStore().activeProject.file_uploads.project_gallery &&
          (
            useActiveProjectStore().activeProject.file_uploads
              .project_gallery as []
          ).length) ??
        0;
      break;
    case "evidence":
      uploadLimit.typeListLength =
        (useActiveProjectStore().activeProject.file_uploads.evidence_files &&
          (
            useActiveProjectStore().activeProject.file_uploads
              .evidence_files as []
          ).length) ??
        0;
      break;
    case "report":
      uploadLimit.typeListLength =
        (useActiveProjectStore().activeProject.file_uploads.reports_files &&
          (
            useActiveProjectStore().activeProject.file_uploads
              .reports_files as []
          ).length) ??
        0;
      break;
  }
  return uploadLimit;
};
</script>

<template>
  <div class="flex flex-col gap-8 justify-center items-center py-8">
    <div
      v-if="
        useLoggedInDistrict().loggedInDistrict.district_details.reportLinks
          .length > 0
      "
    >
      <H4
        class="text-center mb-4"
        :content="
          useLoggedInDistrict().loggedInDistrict.district_details.reportLinks
            .length > 0
            ? langTranslations.downloadDistrictReports
            : langTranslations.noReportFormsFound
        "
      />
      <ul
        class="rounded-lg border border-primary p-4"
        v-if="
          useLoggedInDistrict().loggedInDistrict.district_details.reportLinks
            .length > 0
        "
      >
        <li
          v-for="report in useLoggedInDistrict().loggedInDistrict
            .district_details.reportLinks"
          :key="report.s3Name"
          class="flex gap-2 justify-center items-center"
        >
          <div class="flex">
            <a
              class="hover:text-primary hover:underline"
              :href="report.s3UrlLink"
              target="_blank"
              >{{ stripUrlPart(report.s3Name) }}</a
            >
          </div>
        </li>
      </ul>
      <div v-else>
        <H4
          class="text-center"
          :content="langTranslations.noReportFormsFound"
        />
      </div>
    </div>

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
    <hr class="w-full bg-gray-900 h-0.5" />
    <!-- Gallery Upload -->
    <div
      v-if="
        !useActiveProjectStore().activeProject.file_uploads.project_gallery ||
        (useActiveProjectStore().activeProject.file_uploads.project_gallery as []).length < 15
      "
      class="w-9/12 py-4"
    >
      <H4
        class="text-center pb-4"
        :content="langTranslations.uploadGalleryLabel"
      />
      <BaseFileUpload
        :key="componentKey"
        :submit-label="langTranslations.saveLabel"
        :req-data="projectGalleryReqData"
        :acceptedFileTypes="'imageOnly'"
        :project-id="projectId ?? 0"
        :dropzone-mode="true"
        :upload-limits="generateUploadLimits(10, 'gallery', 15)"
        :post-upload-callback="() => (componentKey += 1)"
      />
    </div>
    <div class="w-full" v-else>
      <div
        class="w-1/2 m-auto text-center rounded-lg border border-primary p-4"
      >
        {{ langTranslations.maxGalleryUploads }}
      </div>
    </div>
    <div
      class="w-full"
      v-if="
        useActiveProjectStore().activeProject.file_uploads.project_gallery &&
        (useActiveProjectStore().activeProject.file_uploads.project_gallery as [])
          .length > 0
      "
    >
      <RotaryButton
        :disable="toBeDeletedFiles.length < 1"
        :label="langTranslations.deleteLabel"
        @click="deleteFiles(toBeDeletedFiles)"
        :theme="'primary'"
      />
      <table class="w-full text-sm text-left text-nearWhite">
        <thead class="text-xs text-nearWhite uppercase bg-gray-500">
          <th scope="col" class="p-4">
            <div class="flex items-center">
              <input
                id="checkbox-all-search"
                @change="handleSelectAll($event, 'gallery')"
                v-model="isAllSelected.projectGallery"
                type="checkbox"
                class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded"
              />
              <label for="checkbox-all-search" class="sr-only">checkbox</label>
            </div>
          </th>
          <th scope="col" class="px-6 py-3">
            {{ "#" }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ "File" }}
          </th>
          <th scope="col" class="px-6 py-3 text-center">
            {{ langTranslations.deleteLabel }}
          </th>
        </thead>
        <tbody>
          <tr
            v-for="(file, index) in (useActiveProjectStore().activeProject
              .file_uploads.project_gallery as uploadedFileCheckbox[])"
            :key="file.s3Name"
            class="bg-gray-800 border-b border-gray-700"
          >
            <td class="w-4 p-4">
              <div class="flex justify-center items-center">
                <input
                  @change="handleCheckboxChange($event, file)"
                  v-model="file.checked"
                  :id="'checkbox-table-search-'"
                  type="checkbox"
                  class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded"
                />
                <label :for="'checkbox-table-search-'" class="sr-only"
                  >checkbox</label
                >
              </div>
            </td>
            <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
              {{ index + 1 }}
            </th>
            <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
              <a target="_blank" :href="file.s3UrlLink">
                {{ stripUrlPart(file.s3Name) }}
              </a>
            </th>
            <td class="px-6 py-4 flex justify-center">
              <div
                @click="deleteFiles(file)"
                :title="langTranslations.deleteLabel"
                class="cursor-pointer font-bold text-lg lg:text-xl text-primary hover:text-primaryHover hover:underline"
              >
                <Icon icon="tabler:trash" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Evidence Upload -->
    <hr class="w-full bg-gray-900 h-0.5" />
    <div
      class="w-9/12 py-4"
      v-if="projectType === 'dsg' || projectType === 'dm'"
    >
      <H4
        class="text-center pb-4"
        :content="langTranslations.uploadEvidenceLabel"
      />
      <p
        class="text-center text-red-500 mb-4"
        v-if="
          validStatuses.includes(
            useActiveProjectStore().activeProject.project_status
          )
        "
      >
        {{ langTranslations.uploadEvidenceDisabled }}
      </p>
      <BaseFileUpload
        :key="componentKey"
        :submit-label="langTranslations.saveLabel"
        :req-data="evidenceFlieReqData"
        :acceptedFileTypes="'docsOnly'"
        :project-id="projectId ?? 0"
        :dropzone-mode="true"
        :disabled="
          validStatuses.includes(
            useActiveProjectStore().activeProject.project_status
          )
        "
        :upload-limits="generateUploadLimits(5, 'evidence', 10)"
        :post-upload-callback="() => (componentKey += 1)"
      />
    </div>
    <div
      class="w-full"
      v-if="
        useActiveProjectStore().activeProject.file_uploads.evidence_files
          .length > 0
      "
    >
      <RotaryButton
        :disable="toBeDeletedFiles.length < 1"
        :label="langTranslations.deleteLabel"
        @click="deleteFiles(toBeDeletedFiles)"
        :theme="'primary'"
      />
      <table class="w-full text-sm text-left text-nearWhite">
        <thead class="text-xs text-nearWhite uppercase bg-gray-500">
          <th scope="col" class="p-4">
            <div class="flex items-center">
              <input
                id="checkbox-all-search"
                @change="handleSelectAll($event, 'evidence')"
                v-model="isAllSelected.evidence"
                type="checkbox"
                class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded"
              />
              <label for="checkbox-all-search" class="sr-only">checkbox</label>
            </div>
          </th>
          <th scope="col" class="px-6 py-3">
            {{ "#" }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ "File" }}
          </th>
          <th scope="col" class="px-6 py-3 text-center">
            {{ langTranslations.deleteLabel }}
          </th>
        </thead>
        <tbody>
          <tr
            v-for="(file, index) in (useActiveProjectStore().activeProject
              .file_uploads.evidence_files as uploadedFileCheckbox[])"
            :key="file.s3Name"
            class="bg-gray-800 border-b border-gray-700"
          >
            <td class="w-4 p-4">
              <div class="flex justify-center items-center">
                <input
                  @change="handleCheckboxChange($event, file)"
                  v-model="file.checked"
                  :id="'checkbox-table-search-'"
                  type="checkbox"
                  class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded"
                />
                <label :for="'checkbox-table-search-'" class="sr-only"
                  >checkbox</label
                >
              </div>
            </td>
            <th
              scope="row"
              class="whitespace-nowrap px-6 py-4 font-medium text-nearWhite"
            >
              {{ index + 1 }}
            </th>
            <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
              <a target="_blank" :href="file.s3UrlLink">
                {{ stripUrlPart(file.s3Name) }}
              </a>
            </th>
            <td class="px-6 py-4 flex justify-center">
              <div
                @click="deleteFiles(file)"
                :title="langTranslations.deleteLabel"
                class="cursor-pointer font-bold text-lg lg:text-xl text-primary hover:text-primaryHover hover:underline"
              >
                <Icon icon="tabler:trash" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Report Upload -->
    <hr class="w-full bg-gray-900 h-0.5" />
    <div
      class="w-9/12 py-4"
      v-if="projectType === 'dsg' || projectType === 'dm'"
    >
      <H4
        class="text-center pb-4"
        :content="langTranslations.uploadreportsLabel"
      />
      <BaseFileUpload
        :key="componentKey"
        :submit-label="langTranslations.saveLabel"
        :req-data="reportFlieReqData"
        :acceptedFileTypes="'allTypes'"
        :project-id="projectId ?? 0"
        :dropzone-mode="true"
        :upload-limits="generateUploadLimits(5, 'report', 5)"
        :post-upload-callback="() => (componentKey += 1)"
      />
    </div>
    <div
      class="w-full"
      v-if="
        useActiveProjectStore().activeProject.file_uploads.reports_files
          .length > 0
      "
    >
      <RotaryButton
        :disable="toBeDeletedFiles.length < 1"
        :label="langTranslations.deleteLabel"
        @click="deleteFiles(toBeDeletedFiles)"
        :theme="'primary'"
      />
      <table class="w-full text-sm text-left text-nearWhite">
        <thead class="text-xs text-nearWhite uppercase bg-gray-500">
          <th scope="col" class="p-4">
            <div class="flex items-center">
              <input
                id="checkbox-all-search"
                @change="handleSelectAll($event, 'report')"
                v-model="isAllSelected.evidence"
                type="checkbox"
                class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded"
              />
              <label for="checkbox-all-search" class="sr-only">checkbox</label>
            </div>
          </th>
          <th scope="col" class="px-6 py-3">
            {{ "#" }}
          </th>
          <th scope="col" class="px-6 py-3">
            {{ langTranslations.fileLabel }}
          </th>
          <th scope="col" class="px-6 py-3 text-center">
            {{ langTranslations.deleteLabel }}
          </th>
        </thead>
        <tbody>
          <tr
            v-for="(file, index) in (useActiveProjectStore().activeProject
              .file_uploads.reports_files as uploadedFileCheckbox[])"
            :key="file.s3Name"
            class="bg-gray-800 border-b border-gray-700"
          >
            <td class="w-4 p-4">
              <div class="flex justify-center items-center">
                <input
                  @change="handleCheckboxChange($event, file)"
                  v-model="file.checked"
                  :id="'checkbox-table-search-'"
                  type="checkbox"
                  class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded"
                />
                <label :for="'checkbox-table-search-'" class="sr-only"
                  >checkbox</label
                >
              </div>
            </td>
            <th
              scope="row"
              class="whitespace-nowrap px-6 py-4 font-medium text-nearWhite"
            >
              {{ index + 1 }}
            </th>
            <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
              <a target="_blank" :href="file.s3UrlLink">
                {{ stripUrlPart(file.s3Name) }}
              </a>
            </th>
            <td class="px-6 py-4 flex justify-center">
              <div
                @click="deleteFiles(file)"
                :title="langTranslations.deleteLabel"
                class="cursor-pointer font-bold text-lg lg:text-xl text-primary hover:text-primaryHover hover:underline"
              >
                <Icon icon="tabler:trash" />
              </div>
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
