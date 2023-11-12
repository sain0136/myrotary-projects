<script lang="ts">
export default {
  name: "MatchingProjectForm",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import Dinero from "dinero.js";
import { ApiClient } from "@/api/ApiClient";
import { ProjectsApi } from "@/api/services/ProjectsApi";
import { CustomError } from "@/utils/classes/CustomError";
import ClubProject from "@/utils/classes/ClubProject";
import useVuelidate from "@vuelidate/core";
import {
  helpers,
  maxLength,
  minLength,
  numeric,
  required,
} from "@vuelidate/validators";
import BaseInput from "@/components/form/BaseInput.vue";
import BaseSelect from "@/components/form/BaseSelect.vue";
import BaseCheckBox from "@/components/form/BaseCheckBox.vue";
import Hr from "@/components/hr/Hr.vue";
import BaseTextarea from "@/components/form/BaseTextarea.vue";
import ResourceList from "@/utils/classes/ResourceList";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { useCurrencyFormatter } from "@/utils/composables/CurrencyFormatter";
import { grantType } from "@/utils/types/commonTypes";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import { useLoggedInDistrict } from "@/stores/LoggedInDistrict";
import ProjectUploads from "@/components/forms/tabs/ProjectUploads.vue";
import ClubProjectPdf from "@/components/forms/tabs/ClubProjectPdf.vue";
import { useActiveProjectStore } from "@/stores/ActiveProjectStore";
import AllPledgesTable from "@/components/forms/tabs/AllPledgesTable.vue";
import SocialShareButton from "@/components/forms/tabs/SocialShareButton.vue";
import ProjectAdminsForm from "@/components/forms/tabs/ProjectAdminsForm.vue";
import ProjectApproval from "@/components/forms/tabs/ProjectApproval.vue";
import H1 from "@/components/headings/H1.vue";

/* Data */
type formType = "normalView" | "readOnlyView";
const route = useRoute();
// required form data
const projectId =
  route.params.projectId !== "" ? Number(route.params.projectId) : null;
const formType = route.query.formType
  ? (route.query.formType as formType)
  : "normalView";
//
const { currencyFormatterFunding, convertCentsToFloat, convertFloatToCents } =
  useCurrencyFormatter();
const submitLabel: { [key: string]: string } = projectId
  ? {
      en: "Update",
      fr: "Modifier",
    }
  : {
      en: "Submit",
      fr: "Soumettre",
    };
const FUNDING_GOAL_LIMIT = 1000000000;
const projectsApi = new ProjectsApi(new ApiClient());
const { langTranslations, languagePref } = useLanguage();
const { handleError, handleSuccess } = errorHandler();
const tabs = ref([
  {
    name: "form",
    label: langTranslations.value.formLabel,
    hidden: false,
  },
  {
    name: "uploads",
    label: langTranslations.value.uploadFileLabel,
    hidden: !projectId ? true : false,
  },
  {
    name: "pdf",
    label: langTranslations.value.projectFormLabels.pdfLabel,
    hidden: !projectId ? true : false,
  },
  {
    name: "pledges",
    label: langTranslations.value.projectFormLabels.pledgesLabel,
    hidden: !projectId ? true : false,
  },
  {
    name: "share",
    label: langTranslations.value.projectFormLabels.shareLabel,
    hidden: !projectId ? true : false,
  },
  {
    name: "admins",
    label: langTranslations.value.projectFormLabels.adminsLabel,
    hidden: !projectId ? true : false,
  },
  {
    name: "approval",
    label: langTranslations.value.projectFormLabels.approvalLabel,
    hidden: !projectId ? true : false,
  },
]);
const project = reactive(new ClubProject());
const activeTab = ref("form");
// TODO
const minLengthMessage = {
  en: "Must be at least 100 characters",
  fr: "Doit contenir au moins 100 caractères",
};
const maxLengthMessage = {
  en: "Must be at most 1000 characters",
  fr: "Doit contenir au plus 1000 caractères",
};

/* Hooks */
onMounted(async () => {
  try {
    if (projectId) {
      await getProject();
    } else {
      try {
        project.grant_type = grantType.CLUBPROJECT;
        project.created_by = useLoggedInUserStore().loggedInUser.user_id;
        project.club_id = useLoggedInUserStore().loggedInUser.club_id;
        project.district_id =
          useLoggedInUserStore().loggedInUser.district_id ||
          useLoggedInDistrict().loggedInDistrict.district_id;
      } catch (error) {
        throw new CustomError(900, "Project Erorr", {
          en: langTranslations.value.projectFormLabels
            .projectGenericErrorMessage,
          fr: langTranslations.value.projectFormLabels
            .projectGenericErrorMessage,
        });
      }
    }
  } catch (error) {
    handleError(error as CustomError);
  }
});

/* Validations */
const rules = {
  project_name: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  project_description: {
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
  country: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  region: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  funding_goal: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxAmount: helpers.withMessage(
      langTranslations.value.pledgeProcess.maxLimitLabel,
      () => {
        // Convert string amount to number
        let amount = parseFloat(project.funding_goal.toString());

        // Truncate any decimals
        amount = Math.trunc(amount);

        // Append '.00' to it
        const amountString = amount.toFixed(2);
        const amountInCents = Dinero({
          amount: parseFloat(amountString) * 100,
        });
        console.log("amount" + amountInCents.getAmount());
        return amountInCents.getAmount() <= FUNDING_GOAL_LIMIT;
      }
    ),
    numeric: helpers.withMessage(
      langTranslations.value.formErorrText.numeric,
      numeric
    ),
  },
  anticipated_funding: {
    numeric: helpers.withMessage(
      langTranslations.value.formErorrText.numeric,
      numeric
    ),
    maxAmount: helpers.withMessage(
      langTranslations.value.pledgeProcess.maxLimitLabel,
      () => {
        // Convert string amount to number
        let amount = parseFloat(project.anticipated_funding.toString());

        // Truncate any decimals
        amount = Math.trunc(amount);

        // Append '.00' to it
        const amountString = amount.toFixed(2);
        const amountInCents = Dinero({
          amount: parseFloat(amountString) * 100,
        });
        console.log("amount anticipated" + amountInCents.getAmount());
        return amountInCents.getAmount() <= FUNDING_GOAL_LIMIT;
      }
    ),
    lowerThanFundingGoal: helpers.withMessage(
      langTranslations.value.formErorrText.lowerThanFundingGoal,
      () => {
        let anticipatedAmount = parseFloat(
          project.anticipated_funding.toString()
        );
        let fundingGoal = parseFloat(project.funding_goal.toString());
        anticipatedAmount = Math.trunc(anticipatedAmount);
        fundingGoal = Math.trunc(fundingGoal);
        const anticipatedAmountString = anticipatedAmount.toFixed(2);
        const fundingGoalString = fundingGoal.toFixed(2);
        const anticipatedAmountInCents = Dinero({
          amount: parseFloat(anticipatedAmountString) * 100,
        });
        const fundingGoalInCents = Dinero({
          amount: parseFloat(fundingGoalString) * 100,
        });
        return anticipatedAmountInCents.lessThanOrEqual(fundingGoalInCents);
      }
    ),
    cantBelowerThanPledgesTotal: helpers.withMessage(
      langTranslations.value.formErorrText.lowerThanPledgesTotal,
      () => {
        let anticipatedAmount = parseFloat(
          project.anticipated_funding.toString()
        );
        let pledgeTotal = parseFloat(project.total_pledges.toString());
        anticipatedAmount = Math.trunc(anticipatedAmount);
        pledgeTotal = Math.trunc(pledgeTotal);
        const anticipatedAmountString = anticipatedAmount.toFixed(2);
        const pledgeTotalString = pledgeTotal.toFixed(2);
        const anticipatedAmountInCents = Dinero({
          amount: parseFloat(anticipatedAmountString) * 100,
        });
        const pledgeTotalInCents = Dinero({
          amount: parseFloat(pledgeTotalString) * 100,
        });
        return anticipatedAmountInCents.greaterThanOrEqual(pledgeTotalInCents);
      }
    ),
  },
  start_date: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  completion_date: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    dateAfterStartDate: helpers.withMessage(
      langTranslations.value.formErorrText.startAfterStartDate,
      () => {
        const projectStartDate = new Date(project.start_date);
        const completionDate = new Date(project.completion_date);
        return projectStartDate < completionDate;
      }
    ),
  },
  area_focus: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.areaOfFocus,
      () => {
        const areaFocuseValues = Object.values(project.area_focus);
        return areaFocuseValues.includes(true);
      }
    ),
  },
};
const v$ = useVuelidate(rules, project);

/* Methods */
const getProject = async () => {
  if (projectId) {
    const response = await projectsApi.getProject(projectId);
    response.funding_goal = convertCentsToFloat(response.funding_goal);
    response.anticipated_funding = convertCentsToFloat(
      response.anticipated_funding
    );
    response.total_pledges = convertCentsToFloat(response.total_pledges);
    Object.assign(project, response);
    useActiveProjectStore().setActiveProject(project);
  }
};
const validateAndSubmit = async () => {
  try {
    const isFormCorrect = await v$.value.$validate();
    if (!isFormCorrect) {
      return;
    }
    project.funding_goal = convertFloatToCents(project.funding_goal);
    project.anticipated_funding = convertFloatToCents(
      project.anticipated_funding
    );
    if (projectId) {
      await projectsApi.updateClubProject(project);
      handleSuccess(langTranslations.value.toastSuccess);
    } else {
      const response = await projectsApi.createClubProject(project);
      if (response) {
        handleSuccess(langTranslations.value.toastSuccess);
      } else {
        redirect();
      }
    }
    redirect();
  } catch (error) {
    handleError(error as CustomError);
  }
};

const redirect = () => {
  switch (formType) {
    case "readOnlyView": {
      router.go(-1);
      break;
    }
    case "normalView": {
      router.push({ name: "MyProjects" });
      break;
    }
  }
};

const setActiveTab = (tabName: string) => {
  activeTab.value = tabName;
};
</script>

<template>
  <div>
    <H1
      class="text-center my-4"
      :content="langTranslations.projectFormLabels.dmProjectsHeader"
    />
    <ul
      class="tabs flex flex-wrap text-sm font-medium text-center justify-center text-gray-500 border-b border-gray-200"
    >
      <li class="mr-2" v-for="tab in tabs" :key="tab.name">
        <a
          @click="setActiveTab(tab.name)"
          class="inline-block cursor-pointer rounded-t-lg p-4 text-2xl hover:bg-gray-300 hover:text-gray-600"
          :class="{
            'hidden mt-0': tab.hidden,
            'activebg-gray-100 text-nearBlack': tab.name === activeTab,
          }"
        >
          {{ tab.label }}
        </a>
      </li>
    </ul>
    <form
      @submit.prevent
      class="fluid-container pt-8 p-2"
      v-if="activeTab === 'form'"
    >
      <div class="form-block">
        <BaseInput
          v-model="project.project_name"
          :label="langTranslations.projectFormLabels.projectNameLabel"
          :type="'text'"
          :errorMessage="v$.project_name.$errors[0]?.$message as string | undefined"
        />
      </div>
      <div class="textarea-block">
        <BaseTextarea
          v-model="project.project_description"
          :rows="7"
          :label="langTranslations.desciptionLabel"
          :errorMessage="v$.project_description?.$errors[0]?.$message as string | undefined "
        />
      </div>
      <div class="form-block">
        <BaseSelect
          v-model="project.country"
          :label="langTranslations.countryLabel"
          :options="ResourceList.countryList"
          :errorMessage="v$.country?.$errors[0]?.$message as string | undefined "
        />
        <BaseSelect
          v-model="project.region"
          :label="langTranslations.landingPage.regionLabel"
          :options="ResourceList.regionList"
          :errorMessage="v$.region?.$errors[0]?.$message as string | undefined "
        />
        <BaseInput
          v-model="project.funding_goal"
          :label="langTranslations.projectFormLabels.fundingGoalLabel"
          :type="'number'"
          :inputmode="'numeric'"
          :min="0"
          :errorMessage="v$.funding_goal?.$errors[0]?.$message as string | undefined"
        />
        <BaseInput
          v-model="project.anticipated_funding"
          :label="langTranslations.projectFormLabels.anticipatedAmountLabel"
          :type="'number'"
          :inputmode="'numeric'"
          :min="0"
          :errorMessage="v$.anticipated_funding?.$errors[0]?.$message as string | undefined"
        />
        <BaseInput
          v-model="project.start_date"
          :label="langTranslations.projectFormLabels.startDateLabel"
          :type="'date'"
          :errorMessage="v$.start_date?.$errors[0]?.$message as string | undefined "
        />
        <BaseInput
          v-model="project.completion_date"
          :label="langTranslations.projectFormLabels.completionDateLabel"
          :type="'date'"
          :errorMessage="v$.completion_date?.$errors[0]?.$message as string | undefined "
        />
      </div>
      <div class="area-of-focus-section form-block">
        <div class="flex">
          <img
            class="w-2/12"
            :src="'/area-focus/' + ResourceList.areaFocusImages[0]"
            alt=""
          />
          <BaseCheckBox
            v-model="project.area_focus.Peace_Conflict_Prevention"
            :label="Object.keys(project.area_focus)[0].replace(/_/g, ' ')"
            class="mb-0"
          />
        </div>
        <div class="flex">
          <img
            class="w-2/12"
            :src="'/area-focus/' + ResourceList.areaFocusImages[1]"
            alt=""
          />
          <BaseCheckBox
            v-model="project.area_focus.Disease_Prevention_And_Treatment"
            :label="Object.keys(project.area_focus)[1].replace(/_/g, ' ')"
            class="mb-0"
          />
        </div>
        <div class="flex">
          <img
            class="w-2/12"
            :src="'/area-focus/' + ResourceList.areaFocusImages[2]"
            alt=""
          />
          <BaseCheckBox
            v-model="project.area_focus.Water_And_Sanitation"
            :label="Object.keys(project.area_focus)[2].replace(/_/g, ' ')"
            class="mb-0"
          />
        </div>
        <div class="flex">
          <img
            class="w-2/12"
            :src="'/area-focus/' + ResourceList.areaFocusImages[3]"
            alt=""
          />
          <BaseCheckBox
            v-model="project.area_focus.Maternal_And_Child_Health"
            :label="Object.keys(project.area_focus)[3].replace(/_/g, ' ')"
            class="mb-0"
          />
        </div>
        <div class="flex">
          <img
            class="w-2/12"
            :src="'/area-focus/' + ResourceList.areaFocusImages[4]"
            alt=""
          />
          <BaseCheckBox
            v-model="project.area_focus.Basic_Education_And_Literacy"
            :label="Object.keys(project.area_focus)[4].replace(/_/g, ' ')"
            class="mb-0"
          />
        </div>
        <div class="flex">
          <img
            class="w-2/12"
            :src="'/area-focus/' + ResourceList.areaFocusImages[5]"
            alt=""
          />
          <BaseCheckBox
            v-model="project.area_focus.Economic_And_Community_Development"
            :label="Object.keys(project.area_focus)[5].replace(/_/g, ' ')"
            class="mb-0"
          />
        </div>
        <div class="flex">
          <img
            class="w-2/12"
            :src="'/area-focus/' + ResourceList.areaFocusImages[6]"
            alt=""
          />
          <BaseCheckBox
            v-model="project.area_focus.Environment"
            :label="Object.keys(project.area_focus)[6].replace(/_/g, ' ')"
            class="mb-0"
          />
        </div>
      </div>
      <p
        v-if="v$.area_focus?.$errors[0]?.$message as string | undefined"
        id="error"
        class="my-4 text-sm text-red-600 text-center"
      >
        <span class="font-medium">{{
          v$.area_focus?.$errors[0]?.$message as string | undefined
        }}</span>
      </p>
      <div class="button_row mt-8 flex justify-center gap-4">
        <RotaryButton
          :theme="'primary'"
          :label="submitLabel[languagePref]"
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
    </form>
    <div v-if="activeTab === 'uploads'">
      <ProjectUploads :project-type="'club'" />
    </div>
    <div v-if="activeTab === 'pdf'"><ClubProjectPdf /></div>
    <div v-if="activeTab === 'pledges'">
      <AllPledgesTable />
    </div>
    <div v-if="activeTab === 'share'">
      <SocialShareButton />
    </div>
    <div v-if="activeTab === 'admins'">
      <ProjectAdminsForm />
    </div>
    <div v-if="activeTab === 'approval'">
      <ProjectApproval />
    </div>
    <div class="flex justify-center">
      <RotaryButton
        v-if="activeTab !== 'form'"
        :theme="'primary'"
        :label="langTranslations.cancelLabel"
        @click="redirect()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
