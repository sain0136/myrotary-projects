<script lang="ts">
export default {
  name: "LogoUploadForm",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { UploadsApi } from "@/api/services/UploadsApi";
import { ApiClient } from "@/api/ApiClient";
import type { uploadFileData } from "@/utils/types/commonTypes";
import type { CustomError } from "@/utils/classes/CustomError";

/* Data */
const { handleError, handleSuccess } = errorHandler();

const { langTranslations } = useLanguage();
interface ValidationData {
  image: File | File[] | null;
}
const validationData: ValidationData = reactive({
  image: null,
});
const validationRules = {
  image: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.noFilesUpload,
      required
    ),
  },
};
const uploadsApi = new UploadsApi(new ApiClient());
const v$ = useVuelidate(validationRules, validationData);
/* Hooks */
onMounted(async () => {});

/* Methods */
const handleFileChange = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files || !files[0]) return;
  let imageFile = files[0] as any;
  imageFile = files[0] as any;
  validationData.image = imageFile;
};

const submit = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  if (!v$.value.$error) {
    try {
      v$.value.$reset();
      const req: uploadFileData = {
        files: [validationData.image] as File[],
        databaseTarget: "assets",
        storagePath: "./siteadmin",
        fileTypes: "main-logo",
      };
      const response = await uploadsApi.uploadFile(req);
      console.log(response);
      validationData.image = null;
      const fileInput = document.getElementById(
        "file_input"
      ) as HTMLInputElement;
      fileInput.value = "";
      handleSuccess(langTranslations.value.toastSuccess);
    } catch (error) {
      handleError(error as CustomError);
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
      accept="image/png, image/jpeg, image/gif"
    />
    <p v-if="v$.image.$error" class="text-red-500">
      {{ v$.image.$errors[0].$message }}
    </p>
    <p class="font-bold" id="file_input_help">
      {{ langTranslations.fileUploadLabelFormats }}
    </p>
    <div>
      <RotaryButton
        :label="langTranslations.submit"
        :theme="'black'"
        @click="submit()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
