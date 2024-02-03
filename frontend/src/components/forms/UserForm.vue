<script lang="ts">
export default {
  name: "UserForm",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { computed, onMounted, reactive, ref, watch } from "vue";
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
import { CustomErrors } from "@/utils/classes/CustomErrors";
import { useRoute } from "vue-router";
import User from "@/utils/classes/User";
import BaseSelect from "@/components/form/BaseSelect.vue";
import { DistrictApi } from "@/api/services/DistrictsApi";
import ResourceList from "@/utils/classes/ResourceList";
import { ClubApi } from "@/api/services//ClubApi";
import type { IClub } from "@/utils/interfaces/IClub";
import { districtRole } from "@/utils/types/commonTypes";

/* Types */
type UserType = "districtAdmin" | "clubUser" | null;
type formType =
  | "siteAdminClub"
  | "siteAdminDistrict"
  | "myProfile"
  | "clubAdmin"
  | "districtAdmin"
  | null;

/* Data */
const route = useRoute();
const { langTranslations, languagePref, customPrintf } = useLanguage();
// Route data -- When using form from url
const userId = ref(route.params.userId);
const userType = ref(
  route.query.userType ? (route.query.userType as UserType) : null
);
const clubId = ref(route.query.clubId ?? null);
const districtId = ref(
  route.query.districtId ? Number(route.query.districtId) : null
);
const isEdit = ref(route.query.isEdit ? true : false);
const formType = ref(
  route.query.formType ? (route.query.formType as formType) : null
);
// Component data -- When using form from component
const { userIdProp, userTypeProp, clubIdProp, formTypeProp, isEditProp } =
  defineProps<{
    userIdProp?: string;
    userTypeProp?: UserType;
    clubIdProp?: string;
    formTypeProp?: formType;
    isEditProp?: boolean;
  }>();
userId.value = userIdProp ? userIdProp : userId.value;
userType.value = userTypeProp ? userTypeProp : userType.value;
clubId.value = clubIdProp ? clubIdProp : clubId.value;
formType.value = formTypeProp ? formTypeProp : formType.value;
isEdit.value = isEditProp ? true : false;

const user = reactive(new User());
const { handleError, handleSuccess, handleValidationForm } = errorHandler();
const userApi = new UsersApi(new ApiClient());
const clubApi = new ClubApi(new ApiClient());
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
const chosenClub = ref("");
const submitLabel = userId.value
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
const passwordReset = ref({
  resetSet: false,
  newPassword: "",
});
const submitted = ref(false);

/* Validations */
const rules = {
  firstname: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "50"),
      maxLength(50)
    ),
  },
  lastname: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "50"),
      maxLength(50)
    ),
  },
  address: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "100"),
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
      customPrintf(langTranslations.value.maxLengthMessage, "100"),
      maxLength(100)
    ),
  },
  user_city: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "50"),
      maxLength(50)
    ),
  },
  user_country: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "50"),
      maxLength(50)
    ),
  },
  phone: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "180"),
      maxLength(180)
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
    maxLength: helpers.withMessage(
      customPrintf(langTranslations.value.maxLengthMessage, "254"),
      maxLength(254)
    ),
  },
  password: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
    minLength: helpers.withMessage(
      customPrintf(
        langTranslations.value.formErorrText.passwordMinLength,
        "10"
      ),
      minLength(10)
    ),
    regexValidation: helpers.withMessage(
      langTranslations.value.formErorrText.passwordRegex,
      (value: string) => {
        const regex = new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
        );
        return regex.test(value);
      }
    ),
  },
};
const v$ = useVuelidate(rules, user);

/* Hooks */
watch(chosenDistrict, async () => {
  try {
    const id = districtMap.get(chosenDistrict.value) as number;
    const allClubsInDistrict = await clubApi.clubsInDistrict(id, 1, 10000000);
    clubMap.clear();
    (allClubsInDistrict.data as IClub[]).forEach((club) => {
      clubMap.set(club.club_name, club.club_id as number);
    });
  } catch (error) {
    handleError(error as CustomErrors);
  }
});

onMounted(async () => {
  try {
    if (userType.value === "districtAdmin") {
      const response = (await districtApi.getAllDistricts(true)) as District[];
      response.forEach((district) => {
        districtMap.set(district.district_name, district.district_id);
      });
      allDistricts.push();
    }
    // if edit
    if (userId.value) {
      const response = await userApi.getUser(parseInt(userId.value as string));
      Object.assign(user, response);
      if (formType.value === "siteAdminClub") {
        const role = user.role ? user.role : user.role ? user.role : "";
        userTitle.value = role + ": " + user.fullName;
        user.role_type = role;
      } else {
        const role = user.role ? user.role : user.role ? user.role : "";
        userTitle.value = role + ": " + user.fullName;
        user.role_type = role;
      }
    }
  } catch (error) {
    handleError(error as CustomErrors);
  }
});

/* Methods */
const validateAndSubmit = async () => {
  submitted.value = true;
  let isFormCorrect = await v$.value.$validate();
  isFormCorrect = choosenDistrictError.value !== "" ? false : isFormCorrect;
  if (
    !isFormCorrect ||
    (!userId.value &&
      formType.value === "siteAdminDistrict" &&
      chosenDistrict.value === "")
  ) {
    handleValidationForm(choosenDistrictError.value);
    return;
  }
  try {
    if (userId.value) {
      await userApi.updateUser(user);
    } else {
      if (userType.value === "clubUser") {
        user.user_type = "CLUB";
        user.club_id = Number(clubId.value as string);
        user.district_id = (districtId.value as number) || 1;
      }
      if (userType.value === "districtAdmin") {
        if (typeof districtMap.get(chosenDistrict.value) !== "undefined") {
          {
            user.district_id = districtMap.get(chosenDistrict.value) as number;
          }
        } else {
          throw new CustomErrors(900, "District not found", {
            en: "District not found",
            fr: "District non trouvé",
          });
        }
        if (typeof clubMap.get(chosenClub.value) !== "undefined") {
          user.club_id = clubMap.get(chosenClub.value) as number;
        } else {
          throw new CustomErrors(900, "Club not found", {
            en: "Club not found",
            fr: "Club non trouvé",
          });
        }
      }
      await userApi.createNewUser(user);
    }
    handleSuccess(langTranslations.value.toastSuccess);
    redirect();
  } catch (error) {
    handleError(error as CustomErrors);
  }
};

const redirect = () => {
  switch (formType.value) {
    case "districtAdmin":
      router.push({
        name: "ClubsAdmin",
      });
      return;
    case "siteAdminClub":
      router.push({ name: "Club" });
      return;
    case "siteAdminDistrict":
      router.push({ name: "District" });
      return;
    case "clubAdmin":
      router.push({
        name: "ClubMembers",
        query: {
          tableView: "clubUsers",
        },
      });
      return;
    default:
      router.go(-1);
  }
};

const choosenDistrictError = computed((): string => {
  if (
    (chosenDistrict.value === "" || chosenClub.value === "") &&
    !clubId.value &&
    !isEdit.value &&
    submitted.value
  ) {
    const str = chosenDistrictError.value[languagePref.value];
    return str;
  }
  return "";
});
</script>

<template>
  <form @submit.prevent class="">
    <H2
      v-if="formType !== 'myProfile'"
      class="text-center"
      :content="langTranslations.userFormHeader"
    />
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
        :errorMessage="choosenDistrictError"
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
        v-if="formType === 'siteAdminDistrict'"
        class="w-1/2"
        v-model="user.role_type"
        :label="langTranslations.roleLabel"
        :options="districtRole.filter((role) => role !== 'Webmaster')"
        :errorMessage="v$.role_type?.$errors[0]?.$message as string | undefined"
      />
      <BaseSelect
        v-if="formType === 'siteAdminClub' || formType === 'clubAdmin'"
        class="w-1/2"
        v-model="user.role_type"
        :label="langTranslations.roleLabel"
        :options="ResourceList.clubRolesList"
        :errorMessage="v$.role_type?.$errors[0]?.$message as string | undefined"
      />
      <H2 v-if="formType !== 'myProfile'" :content="userTitle" />
      <div
        v-else-if="formType === 'myProfile'"
        class="flex flex-col gap-4 justify-center items-center font-bold"
      >
        <H2 :content="langTranslations.adminDash.personalInformationLabel" />
        <h6>
          {{ langTranslations.roleLabel }}:
          {{ user.role ?? user.role }}
        </h6>
      </div>
    </div>
    <div class="form-block">
      <BaseInput
        v-model="user.firstname"
        :label="langTranslations.userForm.firstNameLabel"
        :type="'text'"
        :errorMessage="v$.firstname?.$errors[0]?.$message as string | undefined"
      />
      <BaseInput
        v-model="user.lastname"
        :label="langTranslations.userForm.lastNameLabel"
        :type="'text'"
        :errorMessage="v$.lastname?.$errors[0]?.$message as string | undefined"
      />
      <BaseInput
        v-model="user.address"
        :label="langTranslations.addressLabel"
        :type="'text'"
        :errorMessage="v$.address?.$errors[0]?.$message as string | undefined"
      />
      <BaseInput
        v-model="user.user_city"
        :label="langTranslations.cityLabel"
        :type="'text'"
        :errorMessage="v$.user_city?.$errors[0]?.$message as string | undefined"
      />
      <BaseInput
        v-model="user.user_postal"
        :label="langTranslations.postalCodeLabel"
        :type="'text'"
        :errorMessage="v$.user_postal?.$errors[0]?.$message as string | undefined"
      />
      <BaseSelect
        v-model="user.user_country"
        :label="langTranslations.countryLabel"
        :options="ResourceList.countryList"
        :errorMessage="v$.user_country?.$errors[0]?.$message as string | undefined"
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
        :errorMessage="v$.user_province?.$errors[0]?.$message as string | undefined"
      />
      <BaseInput
        v-else-if="user.user_country !== ''"
        v-model="user.user_province"
        :label="langTranslations.stateOrProvinceLabel"
        :type="'text'"
        :errorMessage="v$.user_province?.$errors[0]?.$message as string | undefined"
      />
      <BaseInput
        v-model="user.phone"
        :label="langTranslations.phone"
        :type="'text'"
        :errorMessage="v$.phone?.$errors[0]?.$message as string | undefined"
      />
      <BaseInput
        v-model="user.email"
        :label="langTranslations.email"
        :type="'email'"
        :errorMessage="v$.email?.$errors[0]?.$message as string | undefined"
      />
      <BaseInput
        v-if="!isEdit || passwordReset.resetSet"
        v-model="user.password"
        :label="langTranslations.password"
        :type="'password'"
        :errorMessage="v$.password?.$errors[0]?.$message as string | undefined"
      />
      <div
        class="flex justify-center items-center"
        v-if="isEdit && !passwordReset.resetSet"
      >
        <RotaryButton
          :theme="'black'"
          class="w-1/2 h-1/2 p-0"
          :label="langTranslations.resetPasswordLabel"
          :no-margin="true"
          @click="
            () => {
              passwordReset.resetSet = true;
              user.password = '';
            }
          "
        />
      </div>
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
        v-if="formType !== 'myProfile'"
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
