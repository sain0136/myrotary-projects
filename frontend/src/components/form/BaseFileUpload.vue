<script lang="ts">
export default {
  name: "BaseFileUpload",
};
</script>

<script setup lang="ts">
import { ref, reactive, defineProps } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import type { uploadFileData } from "@/utils/types/commonTypes";
import { CustomErrors } from "@/utils/classes/CustomErrors";
import { useLanguage } from "@/utils/languages/UseLanguage";
import H3 from "@/components/headings/H3.vue";
import { ApiClient } from "@/api/ApiClient";
import { AssetsApi } from "@/api/services/AssestsApi";
import { useSiteAssets } from "@/stores/SiteAssets";
import { UploadsApi } from "@/api/services/UploadsApi";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import { ProjectsApi } from "@/api/services/ProjectsApi";
import { useActiveProjectStore } from "@/stores/ActiveProjectStore";
import { Icon } from "@iconify/vue";
import LoadingSpinner from "@/components/loading/LoadingSpinner.vue";

/* Data */
const MAXBYTES = 10485760;
const projectsApi = new ProjectsApi(new ApiClient());
const { langTranslations, languagePref } = useLanguage();
const assetsApi = new AssetsApi(new ApiClient());
const siteAssetsStore = useSiteAssets();
const uploadsApi = new UploadsApi(new ApiClient());
const { handleError, handleSuccess } = errorHandler();
const userStore = useLoggedInUserStore();
const fileInput = ref(null);
const loading = ref(false);
const allowedDoctypesMap = {
  docsOnly: {
    acceptsString:
      "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation ",
    en: "Accepts DOC, DOCX, XLS, XLSX, PPT, PPTX, PDF (Max size: 10MB),",
    fr: "Accepte DOC, DOCX, XLS, XLSX, PPT, PPTX, PDF (Max size: 10MB),",
  },
  allTypes: {
    acceptsString: "image/*,application/*",
    en: "Accepts DOC, DOCX, XLS, XLSX, PPT, PPTX, PDF, SVG, PNG, JPG (Max size: 10MB)",
    fr: "Accepte DOC, DOCX, XLS, XLSX, PPT, PPTX, PDF, SVG, PNG, JPG (Max size: 10MB)",
  },
  imageOnly: {
    acceptsString: "image/*",
    en: "Accepts PNG, JPG (Max size: 10MB)",
    fr: "Accepte PNG, JPG (Max size: 10MB)",
  },
};
interface ValidationData {
  file: File | File[] | null;
}

const {
  acceptedFileTypes,
  fileUploadLabelFormats,
  submitLabel,
  reqData,
  projectId,
  userId,
  dropzoneMode,
  districtId,
  dropzoneAcceptedFileTypes,
  customIdentifier,
  postUploadCallback,
  iconMode,
  uploadLimits,
} = defineProps<{
  acceptedFileTypes?: "allTypes" | "docsOnly" | "imageOnly";
  fileUploadLabelFormats?: string;
  title?: string;
  submitLabel: string;
  reqData: uploadFileData;
  userId?: number;
  projectId?: number;
  districtId?: number;
  dropzoneMode?: boolean;
  dropzoneAcceptedFileTypes?: "allTypes" | "docsOnly";
  customIdentifier?: string;
  postUploadCallback?: Function;
  iconMode?: boolean;
  uploadLimits?: {
    maxFiles?: number;
  };
}>();

const validationData: ValidationData = reactive({
  file: null,
});

const validationRules = {
  file: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.noFilesUpload,
      (value) => {
        if (iconMode) {
          // If iconMode   is true, skip validation by returning true
          return true;
        }
        // Otherwise, perform the required validation
        return !!value;
      }
    ),
  },
};
const v$ = useVuelidate(validationRules, validationData);

const handleFileChange = (event: Event, multiple: boolean) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files || !files[0]) return;
  if (files && files[0] && multiple) {
    validationData.file = [...files];
  } else {
    validationData.file = files[0];
  }
  if (iconMode) {
    submit();
  }
};

const handleDrop = (event: any) => {
  event.preventDefault();
  const files: FileList = event.dataTransfer.files;
  if (typeof files === "object") {
    validationData.file = [];
    Object.keys(files).forEach((key: any) => {
      validationData.file = [...(validationData.file as File[]), files[key]];
    });
  }
};

const uploadLimitexceeded = () => {
  if (uploadLimits && uploadLimits.maxFiles) {
    if (validationData.file && Array.isArray(validationData.file)) {
      if (validationData.file.length > uploadLimits.maxFiles) {
        handleError(
          new CustomErrors(
            400,
            `You can upload a maximum of ${uploadLimits.maxFiles} files`,
            {
              en: `You can upload a maximum of ${uploadLimits.maxFiles} files`,
              fr: `Vous pouvez télécharger un maximum de ${uploadLimits.maxFiles} fichiers`,
            }
          )
        );
        return true;
      }
    }
  }
  return false;
};

const submit = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  if (uploadLimitexceeded()) return;
  if (!v$.value.$error) {
    try {
      v$.value.$reset();
      let filesArray;
      if (validationData.file) {
        if (Array.isArray(validationData.file)) {
          filesArray = validationData.file;
        } else {
          filesArray = [validationData.file];
        }
      }
      const totalSize =
        filesArray && filesArray.length > 0
          ? filesArray.reduce((acc, file) => {
              return acc + file.size;
            }, 0)
          : 0;
      if (totalSize > MAXBYTES) {
        handleError(
          new CustomErrors(
            400,
            "Upload file/files size exceeds limit of 10MB",
            {
              en: "Upload file/files size exceeds limit of 10MB",
              fr: "La taille du fichier est supérieure à la limite de 10MB",
            }
          )
        );
        return;
      }
      const req: uploadFileData = {
        files: filesArray as File[],
        databaseTarget: reqData.databaseTarget,
        storagePath: reqData.storagePath,
        fileTypes: reqData.fileTypes,
      };
      loading.value = true;
      const response = await uploadsApi.uploadFile(
        req,
        userId,
        projectId,
        districtId,
        customIdentifier
      );
      loading.value = false;
      if (response && "user_id" in response) {
        userStore.setLoggedInUser(response);
      }
      const updateResponse = await assetsApi.getMainAssets();
      siteAssetsStore.setSiteAssets(updateResponse);
      if (projectId) {
        const response3 = await projectsApi.getProject(projectId ?? 0);
        useActiveProjectStore().setActiveProject(response3);
      }
      handleSuccess(langTranslations.value.toastSuccess);
      resetInput();
      if (postUploadCallback) {
        postUploadCallback();
      }
    } catch (error) {
      const failUpload = new CustomErrors(500, "Failed to upload file", {
        en: "Failed to upload file",
        fr: "Echec du telechargement du fichier",
      });
      handleError(failUpload);
      console.error(error as CustomErrors);
    }
  }
};

const getFileTypes = () => {
  if (acceptedFileTypes === "docsOnly") {
    return allowedDoctypesMap.docsOnly.acceptsString;
  } else if (acceptedFileTypes === "allTypes") {
    return allowedDoctypesMap.allTypes.acceptsString;
  } else if (acceptedFileTypes === "imageOnly") {
    return allowedDoctypesMap.imageOnly.acceptsString;
  }
};

const resetInput = () => {
  validationData.file = null;
  v$.value.$reset();
  const fileInput = document.getElementById("file_input") as HTMLInputElement;
  fileInput.value = "";
};

const clear = () => {
  validationData.file = null;
  v$.value.$reset();
  const fileInput = document.getElementById("file_input") as HTMLInputElement;
  fileInput.value = "";
};

const triggerFileInput = () => {
  (fileInput.value as unknown as HTMLInputElement).click();
};
</script>

<template>
  <div>
    <div
      class="flex items-center gap-2"
      @click="triggerFileInput"
      v-if="iconMode"
    >
      <Icon icon="material-symbols:upload-sharp" />
      <input
        @event.preventDefault()
        class="hidden w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
        aria-describedby="file_input_help"
        id="file_input"
        type="file"
        @change="handleFileChange($event, false)"
        :accept="getFileTypes()"
        ref="fileInput"
        style="display: none"
      />
    </div>
    <div
      v-if="!dropzoneMode && !iconMode"
      class="flex flex-col items-center gap-2"
    >
      <div class="py-8"></div>
      <H3 v-if="title" :content="title" />
      <div class="flex flex-col items-center gap-2" v-if="!loading">
        <input
          class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
          aria-describedby="file_input_help"
          id="file_input"
          type="file"
          @change="handleFileChange($event, false)"
          :accept="getFileTypes()"
        />
        <p v-if="v$.file.$error" class="text-red-500">
          {{ v$.file.$errors[0].$message }}
        </p>
        <p class="font-bold" id="file_input_help">
          {{ fileUploadLabelFormats }}
        </p>
        <div>
          <RotaryButton :label="submitLabel" :theme="'black'" @click="submit">
          </RotaryButton>
          <RotaryButton
            :disable="!validationData.file"
            :label="langTranslations.clearLabel"
            :theme="'secondary'"
            @click="clear"
          >
          </RotaryButton>
        </div>
      </div>
      <LoadingSpinner v-if="loading" />
    </div>
    <div
      v-if="dropzoneMode && !loading"
      class="flex flex-col items-center gap-4"
    >
      <div class="flex items-center justify-center w-full">
        <label
          @dragover.prevent
          @drop="handleDrop"
          :class="{
            'pg-bg': validationData.file,
          }"
          id="drop_zone"
          class="flex flex-col items-center justify-center w-full h-64 border-2 border-primary border-dashed rounded-lg cursor-pointer bg-gray-50"
        >
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              class="w-8 h-8 mb-4 text-nearBlack"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <strong v-if="(validationData.file as File[])?.length > 0">{{
              ((validationData.file as File[])?.length > 0
                ? (validationData.file as File[])?.length
                : 0) +
              " " +
              langTranslations.filesSelectedLabel
            }}</strong>
            <p class="mb-2 text-sm">
              <span class="font-semibold">{{
                langTranslations.clickToUpload
              }}</span>
              {{ langTranslations.dragAndDropLabel }}
            </p>
            <p class="text-xs text-gray-500">
              {{
                dropzoneAcceptedFileTypes === "allTypes"
                  ? allowedDoctypesMap.allTypes[languagePref]
                  : allowedDoctypesMap.docsOnly[languagePref]
                  ? allowedDoctypesMap.docsOnly[languagePref]
                  : ""
              }}
            </p>
          </div>
          <input
            @change="handleFileChange($event, true)"
            multiple
            id="dropzone-file"
            type="file"
            class="hidden"
            :accept="getFileTypes()"
          />
        </label>
      </div>
      <div class="text-center">
        <p v-if="v$.file.$error" class="text-red-500 py-4">
          {{ v$.file.$errors[0].$message }}
        </p>
        <RotaryButton :label="submitLabel" :theme="'black'" @click="submit">
        </RotaryButton>
        <RotaryButton
          :disable="!validationData.file"
          :label="langTranslations.clearLabel"
          :theme="'secondary'"
          @click="clear"
        >
        </RotaryButton>
      </div>
    </div>
    <LoadingSpinner v-if="loading && !iconMode" />
  </div>
</template>

<style lang="scss" scoped>
/* Your styles here */
.pg-bg {
  background-color: #e6f5d0;
}
</style>
