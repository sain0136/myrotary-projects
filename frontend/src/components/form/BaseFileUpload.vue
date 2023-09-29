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
import type { CustomError } from "@/utils/classes/CustomError";
import { useLanguage } from "@/utils/languages/UseLanguage";

/* Data */
const { langTranslations } = useLanguage();

interface ValidationData {
  file: File | null;
}
const {
  apiCall,
  acceptedFileTypes,
  fileUploadLabelFormats,
  submitLabel,
  reqData,
} = defineProps<{
  apiCall: (data: uploadFileData) => Promise<any>;
  acceptedFileTypes?: string;
  fileUploadLabelFormats?: string;
  submitLabel: string;
  reqData: uploadFileData;
}>();
const validationData: ValidationData = reactive({
  file: null,
});
const validationRules = {
  file: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.noFilesUpload,
      required
    ),
  },
};
const v$ = useVuelidate(validationRules, validationData);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files[0]) {
    validationData.file = files[0];
  }
};

const submit = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;

  if (!v$.value.$error) {
    try {
      v$.value.$reset();
      const req: uploadFileData = {
        files: [validationData.file] as File[],
        databaseTarget: reqData.databaseTarget,
        storagePath: reqData.storagePath,
        fileTypes: reqData.fileTypes,
      };
      await apiCall(req);
      console.log("File uploaded");
    } catch (error) {
      console.error(error as CustomError);
    }
  }
};
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <input
      class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
      aria-describedby="file_input_help"
      id="file_input"
      type="file"
      @change="handleFileChange($event)"
      :accept="acceptedFileTypes"
    />
    <p v-if="v$.file.$error" class="text-red-500">
      {{ v$.file.$errors[0].$message }}
    </p>
    <p class="font-bold" id="file_input_help">
      {{ fileUploadLabelFormats }}
    </p>
    <div>
      <button class="bg-black text-white px-4 py-2 rounded" @click="submit()">
        {{ submitLabel }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* Your styles here */
</style>
