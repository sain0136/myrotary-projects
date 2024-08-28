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
import { DistrictApi } from "@/api/services/DistrictsApi";
import { ApiClient } from "@/api/ApiClient";
import { CustomErrors } from "@/utils/classes/CustomErrors";
import Club from "@/utils/classes/Club";
import { ClubApi } from "@/api/services/ClubApi";
import { useRoute } from "vue-router";
import BaseSelect from "@/components/form/BaseSelect.vue";
import { clubFormRules } from "@/utils/validations/FormRules";
import { useLoggedInDistrict } from "@/stores/LoggedInDistrict";
/* Data */
type formType = "siteAdmin" | "clubAdmin" | "districtAdmin" | undefined;
const route = useRoute();
const districtApi = new DistrictApi(new ApiClient());
const { langTranslations, languagePref } = useLanguage();
const { handleError, handleSuccess } = errorHandler();
const club = reactive(new Club());

/* Query Props */
const clubIdParam = route.params.clubId ?? null;
const routeQueryFormType = route.query.formType
  ? (route.query.formType as formType)
  : undefined;
/* Query Props */

const formData = reactive({
  clubId: clubIdParam,
  formType: routeQueryFormType,
});
const clubApi = new ClubApi(new ApiClient());
const districtMap = reactive<Map<string, number>>(new Map());
const chosenDistrict = ref("");
const submitLabel: { [key: string]: string } = clubIdParam
  ? {
      en: "Update",
      fr: "Modifier",
    }
  : {
      en: "Submit",
      fr: "Soumettre",
    };

/* Validations */
const v$ = useVuelidate(clubFormRules, club);

/* Hooks */
onMounted(async () => {
  try {
    if (
      (formData.formType === "siteAdmin" ||
        formData.formType === "districtAdmin") &&
      !formData.clubId
    ) {
      const response = (await districtApi.getAllDistricts(true)) as District[];
      if (formData.formType === "siteAdmin") {
        response.forEach((district) => {
          districtMap.set(district.district_name, district.district_id);
        });
      } else if (formData.formType === "districtAdmin") {
        const districtName =
          useLoggedInDistrict().loggedInDistrict.district_name;
        const districtId = useLoggedInDistrict().loggedInDistrict.district_id;
        districtMap.set(districtName, districtId);
      }
    }
    if (formData.clubId) {
      const response = await clubApi.getById(Number(formData.clubId as string));
      Object.assign(club, response);
    }
  } catch (error) {
    handleError(error as CustomErrors);
  }
});

watch(chosenDistrict, async () => {
  if (!formData.clubId) {
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
    if (
      formData.formType === "siteAdmin" &&
      !formData.clubId &&
      chosenDistrict.value === ""
    ) {
      throw new CustomErrors(900, "Must chose a district", {
        en: "Must assign club to a district",
        fr: "Doit assigner le club a un district",
      });
    }
    if (formData.clubId) {
      await clubApi.updateClub(club);
    } else if (!formData.clubId) {
      await clubApi.createClub(club);
    }
    handleSuccess(langTranslations.value.toastSuccess, false, {
      path: "club",
    });
    redirect();
  } catch (error) {
    handleError(error as CustomErrors);
  }
};
const redirect = () => {
  if (formData.formType === "siteAdmin") {
    router.push({ name: "Club" });
  }
  if (formData.formType === "clubAdmin") {
    router.go(0);
  }
  if (formData.formType === "districtAdmin") {
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
        v-if="
          (formData.formType === 'siteAdmin' ||
            formData.formType === 'districtAdmin') &&
          !formData.clubId
        "
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
        v-if="formData.formType !== 'clubAdmin'"
      />
    </div>
  </form>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
