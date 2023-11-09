<script lang="ts">
export default {
  name: "PledgeForm",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref, watch } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import H4 from "@/components/headings/H4.vue";
import Banners from "@/components/banners/Banners.vue";
import GenericProject from "@/utils/classes/GenericProject";
import Hr from "@/components/hr/Hr.vue";
import type {
  IDsgProject,
  IDmProject,
  IClubProject,
  IGenericProject,
} from "@/utils/interfaces/IProjects";
import { useActiveProjectStore } from "@/stores/ActiveProjectStore";
import { useSiteAssets } from "@/stores/SiteAssets";
import BaseInput from "@/components/form/BaseInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import {
  email,
  helpers,
  maxLength,
  numeric,
  required,
} from "@vuelidate/validators/dist/index.mjs";
import router from "@/router";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { PledgesApi } from "@/api/services/PledgesApi";
import { ApiClient } from "@/api/ApiClient";
import { CustomError } from "@/utils/classes/CustomError";
import type { IPledge } from "@/utils/interfaces/IPledge";
import Dinero from "dinero.js";

/* Data */
const pledgeApi = new PledgesApi(new ApiClient());
const { langTranslations, customPrintf } = useLanguage();
const { handleError, handleSuccess, handleValidationForm } = errorHandler();
const project: IDsgProject | IDmProject | IClubProject | IGenericProject =
  reactive(new GenericProject());
const { activeProject } = useActiveProjectStore();
const assetsStore = useSiteAssets();
const pledgeObject: IPledge = reactive({
  pledge_amount: "",
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  club_name: "",
  district_number: "",
  user_id: 0,
  project_id: 0,
});
const maxAmountThatCanBePledge = reactive({
  value: 0,
  displayValue: "",
});
const { isUserLoggedIn, loggedInUser } = useLoggedInUserStore();

/* Validations */
const rules = {
  pledge_amount: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      (value) => {
        if (value !== "") {
          return true;
        } else return false;
      }
    ),
    maxAmount: helpers.withMessage(
      langTranslations.value.pledgeProcess.maxLimitLabel,
      () => {
        // Convert string amount to number
        let amount = parseFloat(pledgeObject.pledge_amount as string);

        // Truncate any decimals
        amount = Math.trunc(amount);

        // Append '.00' to it
        const amountString = amount.toFixed(2);
        const amountInCents = Dinero({
          amount: parseFloat(amountString) * 100,
        });

        return amountInCents.getAmount() <= maxAmountThatCanBePledge.value;
      }
    ),
    minAmount: helpers.withMessage(
      langTranslations.value.pledgeProcess.minLimitLabel,
      () => {
        if (
          pledgeObject.pledge_amount !== "" ||
          (pledgeObject.pledge_amount as string) !== "0"
        ) {
          return true;
        } else return false;
      }
    ),
    numeric: helpers.withMessage(
      langTranslations.value.formErorrText.numeric,
      numeric
    ),
  },
  firstname: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.formErorrText.maxLength, "50"),
      maxLength(50)
    ),
  },
  lastname: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.formErorrText.maxLength, "50"),
      maxLength(50)
    ),
  },
  email: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    email: helpers.withMessage(
      langTranslations.value.formErorrText.emailFormat,
      email
    ),
  },
  phone: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.formErorrText.maxLength, "50"),
      maxLength(50)
    ),
  },
  club_name: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.formErorrText.maxLength, "50"),
      maxLength(50)
    ),
  },
  district_number: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.formErorrText.maxLength, "50"),
      maxLength(50)
    ),
  },
};
const v$ = useVuelidate(rules, pledgeObject);

/* Hooks */
onMounted(async () => {
  if (activeProject.project_id && activeProject.project_id !== 0) {
    Object.assign(project, activeProject);
  }
  if (isUserLoggedIn) {
    Object.assign(pledgeObject, {
      firstname: loggedInUser.firstname,
      lastname: loggedInUser.lastname,
      email: loggedInUser.email,
      phone: loggedInUser.phone,
      project_id: project.project_id,
      user_id: loggedInUser.user_id,
    });
  } else {
    Object.assign(pledgeObject, {
      project_id: project.project_id,
      user_id: 1,
    });
  }
  maxAmountThatCanBePledge.displayValue = maxAmountThatCanBePledgeFormated();
});

watch(
  () => pledgeObject.pledge_amount,
  (newValue, oldValue) => {
    // If the new value is not numeric, revert to the old value
    if ((newValue as string).includes(".")) {
      pledgeObject.pledge_amount = oldValue;
    }
  }
);

/* Methods */
const validateAndSubmit = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    return;
  }
  try {
    // Convert string amount to number
    let amount = parseFloat(pledgeObject.pledge_amount as string);

    // Truncate any decimals
    amount = Math.trunc(amount);

    // Append '.00' to it
    const amountString = amount.toFixed(2);

    // Convert it to cents using Dinero
    const amountInCents = Dinero({ amount: parseFloat(amountString) * 100 });
    // Update pledgeObject with the amount in cents
    const pledgeObjectCopy = { ...pledgeObject };
    pledgeObjectCopy.pledge_amount = amountInCents.getAmount();

    // Now send the updated pledgeObjectCopy to the backend
    const response = await pledgeApi.storePledge(pledgeObjectCopy);
    if (!response) {
      throw new CustomError(900, "Error", {
        en: "Please try again later",
        fr: "Veuillez reessayer plus tard",
      });
    }
    handleSuccess(langTranslations.value.toastSuccess, {
      path: "Home",
    });
  } catch (error) {
    handleError(error as CustomError, undefined, {
      path: "",
      goback: true,
    });
  }
};

const maxAmountThatCanBePledgeFormated = () => {
  // Step 1: Check if legacy amounts are floats and convert to cents if necessary
  let fundingGoalCents = project.funding_goal;
  let anticipatedFundingCents = project.anticipated_funding;

  if (Number.isInteger(fundingGoalCents) === false) {
    fundingGoalCents = Math.round(fundingGoalCents * 100); // convert to cents
  }

  if (Number.isInteger(anticipatedFundingCents) === false) {
    anticipatedFundingCents = Math.round(anticipatedFundingCents * 100); // convert to cents
  }

  // Step 2: Use Dinero for subtraction
  const fundingGoalDinero = Dinero({ amount: fundingGoalCents });
  const anticipatedFundingDinero = Dinero({ amount: anticipatedFundingCents });
  const differenceDinero = fundingGoalDinero.subtract(anticipatedFundingDinero);
  console.log(" Anticipated " + anticipatedFundingDinero.getAmount());
  console.log(" Goal " + fundingGoalDinero.getAmount());
  console.log(" Difference " + differenceDinero.getAmount());
  maxAmountThatCanBePledge.value = differenceDinero.getAmount();
  // Step 3: Convert to display-friendly USD format
  const differenceUSD = differenceDinero.toFormat("$0,0.00");
  console.log(" Difference USD " + differenceUSD);
  return differenceUSD;
};

const handleInput = (event: InputEvent) => {
  const target = event.target as HTMLInputElement;
  target.value = target.value.replace(/\D/g, "");
};

const redirect = () => {
  router.go(-1);
};
</script>

<template>
  <Banners :banner-text="langTranslations.projectLabels.pledgeLabel" />
  <form @submit.prevent class="fluid-container pt-8 p-2">
    <H4
      class="text-left py-8"
      :content="`${langTranslations.pledgeProcess.pledgeTodayLabel} - 
        ${project.project_name}
      `"
    />
    <div class="mb-4 text-sm text-gray-500">
      <!-- // TODO: Figuere this text out later -->
      <p class="mb-2">
        {{ langTranslations.pledgeProcess.pledgeFormInfoLabel }}
      </p>
      <p class="mb-2 text-gray-500">
        {{ langTranslations.pledgeProcess.pledgeFormFillFormLabel }}:
        <a
          :href="`mailto:${assetsStore.siteAssets.assets.contentManagement.myRotaryEmail}`"
          :title="langTranslations.sendEmailLabel"
          class="text-primary"
          >{{
            assetsStore.siteAssets.assets.contentManagement.myRotaryEmail || ""
          }}</a
        >
      </p>
    </div>
    <Hr />
    <div class="m-auto w-1/2">
      <H4 :content="langTranslations.pledgeProcess.donateHeaderLabel" />
      <h5 class="text-secondary font-bold">
        {{ langTranslations.pledgeProcess.maxPledgeLabel }}:{{
          " " + maxAmountThatCanBePledge.displayValue
        }}
      </h5>
    </div>
    <div class="flex justify-center items-center mt-16">
      <BaseInput
        v-model="pledgeObject.pledge_amount"
        :inputmode="'numeric'"
        :label="langTranslations.pledgeProcess.amountLabel"
        :type="'text'"
        :min="0"
        @input="handleInput"
      />
      <span class="pt-4 text-4xl font-semibold">.00</span>
    </div>
    <p
      v-if="v$.pledge_amount?.$errors[0]?.$message as string | undefined"
      id="error"
      class="mt-2 text-sm text-red-600 text-center"
    >
      <span class="font-medium">{{
        v$.pledge_amount?.$errors[0]?.$message as string | undefined
      }}</span>
    </p>
    <div class="form-block">
      <BaseInput
        v-model="pledgeObject.firstname"
        :label="langTranslations.userForm.firstNameLabel"
        :type="'text'"
        :errorMessage="v$.firstname?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="pledgeObject.lastname"
        :label="langTranslations.userForm.lastNameLabel"
        :type="'text'"
        :errorMessage="v$.lastname?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="pledgeObject.email"
        :label="langTranslations.email"
        :type="'email'"
        :errorMessage="v$.email?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="pledgeObject.phone"
        :label="langTranslations.phone"
        :type="'text'"
        :errorMessage="v$.phone?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="pledgeObject.district_number"
        :label="langTranslations.districtView.distictTabLabel"
        :type="'text'"
        :errorMessage="
          v$.district_number?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="pledgeObject.club_name"
        :label="langTranslations.clubLabel + ' ' + langTranslations.nameLabel"
        :type="'text'"
        :errorMessage="v$.club_name?.$errors[0]?.$message as string | undefined "
      />
    </div>
    <div class="button_row mt-4 flex justify-center gap-4">
      <RotaryButton
        :theme="'primary'"
        :label="langTranslations.submit"
        @click="
          () => {
            validateAndSubmit();
          }
        "
      />
      <RotaryButton
        :theme="'primary'"
        :label="langTranslations.cancelLabel"
        @click="redirect()"
      />
    </div>
    <!-- <span
      >-
      {{
        project.project_name ? project.project_name : project.project_name
      }}</span
    > -->
  </form>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
