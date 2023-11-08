<script lang="ts">
export default {
  name: "DistrictForm",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { handleError, onMounted, reactive, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import District from "@/utils/classes/District";
import { useVuelidate } from "@vuelidate/core";
import router from "@/router";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import H3 from "@/components/headings/H3.vue";
import H2 from "@/components/headings/H2.vue";
import Hr from "@/components/hr/Hr.vue";
import BaseInput from "@/components/form/BaseInput.vue";
import { Icon } from "@iconify/vue";
import BaseTextarea from "@/components/form/BaseTextarea.vue";
import {
  email,
  helpers,
  maxLength,
  minLength,
  required,
} from "@vuelidate/validators/dist/index.mjs";
import { DistrictApi } from "@/api/services/DistrictsApi";
import { ApiClient } from "@/api/ApiClient";
import type { CustomError } from "@/utils/classes/CustomError";
import { useRoute } from "vue-router";

/* Data */
type formType = "districtAdmin";
const districtApi = new DistrictApi(new ApiClient());
// required form data
const route = useRoute();
const isEdit = router.currentRoute.value.params.districtId ? true : false;
const formType = route.query.formType
  ? (route.query.formType as formType)
  : null;
const districtId = isEdit
  ? parseInt(router.currentRoute.value.params.districtId as string)
  : null;
//
const { handleError, handleSuccess, handleValidationForm } = errorHandler();
const district = reactive(new District());
const { langTranslations, languagePref } = useLanguage();
const sourceList = [
  "District Club Contribution",
  "Non-District Club Contribution",
  "Co-operating Organization Contribution",
  "Other sources",
];
const duplicateErrorMsg = ref({
  show: false,
  en: "",
  fr: "",
});
const minLengthMessage = {
  en: "Must be at least 100 characters",
  fr: "Doit contenir au moins 100 caractères",
};
const maxLengthMessage = {
  en: "Must be at most 1000 characters",
  fr: "Doit contenir au plus 1000 caractères",
};
const submitLabel = isEdit
  ? {
      en: "Update",
      fr: "Modifier",
    }
  : {
      en: "Submit",
      fr: "Soumettre",
    };

/* Validations */
const rules = {
  district_name: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  district_president: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  district_email: {
    emailFormat: helpers.withMessage(
      langTranslations.value.formErorrText.emailFormat,
      email
    ),
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  district_description: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      maxLengthMessage[languagePref.value],
      maxLength(1000)
    ),
    minLenght: helpers.withMessage(
      minLengthMessage[languagePref.value],
      minLength(100)
    ),
  },
  district_details: {
    dates: {
      grant_submission_closedate: { required },
      grant_submission_startdate: { required },
    },
    ddfCapes: {
      dsgCap: {
        greaterThanOne: helpers.withMessage(
          langTranslations.value.districtForm.reqMinLength,
          () => {
            return district.district_details.ddfCapes.dsgCap >= 1;
          }
        ),
      },
      dsgFraction: {
        greaterThanOne: helpers.withMessage(
          langTranslations.value.districtForm.reqMinLength,
          () => {
            return district.district_details.ddfCapes.dsgFraction > 0;
          }
        ),
        lessThanOne: helpers.withMessage(
          langTranslations.value.districtForm.numbMustBeFraction,
          () => {
            return district.district_details.ddfCapes.dsgFraction <= 1;
          }
        ),
      },
      dmCap: {
        greaterThanOne: helpers.withMessage(
          langTranslations.value.districtForm.reqMinLength,
          () => {
            return district.district_details.ddfCapes.dmCap >= 1;
          }
        ),
      },
      dmFraction: {
        greaterThanOne: helpers.withMessage(
          langTranslations.value.districtForm.reqMinLength,
          () => {
            return district.district_details.ddfCapes.dmFraction > 0;
          }
        ),
        lessThanOne: helpers.withMessage(
          langTranslations.value.districtForm.numbMustBeFraction,
          () => {
            return district.district_details.ddfCapes.dmFraction <= 1;
          }
        ),
      },
    },
  },
};
const v$ = useVuelidate(rules, district);

/* Hooks */
onMounted(async () => {
  if (isEdit && districtId) {
    try {
      const response = await districtApi.getById(districtId);
      Object.assign(district, response);
    } catch (error) {
      handleError(error as CustomError);
    }
  }
});

/* Methods */
const addOrDeleteSourceToDdfCalculation = (add: boolean, source?: string) => {
  if (add && source) {
    let duplicate = district.district_details.ddfCalculation.includes(source);
    if (duplicate) {
      duplicateErrorMsg.value = {
        show: true,
        en: "Source already exists",
        fr: "La source existe déjà",
      };
      setTimeout(() => {
        duplicateErrorMsg.value = {
          show: false,
          en: "",
          fr: "",
        };
      }, 2000);
      return;
    }
    district.district_details.ddfCalculation.push(source);
  } else if (!add) {
    district.district_details.ddfCalculation.pop();
  }
};
const validateAndSubmit = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    handleValidationForm();
    return;
  }
  try {
    //TODO Should i udate store data?
    if (isEdit) {
      await districtApi.updateDistrict(district);
    } else {
      await districtApi.createDistrict(district);
    }
    handleSuccess(langTranslations.value.toastSuccess);
    redirect();
  } catch (error) {
    handleError(error as CustomError);
  }
};

const redirect = (cancelPress?: boolean) => {
  if (formType === "districtAdmin") {
    router.go(0);
  } else {
    router.push({ name: "District", query: { tabNameProp: "district" } });
  }
  if (cancelPress) {
    router.push({ name: "District" });
  }
};
</script>

<template>
  <form @submit.prevent class="">
    <H2 class="text-center" :content="langTranslations.districtFormHeader" />
    <Hr />
    <div class="form-block">
      <BaseInput
        v-model="district.district_name"
        :label="langTranslations.districtForm.districtNameLabel"
        :type="'text'"
        :errorMessage="v$.district_name?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="district.district_president"
        :label="langTranslations.districtForm.govLabel"
        :type="'text'"
        :errorMessage="v$.district_president?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="district.district_email"
        :label="langTranslations.email"
        :type="'email'"
        :errorMessage="v$.district_email?.$errors[0]?.$message as string | undefined "
      />
    </div>
    <div class="textarea-block">
      <BaseTextarea
        v-model="district.district_description"
        :rows="7"
        :label="langTranslations.desciptionLabel"
        :errorMessage="v$.district_description?.$errors[0]?.$message as string | undefined "
      />
    </div>
    <H3 class="text-center" :content="langTranslations.settingsLabel" />
    <div class="form-block">
      <BaseInput
        v-model="district.district_details.dates.grant_submission_startdate"
        :label="langTranslations.districtForm.submissionStartDateLabel"
        :type="'date'"
        :errorMessage="v$.district_details.dates.grant_submission_startdate?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="district.district_details.dates.grant_submission_closedate"
        :label="langTranslations.districtForm.submissionEndDateLabel"
        :type="'date'"
        :errorMessage="v$.district_details.dates.grant_submission_closedate?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="district.district_details.ddfCapes.dsgCap"
        :label="langTranslations.districtForm.dsgCapLabel"
        :type="'number'"
        :errorMessage="v$.district_details.ddfCapes.dsgCap?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="district.district_details.ddfCapes.dsgFraction"
        :label="langTranslations.districtForm.fractionRateLabel"
        :type="'number'"
        :step="0.01"
        :errorMessage="v$.district_details.ddfCapes.dsgFraction?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="district.district_details.ddfCapes.dmCap"
        :label="langTranslations.districtForm.dmCapLabel"
        :type="'number'"
        :errorMessage="v$.district_details.ddfCapes.dmCap?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="district.district_details.ddfCapes.dmFraction"
        :label="langTranslations.districtForm.fractionRateLabel"
        :type="'number'"
        :step="0.01"
        :errorMessage="v$.district_details.ddfCapes.dmFraction?.$errors[0]?.$message as string | undefined "
      />
    </div>
    <H3
      class="text-center"
      :content="langTranslations.districtForm.fundingSourcesCalcLabel"
    />
    <div
      class="source-setting relative overflow-x-auto shadow-md sm:rounded-lg"
    >
      <table class="w-full text-left text-sm text-nearWhite">
        <thead
          class="text-s h-1/3 bg-primaryNearBlack uppercase text-primary-white"
        >
          <th scope="col" class="px-6 py-3">
            {{ langTranslations.sourceLabel }}
          </th>
          <th scope="col" class="px-6 py-3">{{ langTranslations.addLabel }}</th>
        </thead>
        <tr
          class="border-b bg-white"
          v-for="source in sourceList"
          :key="source"
        >
          <td
            scope="row"
            class="whitespace-nowrap px-6 py-4 font-medium text-nearBlack"
          >
            {{ source }}
          </td>
          <td class="mt-3 flex justify-center">
            <button
              class="font-bold text-lg lg:text-xl text-primaryNearBlack hover:text-primaryHover hover:underline"
              :title="
                langTranslations.addLabel + ' ' + langTranslations.sourceLabel
              "
              @click="addOrDeleteSourceToDdfCalculation(true, source)"
            >
              <Icon icon="tabler:plus" />
            </button>
          </td>
        </tr>
      </table>
    </div>
    <div class="flex flex-col gap-8 justify-center items-center">
      <div class="mt-4 flex flex-col items-center">
        <RotaryButton
          :theme="'black'"
          :label="
            langTranslations.deleteLabel + ' ' + langTranslations.sourceLabel
          "
          @click="addOrDeleteSourceToDdfCalculation(false)"
        />
      </div>
      <H3
        class="text-center"
        :content="langTranslations.districtForm.fundingListText"
      />
      <span v-if="duplicateErrorMsg.show" class="text-red-600">{{
        duplicateErrorMsg[languagePref]
      }}</span>
      <ol start="1" class="mb-8 flex flex-col items-center font-bold text-xl">
        <li
          v-for="(label, index) in district.district_details.ddfCalculation"
          :key="(label as string)"
        >
          {{ index + 1 + ". " + label }}
        </li>
      </ol>
      <div class="button_row mt-4 flex justify-center gap-4">
        <RotaryButton
          :theme="'primary'"
          :label="submitLabel[languagePref]"
          @click="validateAndSubmit()"
        />
        <RotaryButton
          :theme="'primary'"
          :label="langTranslations.cancelLabel"
          @click="redirect(true)"
          v-if="formType !== 'districtAdmin'"
        />
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
