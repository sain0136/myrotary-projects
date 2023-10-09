<script lang="ts">
export default {
  name: "UserForm",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { handleError, onMounted, reactive, ref, watch } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import District from "@/utils/classes/District";
import { useVuelidate } from "@vuelidate/core";
import router from "@/router";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import H2 from "@/components/headings/H2.vue";
import Hr from "@/components/hr/Hr.vue";
import BaseInput from "@/components/form/BaseInput.vue";
import {
  email,
  helpers,
  maxLength,
  minLength,
  required,
} from "@vuelidate/validators/dist/index.mjs";
import { UsersApi } from "@/api/services/UserApi";
import { ApiClient } from "@/api/ApiClient";
import { CustomError } from "@/utils/classes/CustomError";
import { useRoute } from "vue-router";
import User from "@/utils/classes/User";
import BaseSelect from "@/components/form/BaseSelect.vue";
import { DistrictApi } from "@/api/services/DistrictsApi";
import ResourceList from "@/utils/classes/ResourceList";
import { ClubApi } from "@/api/services//ClubApi";
import type { IClub } from "@/utils/interfaces/IClub";
import { all } from "axios";
/* Data */
type UserType = "districtAdmin" | "clubUser" | null;
const route = useRoute();
const { langTranslations, languagePref } = useLanguage();
const userId = route.params.userId;
const userType = route.query.userType
  ? (route.query.userType as UserType)
  : null;

const user = reactive(new User());
const { handleError, handleSuccess, handleValidationForm } = errorHandler();
const userApi = new UsersApi(new ApiClient());
const clubApi = new ClubApi(new ApiClient());
const districtNames = reactive<string[]>([]);
const districtApi = new DistrictApi(new ApiClient());
const allDistricts = [];
// TODO: Verify later district names are unique in db
const districtMap = reactive<Map<string, number>>(new Map());
const chosenDistrict = ref("");
const chosenDistrictError = ref({
  en: "Must assign Admin to a District and Base Club",
  fr: "Doit assigner un Admin a un District et un Club",
});
const clubMap = reactive<Map<string, number>>(new Map());
const userTitle = ref("");
// const allClubsInDistrict = reactive<string[]>([]);
const chosenClub = ref("");
const submitLabel = userId
  ? {
      en: "Update",
      fr: "Modifier",
    }
  : {
      en: "Create",
      fr: "Créer",
    };
const maxLengthPostal = {
  en: "Must be at most 32 characters",
  fr: "Doit contenir au plus 32 caractères",
};
const maxLenghtAddress = {
  en: "Must be at most 100 characters",
  fr: "Doit contenir au plus 100 caractères",
};
const maxLengthMessage = {
  en: "Must be at most 50 characters",
  fr: "Doit contenir au plus 50 caractères",
};
const passwordMinLength = {
  en: "Must be at least 8 characters",
  fr: "Doit contenir au moins 8 caractères",
};
/* Validations */
const rules = {
  firstname: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      maxLengthMessage[languagePref.value],
      maxLength(50)
    ),
  },
  lastname: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      maxLengthMessage[languagePref.value],
      maxLength(50)
    ),
  },
  address: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      maxLenghtAddress[languagePref.value],
      maxLength(100)
    ),
  },
  user_postal: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      maxLengthPostal[languagePref.value],
      maxLength(32)
    ),
  },
  user_province: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      maxLenghtAddress[languagePref.value],
      maxLength(100)
    ),
  },
  user_city: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      maxLengthMessage[languagePref.value],
      maxLength(50)
    ),
  },
  user_country: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      maxLengthMessage[languagePref.value],
      maxLength(50)
    ),
  },
  phone: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      maxLengthMessage[languagePref.value],
      maxLength(50)
    ),
  },
  role_type: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  email: {
    emailFormat: helpers.withMessage(
      langTranslations.value.formErorrText.emailFormat,
      email
    ),
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  password: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    minLength: helpers.withMessage(
      passwordMinLength[languagePref.value],
      minLength(8)
    ),
  },
};
const v$ = useVuelidate(rules, user);

/* Hooks */
watch(chosenDistrict, async () => {
  if (chosenDistrict.value === "") {
    chosenDistrictError.value = {
      en: "Must select a district",
      fr: "Doit sélectionner un district",
    };
  } else {
    chosenDistrictError.value = {
      en: "",
      fr: "",
    };
  }
  try {
    const id = districtMap.get(chosenDistrict.value) as number;
    const allClubsInDistrict = await clubApi.clubsInDistrict(id, 1, 10000000);
    clubMap.clear();
    (allClubsInDistrict.data as IClub[]).forEach((club) => {
      clubMap.set(club.club_name, club.club_id as number);
    });
  } catch (error) {
    handleError(error as CustomError);
  }
});

onMounted(async () => {
  try {
    if (userType === "districtAdmin") {
      const response = (await districtApi.getAllDistricts(true)) as District[];
      response.forEach((district) => {
        districtMap.set(district.district_name, district.district_id);
      });
      allDistricts.push();
    }
    if (userId) {
      const response = await userApi.getUser(parseInt(userId as string));
      Object.assign(user, response);
      userTitle.value =
        (user.role[0].district_role ?? "") + ": " + user.fullName;
    }
  } catch (error) {
    handleError(error as CustomError);
  }
});

/* Methods */
const validateAndSubmit = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect || (!userId && chosenDistrict.value === "")) {
    handleValidationForm();
    return;
  }
  try {
    if (userId) {
      await userApi.updateUser(user);
    } else {
      if (userType === "clubUser") {
        user.user_type = "CLUB";
      }

      if (userType === "districtAdmin") {
        if (typeof districtMap.get(chosenDistrict.value) !== "undefined") {
          {
            user.district_id = districtMap.get(chosenDistrict.value) as number;
          }
        } else {
          throw new CustomError(900, "District not found", {
            en: "District not found",
            fr: "District non trouvé",
          });
        }
        if (typeof clubMap.get(chosenClub.value) !== "undefined") {
          user.club_id = clubMap.get(chosenClub.value) as number;
        } else {
          throw new CustomError(900, "Club not found", {
            en: "Club not found",
            fr: "Club non trouvé",
          });
        }
      }
      await userApi.createNewUser(user);
      router.push({ name: "District", query: { tabNameProp: "district" } });
    }
    handleSuccess(langTranslations.value.toastSuccess);
    redirect();
  } catch (error) {
    handleError(error as CustomError);
  }
};

const redirect = () => {
  router.push({ name: "District" });
};
</script>

<template>
  <form @submit.prevent class="">
    <H2 class="text-center" :content="langTranslations.userFormHeader" />
    <Hr />
    <div class="flex-block flex-col items-center justify-center">
      <p
        v-if="chosenDistrict === '' && chosenClub === '' && userId === ''"
        id="error"
        class="mt-2 text-md text-nearBlack"
      >
        <span class="font-bold">{{ chosenDistrictError[languagePref] }}</span>
      </p>
      <BaseSelect
        v-if="userType === 'districtAdmin' && !userId"
        class="w-1/2"
        :label="langTranslations.userForm.districtSelectLabel"
        :options="[...districtMap.keys()]"
        v-model="chosenDistrict"
      />
      <BaseSelect
        v-if="userType === 'districtAdmin' && !userId"
        class="w-1/2"
        :label="langTranslations.baseClubLabel"
        :options="[...clubMap.keys()]"
        v-model="chosenClub"
      />
      <!-- TODO: implications of changes to users role -->
      <BaseSelect
        class="w-1/2"
        v-model="user.role_type"
        :label="langTranslations.roleLabel"
        :options="ResourceList.districtRolesList"
        :errorMessage="v$.role_type?.$errors[0]?.$message as string | undefined "
      />
      <H2 :content="userTitle" />
    </div>
    <div class="form-block">
      <BaseInput
        v-model="user.firstname"
        :label="langTranslations.userForm.firstNameLabel"
        :type="'text'"
        :errorMessage="v$.firstname?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="user.lastname"
        :label="langTranslations.userForm.lastNameLabel"
        :type="'text'"
        :errorMessage="v$.lastname?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="user.address"
        :label="langTranslations.addressLabel"
        :type="'text'"
        :errorMessage="v$.address?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="user.user_city"
        :label="langTranslations.cityLabel"
        :type="'text'"
        :errorMessage="v$.user_city?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="user.user_postal"
        :label="langTranslations.postalCodeLabel"
        :type="'text'"
        :errorMessage="v$.user_postal?.$errors[0]?.$message as string | undefined "
      />
      <BaseSelect
        v-model="user.user_country"
        :label="langTranslations.countryLabel"
        :options="ResourceList.countryList"
        :errorMessage="v$.user_country?.$errors[0]?.$message as string | undefined "
      />
      <BaseSelect
        v-if="
          (user.user_country !== '' && user.user_country === 'United States') ||
          user.user_country === 'Canada'
        "
        v-model="user.user_province"
        :label="langTranslations.stateOrProvinceLabel"
        :options="
          user.user_country === 'United States'
            ? ResourceList.usaStatesList
            : ResourceList.canadaProvinceList
        "
        :errorMessage="v$.user_province?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-else-if="user.user_country !== ''"
        v-model="user.user_province"
        :label="langTranslations.stateOrProvinceLabel"
        :type="'text'"
        :errorMessage="v$.user_province?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="user.phone"
        :label="langTranslations.phone"
        :type="'text'"
        :errorMessage="v$.phone?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="user.email"
        :label="langTranslations.email"
        :type="'email'"
        :errorMessage="v$.email?.$errors[0]?.$message as string | undefined "
      />
      <BaseInput
        v-model="user.password"
        :label="langTranslations.password"
        :type="'password'"
        :errorMessage="v$.password?.$errors[0]?.$message as string | undefined "
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
      />
    </div>
  </form>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
