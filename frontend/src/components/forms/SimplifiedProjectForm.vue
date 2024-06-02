<script lang="ts">
export default {
  name: "SimplifiedProjectForm",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import Dinero from "dinero.js";
import { ApiClient } from "@/api/ApiClient";
import { ProjectsApi } from "@/api/services/ProjectsApi";
import { CustomErrors } from "@/utils/classes/CustomErrors";
import useVuelidate from "@vuelidate/core";
import {
  email,
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
import Banners from "@/components/banners/Banners.vue";
import H3 from "@/components/headings/H3.vue";
import H4 from "@/components/headings/H4.vue";
import DistrictSimplifiedProject from "@/utils/classes/DistrictSimplifiedProject";
import { Icon } from "@iconify/vue";
import type { IFundingSource } from "@/utils/interfaces/IProjects";
import ErrorValidation from "@/components/forms/ErrorValidation.vue";
import { hideAprovalTab, projectDisabledStatus } from "@/utils/utils";
import { type ProjectStatus } from "@/utils/types/commonTypes";
import { processAreaOfFocus } from "@/utils/utils";
import ProjectOverride from "@/components/forms/components/ProjectOverride.vue";
import { useLoggedInClub } from "@/stores/LoggedInClub";
import { districtRoles } from "@/utils/types/commonTypes";

/* Data */
const showModal = ref({
  show: false,
  chosenIndex: 0,
  budget: false,
  funding: false,
});
const viewerMode = ref(false);
const disabledMode = ref(false);
type formType = "normalView" | "readOnlyView";
const route = useRoute();
// required form data
const projectId =
  route.params.projectId !== "" ? Number(route.params.projectId) : null;
const formType = route.query.formType
  ? (route.query.formType as formType)
  : "normalView";
//
const { currencyFormatterFunding, convertFloatToCents } =
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
const budgetItemName = ref("");
const budgetItemCost = ref("");
const projectsApi = new ProjectsApi(new ApiClient());
const { langTranslations, languagePref, customPrintf } = useLanguage();
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
    hidden: hideAprovalTab(projectId),
  },
]);

const project = reactive(new DistrictSimplifiedProject());
const activeTab = ref(
  projectId && formType !== "readOnlyView"
    ? sessionStorage.getItem("projectsLastActiveTab")
    : "form"
);
// TODO

const fundingSources = ref<IFundingSource>({
  sourceName: "",
  typeOfFunding: "",
  amount: 0,
} as IFundingSource);
const addFundingSource = [
  "District Designated Funds Request (DDF)",
  "District Club Contribution",
  "Non-District Club Contribution",
  "Co-operating Organization Contribution",
  "Other sources",
];
const simplifiedGrantRequestLimitAsDinero = ref(Dinero({ amount: 0 }));
const fundingGoalErrors = ref({
  messages: "",
  error: false,
});
const anticipatedFundingErrors = ref({
  messages: "",
  error: false,
});
const originalAmountofAnitcipated = ref(Dinero({ amount: 0 }));

/* Hooks */
onMounted(async () => {
  try {
    if (formType === "readOnlyView") {
      disabledMode.value = true;
      viewerMode.value = true;
    }
    if (projectId) {
      await getProject();
    } else {
      try {
        project.grant_type = grantType.DISTRICTSIMPLIFIEDPROJECT;
        project.created_by = useLoggedInUserStore().loggedInUser.user_id;
        project.club_id = useLoggedInUserStore().loggedInUser.club_id;
        project.district_id =
          useLoggedInUserStore().loggedInUser.district_id ||
          useLoggedInDistrict().loggedInDistrict.district_id ||
          useLoggedInClub().loggedInClub.district_id;
        originalAmountofAnitcipated.value = Dinero({
          amount: project.anticipated_funding + project.total_pledges,
        });
      } catch (error) {
        throw new CustomErrors(900, "Project Erorr", {
          en: langTranslations.value.projectFormLabels
            .projectGenericErrorMessage,
          fr: langTranslations.value.projectFormLabels
            .projectGenericErrorMessage,
        });
      }
    }
  } catch (error) {
    handleError(error as CustomErrors);
  }
});

watch(
  () => project.funding_goal,
  () => {
    const anticipatedAmount = Dinero({
      amount: project.anticipated_funding,
    });
    const fundingGoal = Dinero({
      amount: project.funding_goal,
    });
    if (anticipatedAmount.lessThanOrEqual(fundingGoal)) {
      anticipatedFundingErrors.value.error = false;
      return;
    }
    if (anticipatedAmount.greaterThan(fundingGoal)) {
      anticipatedFundingErrors.value.messages =
        langTranslations.value.formErorrText.lowerThanFundingGoal;
      anticipatedFundingErrors.value.error = true;
      return;
    }
    if (
      Dinero({
        amount: project.funding_goal,
      }).greaterThan(
        Dinero({
          amount: FUNDING_GOAL_LIMIT,
        })
      )
    ) {
      fundingGoalErrors.value.messages =
        langTranslations.value.pledgeProcess.maxLimitLabel;
      fundingGoalErrors.value.error = true;
      return;
    }
    fundingGoalErrors.value.error = false;
  }
);

watch(
  () => project.anticipated_funding,
  () => {
    const anticipatedAmount = Dinero({
      amount: project.anticipated_funding,
    });
    const fundingGoal = Dinero({
      amount: project.funding_goal,
    });
    const pledgesAmount = Dinero({
      amount: project.total_pledges,
    });
    const combinedAmount = anticipatedAmount.add(pledgesAmount);
    if (anticipatedAmount.greaterThan(fundingGoal)) {
      anticipatedFundingErrors.value.messages =
        langTranslations.value.formErorrText.lowerThanFundingGoal;
      anticipatedFundingErrors.value.error = true;
      return;
    }
    if (anticipatedAmount.lessThan(Dinero({ amount: project.total_pledges }))) {
      anticipatedFundingErrors.value.messages =
        langTranslations.value.formErorrText.lowerThanPledgesTotal;
      anticipatedFundingErrors.value.error = true;
      return;
    }
    anticipatedFundingErrors.value.error = false;
  }
);

/* Validations */
const rules = {
  project_name: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "50"),
      maxLength(50)
    ),
  },
  project_description: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "3000"),
      maxLength(3000)
    ),
    minLenght: helpers.withMessage(
      customPrintf(langTranslations.value.minLengthMessage, "100"),
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
        return project.anticipated_funding <= FUNDING_GOAL_LIMIT;
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
  extra_descriptions: {
    benefit_community_description: {
      required: helpers.withMessage(
        langTranslations.value.formErorrText.required,
        required
      ),
      maxLength: helpers.withMessage(
        customPrintf(langTranslations.value.maxLengthMessage, "3000"),
        maxLength(3000)
      ),
      minLenght: helpers.withMessage(
        customPrintf(langTranslations.value.minLengthMessage, "150"),
        minLength(150)
      ),
    },
    non_financial_participation: {
      equired: helpers.withMessage(
        langTranslations.value.formErorrText.required,
        required
      ),
      maxLength: helpers.withMessage(
        customPrintf(langTranslations.value.maxLengthMessage, "3000"),
        maxLength(3000)
      ),
      minLenght: helpers.withMessage(
        customPrintf(langTranslations.value.minLengthMessage, "150"),
        minLength(150)
      ),
    },
    primary_contact: {
      address: { required },
      email: { required, email },
      name: { required },
      phone: { required },
    },
  },
  district_simplified_grant_request: {
    validateRequest: helpers.withMessage(
      "Maximum amount exceeded for District Simplified Grant Request",
      () => {
        const grantRequestAsDinero = Dinero({
          amount: project.district_simplified_grant_request,
        });
        if (
          grantRequestAsDinero.greaterThan(
            simplifiedGrantRequestLimitAsDinero.value
          )
        ) {
          return false;
        } else {
          return true;
        }
      }
    ),
  },
};

const v$ = useVuelidate(rules, project);

/*Computed*/
const formattedFundingGoal = computed(() => {
  return currencyFormatterFunding(project.funding_goal);
});

/**
 * Computed property that returns the simplified grant request limit.
 * @returns {number} The simplified grant request limit.
 */
const simplifiedGrantRequestLimit = computed(() => {
  const cap = Dinero({
    amount: convertFloatToCents(
      useLoggedInDistrict().loggedInDistrict.district_details.ddfCapes.dsgCap
    ),
  });
  const fraction =
    useLoggedInDistrict().loggedInDistrict.district_details.ddfCapes
      .dsgFraction;

  let total = Dinero({
    amount: 0,
  });
  useLoggedInDistrict().loggedInDistrict.district_details.ddfCalculation.forEach(
    (sourceType) => {
      project.extra_descriptions.fundingSourceArray.forEach(
        (el: { sourceName: string; amount: number }) => {
          if (el.sourceName === sourceType) {
            total.add(
              Dinero({
                amount: el.amount,
              })
            );
          }
        }
      );
    }
  );
  const limit = total.greaterThan(cap)
    ? currencyFormatterFunding(total.multiply(fraction).getAmount())
    : currencyFormatterFunding(cap.getAmount());
  simplifiedGrantRequestLimitAsDinero.value = total.greaterThan(cap)
    ? total.multiply(fraction)
    : cap;
  return limit;
});

const sumOfAnticipatedFunding = computed(() => {
  let fundingSourceSum = Dinero({
    amount: 0,
  });
  project.extra_descriptions.fundingSourceArray.forEach(
    (el: { amount: number }) => {
      fundingSourceSum.add(
        Dinero({
          amount: el.amount,
        })
      );
      fundingSourceSum = fundingSourceSum.add(
        Dinero({
          amount: el.amount,
        })
      );
    }
  );
  const combinedSum = fundingSourceSum.add(
    Dinero({
      amount: project.total_pledges,
    })
  );
  return currencyFormatterFunding(combinedSum.getAmount());
});

/* Methods */
const deleteFromFundsArray = (index: number) => {
  try {
    const fundingSource = project.extra_descriptions.fundingSourceArray[index];
    const dinaroFunds = Dinero({
      amount: fundingSource.amount,
    });
    let newAmount = Dinero({ amount: 0 });
    switch (fundingSource.sourceName) {
      case "District Club Contribution":
        newAmount = Dinero({
          amount: project.intial_sponsor_club_contribution,
        }).subtract(dinaroFunds);
        project.intial_sponsor_club_contribution = newAmount.getAmount();
        break;

      case "Non-District Club Contribution":
        newAmount = Dinero({
          amount: project.extra_descriptions.other_club_contribution,
        }).subtract(dinaroFunds);
        project.extra_descriptions.other_club_contribution =
          newAmount.getAmount();
        break;

      case "District Designated Funds Request (DDF)":
        newAmount = Dinero({
          amount: project.district_simplified_grant_request,
        }).subtract(dinaroFunds);
        project.district_simplified_grant_request = newAmount.getAmount();
        break;

      case "Co-operating Organization Contribution":
        newAmount = Dinero({
          amount: project.co_operating_organisation_contribution,
        }).subtract(dinaroFunds);
        project.co_operating_organisation_contribution = newAmount.getAmount();
        break;

      case "Other sources":
        newAmount = Dinero({
          amount: project.extra_descriptions.other_sources,
        }).subtract(dinaroFunds);
        project.extra_descriptions.other_sources = newAmount.getAmount();
        break;
      default:
        break;
    }
    project.anticipated_funding -= dinaroFunds.getAmount();
    project.extra_descriptions.fundingSourceArray.splice(index, 1);
  } catch (error) {
    handleError(error as CustomErrors);
  }
};

const fundingTableErrors = () => {
  if (fundingSources.value.amount < 0.01) {
    throw new CustomErrors(
      "Amount must be greater than 0",
      "SimplifiedProjectForm",
      {
        en: "Amount must be greater than 0",
        fr: "Le montant doit être supérieur à 0",
      }
    );
  }
  if (fundingSources.value.sourceName === "") {
    throw new CustomErrors(
      "Please select a funding source",
      "SimplifiedProjectForm",
      {
        en: "Please select a funding source",
        fr: "Veuillez sélectionner une source de financement",
      }
    );
  }
  if (!fundingSources.value.amount) {
    throw new CustomErrors("Please enter an amount", "SimplifiedProjectForm", {
      en: "Please enter an amount",
      fr: "Veuillez entrer un montant",
    });
  }
};

const addToFundsArray = () => {
  try {
    fundingTableErrors();
    const formattedAmountInCents = convertFloatToCents(
      fundingSources.value.amount
    );
    const dinaroFunds = Dinero({
      amount: formattedAmountInCents,
    });

    let newAmount = Dinero({ amount: 0 });
    switch (fundingSources.value.sourceName) {
      case "District Club Contribution":
        newAmount = Dinero({
          amount: project.intial_sponsor_club_contribution,
        }).add(dinaroFunds);
        project.intial_sponsor_club_contribution = newAmount.getAmount();
        break;
      case "Non-District Club Contribution":
        newAmount = Dinero({
          amount: project.extra_descriptions.other_club_contribution,
        }).add(dinaroFunds);
        project.extra_descriptions.other_club_contribution =
          newAmount.getAmount();
        break;

      case "District Designated Funds Request (DDF)":
        newAmount = Dinero({
          amount: project.district_simplified_grant_request,
        }).add(dinaroFunds);
        if (
          dinaroFunds.greaterThan(simplifiedGrantRequestLimitAsDinero.value) ||
          newAmount.greaterThan(simplifiedGrantRequestLimitAsDinero.value)
        ) {
          fundingSources.value = {
            sourceName: "",
            typeOfFunding: "",
            amount: 0,
          } as IFundingSource;
          throw new CustomErrors(900, "Simplified Grant Request Exceeded", {
            en: "The maximum amount for a Grant Request exceeded. Please adjust the amount.",
            fr: "Le montant maximum pour une demande de financement est dépassé. Veuillez le modifier.",
          });
        } else {
          project.district_simplified_grant_request = newAmount.getAmount();
        }
        break;

      case "Co-operating Organization Contribution":
        newAmount = Dinero({
          amount: project.co_operating_organisation_contribution,
        }).add(dinaroFunds);
        project.co_operating_organisation_contribution = newAmount.getAmount();
        break;

      case "Other sources":
        newAmount = Dinero({
          amount: project.extra_descriptions.other_sources,
        }).add(dinaroFunds);
        project.extra_descriptions.other_sources = newAmount.getAmount();
        break;
      default:
        break;
    }
    project.anticipated_funding += dinaroFunds.getAmount();
    project.extra_descriptions.fundingSourceArray.push({
      sourceName: fundingSources.value.sourceName,
      typeOfFunding: fundingSources.value.typeOfFunding,
      amount: formattedAmountInCents,
    });
    fundingSources.value = {
      sourceName: "",
      typeOfFunding: "",
      amount: 0,
    } as IFundingSource;
  } catch (error) {
    handleError(error as CustomErrors);
  }
};

const addToBudget = (itemName: string, itemCost: string) => {
  try {
    const formattedCostInCents = convertFloatToCents(itemCost);
    if (formattedCostInCents < 1) {
      langTranslations.value.projectFormLabels.budgetErorrMessage;
    }
    if (
      formattedCostInCents > FUNDING_GOAL_LIMIT ||
      project.funding_goal + formattedCostInCents > FUNDING_GOAL_LIMIT
    ) {
      throw new CustomErrors(900, "Budget Exceeded", {
        en: "The maximum amount for a budget exceeded. Please adjust the amount.",
        fr: "Le montant maximum pour un budget est dépassé. Veuillez le modifier.",
      });
    }
    const budgetItemObject = {
      itemCost: formattedCostInCents,
      itemName: itemName,
    };
    project.funding_goal += budgetItemObject.itemCost;
    project.itemized_budget.push(budgetItemObject);
    budgetItemName.value = "";
    budgetItemCost.value = "";
  } catch (error) {
    handleError(error as CustomErrors);
  }
};

const editBudget = (itemName: string, itemCost: string, index: number) => {
  try {
    const formattedCostInCents = convertFloatToCents(itemCost);
    if (formattedCostInCents < 1) {
      langTranslations.value.projectFormLabels.budgetErorrMessage;
    }
    if (
      formattedCostInCents > FUNDING_GOAL_LIMIT ||
      project.funding_goal + formattedCostInCents > FUNDING_GOAL_LIMIT
    ) {
      throw new CustomErrors(900, "Budget Exceeded", {
        en: "The maximum amount for a budget exceeded. Please adjust the amount.",
        fr: "Le montant maximum pour un budget est dépassé. Veuillez le modifier.",
      });
    }
    project.funding_goal -= project.itemized_budget[index].itemCost;

    project.itemized_budget[index].itemName = itemName;
    project.itemized_budget[index].itemCost = formattedCostInCents;

    project.funding_goal += project.itemized_budget[index].itemCost;

    showModal.value.show = false;
    showModal.value.chosenIndex = -1;
    showModal.value.budget = false;

    budgetItemName.value = "";
    budgetItemCost.value = "";
  } catch (error) {
    handleError(error as CustomErrors);
  }
};

const deleteFromBudget = (index: number) => {
  try {
    const item = project.itemized_budget[index];
    const dinaroItemCost = Dinero({
      amount: item.itemCost,
    });
    const dinaroProjectFundingGoal = Dinero({
      amount: project.funding_goal,
    });
    const subtracted = dinaroProjectFundingGoal.subtract(dinaroItemCost);
    project.funding_goal = subtracted.getAmount();
    project.itemized_budget.splice(index, 1);
  } catch (error) {
    handleError(error as CustomErrors);
  }
};

const showEditBudget = (index: number) => {
  try {
    showModal.value.show = true;
    showModal.value.chosenIndex = index;
    showModal.value.budget = true;
  } catch (error) {
    handleError(error as CustomErrors);
  }
};

const getProject = async () => {
  if (projectId) {
    const response = await projectsApi.getProject(projectId);
    Object.assign(project, response);
    originalAmountofAnitcipated.value = Dinero({
      amount: project.anticipated_funding + project.total_pledges,
    });
    useActiveProjectStore().setActiveProject(project);
    if (projectDisabledStatus(project.project_status as ProjectStatus)) {
      disabledMode.value = true;
    }
  }
};
const validateAndSubmit = async () => {
  try {
    const isFormCorrect = await v$.value.$validate();
    if (
      !isFormCorrect ||
      anticipatedFundingErrors.value.error ||
      fundingGoalErrors.value.error
    ) {
      window.scrollTo(0, 0);
      throw new CustomErrors(900, "Form Error", {
        en: "Form errors. Please correct.",
        fr: "Erreurs de formulaire. Veuillez les corriger.",
      });
    }
    // project.funding_goal = convertFloatToCents(project.funding_goal);
    // project.anticipated_funding = convertFloatToCents(
    //   project.anticipated_funding
    // );
    if (projectId) {
      await projectsApi.updateSimplifiedProject(project);
      handleSuccess(langTranslations.value.toastSuccess);
    } else {
      const response = await projectsApi.createSimplifiedProject(project);
      if (response) {
        handleSuccess(langTranslations.value.toastSuccess);
      } else {
        redirect();
      }
    }
    redirect();
  } catch (error) {
    handleError(error as CustomErrors);
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
  sessionStorage.setItem("projectsLastActiveTab", tabName);
};

const setDistrictId = (districtId: number) => {
  project.district_id = districtId;
};

const setClubId = (clubId: number) => {
  project.club_id = clubId;
};
</script>

<template>
  <div>
    <div
      v-if="showModal"
      class="edit-table-row modal"
      :class="{
        hidden: !showModal.show,
      }"
    >
      <span @click="showModal.show = false" class="close cursor-pointer"
        >&times;</span
      >
      <!-- Modal content -->
      <div class="modal-content flex justify-center items-center">
        <td class="px-6 py-4">
          <BaseInput
            v-if="showModal.budget"
            :disabled="disabledMode"
            v-model="budgetItemName"
            :label="'Item Name'"
            :type="'text'"
          />
        </td>
        <td class="px-6 py-4 whitespace-nowrap :lg:whitespace-normal">
          <BaseInput
            v-if="showModal.budget"
            :disabled="disabledMode"
            v-model="budgetItemCost"
            :label="'Cost'"
            :inputmode="'numeric'"
            :type="'number'"
          />
        </td>
        <Icon
          class="cursor-pointer text-4xl"
          icon="ic:sharp-save"
          @click="
            () => {
              if (showModal.budget) {
                editBudget(
                  budgetItemName,
                  budgetItemCost,
                  showModal.chosenIndex
                );
              } else if (showModal.funding) {
              }
            }
          "
        />
        <Icon
          @click="showModal.show = false"
          class="text-4xl cursor-pointer"
          icon="carbon:close-outline"
        />
      </div>
    </div>
    <Banners
      v-if="viewerMode"
      :banner-text="langTranslations.landingpageBannerText"
    />
    <H1
      v-if="!viewerMode"
      class="text-center my-4"
      :content="langTranslations.projectFormLabels.dsgProjectsHeader"
    />
    <ul
      v-if="!viewerMode"
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
    <ProjectOverride
        v-if="useLoggedInUserStore().getLoggedInUserRole() === 'SuperAdmin' || districtRoles.includes(useLoggedInUserStore().getLoggedInUserRole() as string) "
        :district-id-parent-value="
          useLoggedInUserStore().loggedInUser.district_id ||
          useLoggedInDistrict().loggedInDistrict.district_id
        "
        :role="'superUser'"
        @updateDistrictId="(districtId: number) => setDistrictId(districtId)"
        @update-club-id="(clubId: number) =>  setClubId(clubId)"
      />
      <ul v-if="!viewerMode" class="my-8 px-4">
        <li
          class="list-disc"
          v-for="listItem in ResourceList.districtSimplifiedCriteria[
            languagePref
          ]"
          :key="listItem"
        >
          {{ listItem }}
        </li>
      </ul>
      <Hr v-if="!viewerMode" />
      <div class="form-block">
        <BaseInput
          :disabled="disabledMode"
          v-model="project.project_name"
          :label="langTranslations.projectFormLabels.projectNameLabel"
          :type="'text'"
          :errorMessage="v$.project_name.$errors[0]?.$message as string | undefined"
        />
      </div>
      <div class="textarea-block">
        <BaseTextarea
          :disabled="disabledMode"
          v-model="project.project_description"
          :rows="7"
          :label="langTranslations.desciptionLabel"
          :errorMessage="v$.project_description?.$errors[0]?.$message as string | undefined "
        />
      </div>
      <div class="form-block">
        <BaseSelect
          :disabled="disabledMode"
          v-model="project.country"
          :label="langTranslations.countryLabel"
          :options="ResourceList.countryList"
          :errorMessage="v$.country?.$errors[0]?.$message as string | undefined "
        />
        <BaseSelect
          :disabled="disabledMode"
          v-model="project.region"
          :label="langTranslations.landingPage.regionLabel"
          :options="ResourceList.regionList"
          :errorMessage="v$.region?.$errors[0]?.$message as string | undefined "
        />
        <BaseInput
          :disabled="disabledMode"
          v-model="project.start_date"
          :label="langTranslations.projectFormLabels.startDateLabel"
          :type="'date'"
          :errorMessage="v$.start_date?.$errors[0]?.$message as string | undefined "
        />
        <BaseInput
          :disabled="disabledMode"
          v-model="project.completion_date"
          :label="langTranslations.projectFormLabels.completionDateLabel"
          :type="'date'"
          :errorMessage="v$.completion_date?.$errors[0]?.$message as string | undefined "
        />
      </div>
      <div class="area-of-focus-section form-block">
        <div
          v-for="i in processAreaOfFocus(project.area_focus)"
          :key="i.label"
          class="flex"
        >
          <img class="w-2/12" :src="'/area-focus/' + i.imgLink" alt="" />
          <BaseCheckBox
            :disabled="disabledMode"
            v-model="(project.area_focus as any)[i.key]"
            :label="i.label"
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
      <Hr />

      <div class="textarea-block">
        <BaseTextarea
          :disabled="disabledMode"
          v-model="project.extra_descriptions.benefit_community_description"
          :rows="7"
          :label="
            '1.' +
            langTranslations.projectFormLabels.benefit_community_description
          "
          :errorMessage="v$.extra_descriptions
                .benefit_community_description?.$errors[0]?.$message as string | undefined "
        />
        <BaseTextarea
          :disabled="disabledMode"
          v-model="project.extra_descriptions.non_financial_participation"
          :rows="7"
          :label="
            '2.' +
            langTranslations.projectFormLabels.non_financial_participation
          "
          :errorMessage="v$.extra_descriptions.non_financial_participation?.$errors[0]?.$message as string | undefined "
        />
        <BaseTextarea
          :disabled="disabledMode"
          v-model="project.extra_descriptions.co_operating_organisation_letter"
          :rows="7"
          :label="
            '3.' +
            langTranslations.projectFormLabels.co_operating_organisation_letter
          "
        />
      </div>
      <div v-if="!viewerMode" class="contacts-block">
        <H3
          class="text-center py-8"
          :content="langTranslations.projectFormLabels.contactsHeader"
        />
        <Hr />
        <H4 :content="langTranslations.projectFormLabels.primaryContactLabel" />
        <div class="form-block">
          <BaseInput
            :disabled="disabledMode"
            v-model="project.extra_descriptions.primary_contact.name"
            :label="langTranslations.nameLabel"
            :type="'text'"
            :errorMessage="v$.extra_descriptions.primary_contact.name.$errors[0]?.$message as string | undefined"
          />
          <BaseInput
            :disabled="disabledMode"
            v-model="project.extra_descriptions.primary_contact.address"
            :label="langTranslations.addressLabel"
            :type="'text'"
            :errorMessage="v$.extra_descriptions.primary_contact.address.$errors[0]?.$message as string | undefined"
          />
          <BaseInput
            :disabled="disabledMode"
            v-model="project.extra_descriptions.primary_contact.email"
            :label="langTranslations.email"
            :type="'email'"
            :errorMessage="v$.extra_descriptions.primary_contact.email.$errors[0]?.$message as string | undefined"
          />
          <BaseInput
            :disabled="disabledMode"
            v-model="project.extra_descriptions.primary_contact.phone"
            :label="langTranslations.phone"
            :type="'text'"
            :errorMessage="v$.extra_descriptions.primary_contact.phone.$errors[0]?.$message as string | undefined"
          />
        </div>
        <Hr />
        <H4
          :content="langTranslations.projectFormLabels.secondaryContactLabel"
        />
        <div class="form-block">
          <BaseInput
            :disabled="disabledMode"
            v-model="project.extra_descriptions.secondary_contact.name"
            :label="langTranslations.nameLabel"
            :type="'text'"
          />
          <BaseInput
            :disabled="disabledMode"
            v-model="project.extra_descriptions.secondary_contact.address"
            :label="langTranslations.addressLabel"
            :type="'text'"
          />
          <BaseInput
            :disabled="disabledMode"
            v-model="project.extra_descriptions.secondary_contact.email"
            :label="langTranslations.email"
            :type="'email'"
          />
          <BaseInput
            :disabled="disabledMode"
            v-model="project.extra_descriptions.secondary_contact.phone"
            :label="langTranslations.phone"
            :type="'text'"
          />
        </div>
      </div>
      <Hr />
      <H3
        class="text-center"
        :content="langTranslations.projectFormLabels.budgetLabel"
      />
      <div class="budget-headers flex py-8 flex-col gap-4">
        <p class="text-center font-bold">
          {{ langTranslations.projectFormLabels.budgetHeader1 }}
        </p>
        <p class="text-center font-bold">
          {{ langTranslations.projectFormLabels.budgetHeader2 }}
        </p>
      </div>
      <div class="budget-table">
        <div
          class="relative overflow-x-auto shadow-md sm:rounded-lg"
          id="item_table"
        >
          <table class="w-full text-sm text-left text-nearWhite">
            <thead class="text-xs text-nearWhite uppercase bg-gray-500">
              <tr>
                <th scope="col" class="px-6 py-3">
                  {{ langTranslations.nameLabel }}
                </th>
                <th scope="col" class="px-6 py-3">
                  {{ langTranslations.projectFormLabels.costLabel }}
                </th>
                <th v-if="!disabledMode" scope="col" class="px-6 py-3">
                  {{ langTranslations.actionsLabel }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="!disabledMode"
                class="row border-b bg-nearBlack border-gray-700"
              >
                <td class="px-6 py-4">
                  <BaseInput
                    :disabled="disabledMode"
                    v-model="budgetItemName"
                    :label="'Item Name'"
                    :type="'text'"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap :lg:whitespace-normal">
                  <BaseInput
                    :disabled="disabledMode"
                    v-model="budgetItemCost"
                    :label="'Cost'"
                    :inputmode="'numeric'"
                    :type="'number'"
                  />
                </td>
                <td
                  v-if="!disabledMode"
                  class="px-6 py-4 text-center whitespace-nowrap :lg:whitespace-normal"
                >
                  <button
                    title="Add item"
                    class="plus_icon hover:text-primary-color"
                    @click="addToBudget(budgetItemName, budgetItemCost)"
                  >
                    <Icon class="text-2xl" icon="ic:baseline-plus" />
                  </button>
                </td>
              </tr>
              <tr
                class="row border-b bg-nearBlack border-gray-700"
                id="funding_source"
                v-for="(item, index) in project.itemized_budget"
                :key="index"
              >
                <td class="px-6 py-4 font-medium text-nearWhite">
                  {{ item.itemName }}
                </td>
                <td class="px-6 py-4 font-medium text-nearWhite">
                  <p>
                    {{ currencyFormatterFunding(item.itemCost) }}
                  </p>
                </td>
                <td v-if="!disabledMode" class="px-6 py-4 text-center">
                  <button
                    title="Edit item"
                    class="crud-buttons plus_icon hover:text-primary-color"
                    @click="showEditBudget(index)"
                  >
                    <Icon class="text-2xl" icon="bxs:edit" />
                  </button>
                  <button
                    title="Delete item"
                    class="crud-buttons plus_icon hover:text-primary-color"
                    @click="deleteFromBudget(index)"
                  >
                    <Icon class="text-2xl" icon="material-symbols:delete" />
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td
                  colspan="3"
                  class="border-2 border-primary-color px-6 py-4 text-center font-bold text-gray-900"
                >
                  {{ langTranslations.projectFormLabels.totalBudgetLabel }}
                  {{ formattedFundingGoal }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <Hr />
      <div class="flex flex-col justify-center items-center">
        <H4
          class="text-center"
          :content="
            langTranslations.districtLabel +
            ' ' +
            customPrintf(
              langTranslations.projectFormLabels.ddfStatement,
              useLoggedInDistrict().loggedInDistrict.district_name,
              useLoggedInDistrict().loggedInDistrict.district_details.ddfCapes.dsgFraction.toString(),
              useLoggedInDistrict().loggedInDistrict.district_details.ddfCapes.dsgCap.toString()
            )
          "
        />
        <p class="text-center text-secondary py-4">
          {{
            langTranslations.districtLabel +
            " " +
            customPrintf(
              langTranslations.projectFormLabels.ddfCalculationStatement,
              useLoggedInDistrict().loggedInDistrict.district_name
            )
          }}
        </p>
        <strong class="text-center">
          {{
            useLoggedInDistrict()
              .loggedInDistrict.district_details.ddfCalculation.map(
                (ele) => ` ${ele.toString()}`
              )
              .join(",")
          }}</strong
        >
        <H4
          class="text-center p-4 mt-4 border-solid border-primary border"
          :content="
            langTranslations.projectFormLabels.ddfRequestLimit +
            ' ' +
            simplifiedGrantRequestLimit +
            ' USD'
          "
        />
      </div>
      <Hr />
      <H4
        class="text-center py-8"
        :content="langTranslations.projectFormLabels.fundingSourcesLabel"
      />
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          id="funding-source-table"
          class="w-full text-sm text-left text-nearWhite"
        >
          <thead class="text-xs text-nearWhite uppercase bg-gray-500">
            <tr>
              <th scope="col" class="px-6 py-3">#</th>
              <th scope="col" class="px-6 py-3">
                {{ langTranslations.sourceLabel }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ langTranslations.projectFormLabels.detailsLabel }}
              </th>
              <th scope="col" class="px-6 py-3">
                {{ langTranslations.pledgeProcess.amountLabel }}
              </th>
              <th v-if="!disabledMode" scope="col" class="px-6 py-3">
                {{ langTranslations.actionsLabel }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-if="!disabledMode"
              class="row border-b bg-nearBlack border-gray-700"
            >
              <td class="px-6 py-4">*</td>
              <td class="px-6 py-4">
                <BaseSelect
                  :disabled="disabledMode"
                  v-model="fundingSources.sourceName"
                  :options="addFundingSource"
                  class="mb-2"
                />
              </td>
              <td class="px-6 py-4">
                <BaseInput
                  :disabled="disabledMode"
                  :label="''"
                  v-model="fundingSources.typeOfFunding"
                  :type="'text'"
                />
              </td>
              <td class="px-6 py-4">
                <BaseInput
                  :disabled="disabledMode"
                  :label="''"
                  v-model="fundingSources.amount"
                  :type="'number'"
                />
              </td>
              <td
                v-if="!disabledMode"
                class="px-6 py-4 text-center whitespace-nowrap :lg:whitespace-normal"
              >
                <button
                  title="Add item"
                  class="plus_icon hover:text-primary-color"
                  @click="addToFundsArray()"
                >
                  <Icon class="text-2xl" icon="ic:baseline-plus" />
                </button>
              </td>
            </tr>
            <tr
              class="row border-b bg-nearBlack border-gray-700"
              id="funding_source"
              v-for="(item, index) in project.extra_descriptions
                .fundingSourceArray"
              :key="index"
            >
              <td class="px-6 py-4 font-medium text-nearWhite">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4 font-medium text-nearWhite">
                {{ item.sourceName }}
              </td>
              <td class="px-6 py-4 font-medium text-nearWhite">
                {{ item.typeOfFunding }}
              </td>
              <td class="px-6 py-4 font-medium text-nearWhite">
                {{ currencyFormatterFunding(item.amount) }}
              </td>
              <td v-if="!disabledMode" class="px-6 py-4 text-center">
                <button
                  title="Delete item"
                  class="crud-buttons plus_icon hover:text-primary-color"
                  @click="deleteFromFundsArray(index)"
                >
                  <Icon class="text-2xl" icon="material-symbols:delete" />
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td
                colspan="5"
                class="border-2 border-primary-color px-6 py-4 text-center font-bold text-gray-900"
              >
                {{ langTranslations.projectFormLabels.totalFundingLabel }}
                {{ sumOfAnticipatedFunding + " USD" }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="stats">
        <div class="border-primary border-solid border my-8">
          <H4
            class="my-4 text-center font-bold underline-offset-8"
            :content="
              langTranslations.projectFormLabels.currentAnticipationLabel +
              ' ' +
              sumOfAnticipatedFunding
            "
          >
          </H4>
          <H4
            class="my-4 text-center font-bold underline-offset-8"
            :content="
              langTranslations.projectFormLabels.currentFundingLabel +
              ' ' +
              formattedFundingGoal
            "
          >
          </H4>
          <H4
            class="my-4 text-center font-bold underline-offset-8"
            :content="
              langTranslations.projectFormLabels.pledgeAmountLabel +
              ' ' +
              currencyFormatterFunding(project.total_pledges)
            "
          >
          </H4>
          <H4
            class="my-4 text-center font-bold underline-offset-8"
            :content="
              langTranslations.projectFormLabels.dsgRequestLabel +
              ' ' +
              currencyFormatterFunding(
                project.district_simplified_grant_request
              )
            "
          >
          </H4>
          <ErrorValidation
            class="text-center"
            v-if="anticipatedFundingErrors.error"
            :errorMsg="anticipatedFundingErrors.messages as string | undefined"
          />
          <ErrorValidation
            class="text-center"
            v-if="v$.anticipated_funding.$error"
            :errorMsg="v$.anticipated_funding?.$errors[0]?.$message  as string | undefined"
          />
        </div>
      </div>
      <div class="button_row mt-8 flex justify-center gap-4">
        <RotaryButton
          v-if="!viewerMode"
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
          :label="
            viewerMode
              ? langTranslations.backLabel
              : langTranslations.cancelLabel
          "
          @click="redirect()"
        />
      </div>
    </form>
    <div v-if="activeTab === 'uploads'">
      <ProjectUploads :project-type="'dsg'" />
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

.modal {
  position: fixed; /* Stay in place */
  z-index: 100; /* Sit on top */
  padding-top: 15rem; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 1.5rem;
  border: 1px solid #888;
  width: 80%;
}
</style>
