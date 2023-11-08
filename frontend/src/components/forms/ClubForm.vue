<script lang="ts">
export default {
  name: "ClubForm",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref, watch } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import District from "@/utils/classes/District";
import { useVuelidate } from "@vuelidate/core";
import router from "@/router";
import ResourceList from "@/utils/classes/ResourceList";
import BaseCheckBox from "@/components/form/BaseCheckBox.vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import H2 from "@/components/headings/H2.vue";
import Hr from "@/components/hr/Hr.vue";
import BaseInput from "@/components/form/BaseInput.vue";
import { email, helpers, required } from "@vuelidate/validators/dist/index.mjs";
import { DistrictApi } from "@/api/services/DistrictsApi";
import { ApiClient } from "@/api/ApiClient";
import { CustomError } from "@/utils/classes/CustomError";
import Club from "@/utils/classes/Club";
import { ClubApi } from "@/api/services/ClubApi";
import { useRoute } from "vue-router";
import BaseSelect from "@/components/form/BaseSelect.vue";

/* Data */
type formType = "siteAdmin" | "clubAdmin" | "districtAdmin" | undefined;
const route = useRoute();
const districtApi = new DistrictApi(new ApiClient());
const { langTranslations, languagePref } = useLanguage();
const { handleError, handleSuccess, handleValidationForm } = errorHandler();
const club = reactive(new Club());
// required form data
const clubId = route.params.clubId ?? null;
const formType = route.query.formType
  ? (route.query.formType as formType)
  : undefined;
//
const clubApi = new ClubApi(new ApiClient());
const districtMap = reactive<Map<string, number>>(new Map());
const chosenDistrict = ref("");
const submitLabel: { [key: string]: string } = clubId
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
  club_name: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  club_address: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  club_city: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  club_country: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  club_email: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    email: helpers.withMessage(
      langTranslations.value.formErorrText.emailFormat,
      email
    ),
  },
};
const v$ = useVuelidate(rules, club);

/* Hooks */
onMounted(async () => {
  try {
    if (formType === "siteAdmin" && !clubId) {
      const response = (await districtApi.getAllDistricts(true)) as District[];
      response.forEach((district) => {
        districtMap.set(district.district_name, district.district_id);
      });
    }
    if (clubId) {
      const response = await clubApi.getById(Number(clubId as string));
      Object.assign(club, response);
    }
  } catch (error) {
    handleError(error as CustomError);
  }
});

watch(chosenDistrict, async () => {
  if (!clubId) {
    const id = districtMap.get(chosenDistrict.value) as number;
    club.district_id = id;
  }
});

/* Methods */
const validateAndSubmit = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    return;
  }
  try {
    if (formType === "siteAdmin" && !clubId && chosenDistrict.value === "") {
      throw new CustomError(900, "Must chose a district", {
        en: "Must assign club to a district",
        fr: "Doit assigner le club a un district",
      });
    }
    if (clubId) {
      await clubApi.updateClub(club);
    } else if (formType === "siteAdmin" && !clubId) {
      await clubApi.createClub(club);
    }
    handleSuccess(langTranslations.value.toastSuccess, {
      path: "club",
    });
    redirect();
  } catch (error) {
    handleError(error as CustomError);
  }
};
const redirect = () => {
  if (formType === "siteAdmin") {
    router.push({ name: "Club" });
  }
  if (formType === "clubAdmin") {
    router.go(0);
  }
  if (formType === "districtAdmin") {
    router.push({ name: "ClubsAdmin" });
  }
};
</script>

<template>
  <form @submit.prevent class="">
    <H2
      class="text-center"
      :content="langTranslations.clubForm.clubFormHeader"
    />
    <Hr />
    <div class="flex-block flex-col items-center justify-center">
      <BaseSelect
        v-if="formType === 'siteAdmin' && !clubId"
        class="w-1/2"
        :label="langTranslations.userForm.districtSelectLabel"
        :options="[...districtMap.keys()]"
        v-model="chosenDistrict"
      />
    </div>
    <div class="form-block">
      <BaseInput
        v-model="club.club_name"
        :label="langTranslations.nameLabel"
        :type="'text'"
        :errorMessage="v$.club_name?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="club.club_address"
        :label="langTranslations.addressLabel"
        :type="'text'"
        :errorMessage="v$.club_address?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="club.club_city"
        :label="langTranslations.cityLabel"
        :type="'text'"
        :errorMessage="v$.club_city?.$errors[0]?.$message as string | undefined "
      />
      <BaseSelect
        v-model="club.club_country"
        :label="langTranslations.countryLabel"
        :options="ResourceList.countryList"
        :errorMessage="v$.club_country?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="club.club_email"
        :label="langTranslations.email"
        :type="'email'"
        :errorMessage="v$.club_email?.$errors[0]?.$message as string | undefined "
      />
    </div>
    <div class="form-block">
      <BaseCheckBox
        v-model="club.settings.disableDsg as boolean"
        :label="langTranslations.clubForm.disableDsgLabel"
      />
      <BaseCheckBox
        v-model="club.settings.disableDM as boolean"
        :label="langTranslations.clubForm.disableDsgLabel"
      />
      <BaseCheckBox
        v-model="club.settings.disableGlobal as boolean"
        :label="langTranslations.clubForm.disableGlobalLabel"
      />
    </div>
    <div class="button_row mt-4 flex justify-center gap-4">
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
        v-if="formType !== 'clubAdmin'"
      />
    </div>
  </form>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
