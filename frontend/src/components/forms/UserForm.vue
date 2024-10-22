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
import {
  districtRole,
  districtRoles,
  type UserTypeForm,
  type FormTypes,
} from "@/utils/types/commonTypes";
import { clubRoles } from "@/utils/types/commonTypes";
import Banners from "@/components/banners/Banners.vue";
import { userFormRules } from "@/utils/validations/FormRules";

/* Data */
const route = useRoute();
const { langTranslations, languagePref } = useLanguage();
const { handleError, handleSuccess, handleValidationForm } = errorHandler();

// Route data -- When using form from url
const userId = ref(route.params.userId ?? undefined);
const userType = ref(
  route.query.userType ? (route.query.userType as UserTypeForm) : undefined
);
const clubId = ref<string | undefined>(
  (route.query.clubId as string) ?? undefined
);
const districtId = ref(
  route.query.districtId ? Number(route.query.districtId) : undefined
);
const isEdit = ref(route.query.isEdit ? true : undefined);
const formType = ref<FormTypes>(route.query.formType as FormTypes); //TODO: You must send this maybe type any route type i.e a type for all router calls

// Component data -- When using form as a child component
const { userIdProp, userTypeProp, clubIdProp, formTypeProp, isEditProp } =
  defineProps<{
    userIdProp?: string;
    userTypeProp?: UserTypeForm;
    clubIdProp?: string;
    formTypeProp: FormTypes;
    isEditProp?: boolean;
  }>();

userId.value = userId.value ?? userIdProp;
userType.value = userType.value ?? userTypeProp;
clubId.value = clubId.value ?? clubIdProp;
formType.value = formType.value ?? formTypeProp;
isEdit.value = isEdit.value ?? isEditProp;

const user = reactive(new User());
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

const passwordReset = ref({
  resetSet: false,
  newPassword: "",
});
const submitted = ref(false);

/* Validations */
const v$ = useVuelidate(userFormRules, user);

/* Hooks */

//Dynamically update clubMap based on changes to chosenDistrict
watch(chosenDistrict, async () => {
  try {
    const id = districtMap.get(chosenDistrict.value) as number;
    const allClubsInDistrict = await clubApi.clubsInDistrict(
      id,
      1,
      10000000,
      false
    );
    clubMap.clear();
    (allClubsInDistrict.data as IClub[]).forEach((club) => {
      clubMap.set(club.club_name, club.club_id as number);
    });
    if (formType.value === "siteAdminDistrict") {
      chosenClub.value = Array.from(clubMap.keys()).find(
        (key) => clubMap.get(key) === user.club_id
      ) as string;
    }
  } catch (error) {
    handleError(error as CustomErrors);
  }
});

onMounted(async () => {
  try {
    if (userType.value === "districtAdmin" || userType.value === "newUser") {
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
      } else if (formType.value === "siteAdminDistrict") {
        const role = user.role ? user.role : user.role ? user.role : "";
        chosenDistrict.value = Array.from(districtMap.keys()).find(
          (key) => districtMap.get(key) === user.district_id
        ) as string;
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
      handleSuccess(langTranslations.value.toastSuccess);
    } else {
      if (userType.value === "clubUser") {
        user.user_type = "CLUB";
        user.club_id = Number(clubId.value as string);
        user.district_id = (districtId.value as number) || 1;
      }
      //populating user data
      if (userType.value === "districtAdmin" || userType.value === "newUser") {
        if (typeof districtMap.get(chosenDistrict.value) !== "undefined") {
          {
            user.district_id = districtMap.get(chosenDistrict.value) as number;
          }
        } else {
          throw new CustomErrors(900, {
            en: "District not found",
            fr: "District non trouvé",
          });
        }
        if (typeof clubMap.get(chosenClub.value) !== "undefined") {
          user.club_id = clubMap.get(chosenClub.value) as number;
        } else {
          throw new CustomErrors(900, {
            en: "Club not found",
            fr: "Club non trouvé",
          });
        }
      }
      if (userType.value === "newUser") {
        if (clubRoles.includes(user.role_type)) {
          user.user_type = "CLUB";
        } else if (districtRoles.includes(user.role_type)) {
          user.user_type = "DISTRICT";
        }
        await userApi.createProspectUser(user);
        handleSuccess(langTranslations.value.toastSucessCreateProspect, true);
      } else {
        await userApi.createNewUser(user);
        handleSuccess(langTranslations.value.toastSuccess);
      }
    }
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
          tableView: "clubAdmins",
        },
      });
      return;
    case "myProfile":
      return;
    case "newAccount":
      router.push({ name: "UserLogin" });
      return;
    default:
      router.go(0);
      return;
  }
};

const choosenDistrictError = computed((): string => {
  const exempt: Array<FormTypes> = [
    "siteAdminClub",
    "districtAdmin",
    "siteAdminDistrict",
    "clubAdmin",
  ];
  if (
    !exempt.includes(formType.value) &&
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

const getErrorMessage = (validationObject: string) => {
  const error = v$.value[validationObject]
    ? v$.value[validationObject].$errors[0]
    : undefined;
  return error ? error.$message.toString() : undefined;
};
</script>

<template>
  <!-- User form banner -->
  <Banners
    v-if="formType === 'newAccount'"
    :banner-text="langTranslations.createNewAccountBanner"
  />
  <form
    @submit.prevent
    :class="{
      'w-10/12 m-auto': formType === 'newAccount',
    }"
  >
    <H2
      v-if="formType !== 'myProfile' && formType !== 'newAccount'"
      class="text-center"
      :content="langTranslations.userFormHeader"
    />
    <Hr v-if="formType != 'newAccount'" />
    <div class="flex-block flex-col items-center justify-center">
      <p
        v-if="chosenDistrict === '' && chosenClub === '' && userId === ''"
        id="error"
        class="mt-2 text-md text-nearBlack"
      >
        <span class="font-bold">{{ chosenDistrictError[languagePref] }}</span>
      </p>
      <BaseSelect
        v-else-if="userType === 'districtAdmin' || userType === 'newUser'"
        class="w-1/2"
        :label="langTranslations.userForm.districtSelectLabel"
        :options="[...districtMap.keys()]"
        v-model="chosenDistrict"
        :errorMessage="choosenDistrictError"
        :disabled="isEdit"
      />
      <BaseSelect
        v-if="userType === 'districtAdmin' || userType === 'newUser'"
        class="w-1/2"
        :label="langTranslations.baseClubLabel"
        :options="[...clubMap.keys()]"
        v-model="chosenClub"
        :disabled="isEdit"
      />
      <!-- TODO: implications of changes to users role -->
      <BaseSelect
        v-if="formType === 'siteAdminDistrict'"
        class="w-1/2"
        v-model="user.role_type"
        :label="langTranslations.roleLabel"
        :options="districtRole.filter((role) => role !== 'Webmaster')"
        :errorMessage="getErrorMessage('role_type')"
      />
      <BaseSelect
        v-if="
          formType === 'clubAdmin' ||
          formType === 'siteAdminClub' ||
          formType === 'districtAdmin'
        "
        class="w-1/2"
        v-model="user.role_type"
        :label="langTranslations.roleLabel"
        :options="clubRoles.filter((role) => role !== 'Guest')"
        :errorMessage="getErrorMessage('role_type')"
      />
      <BaseSelect
        v-if="formType === 'newAccount'"
        class="w-1/2"
        v-model="user.role_type"
        :label="langTranslations.roleLabel"
        :options="
          districtRoles
            .filter((role) => role !== 'Webmaster')
            .concat(clubRoles.filter((role) => role !== 'Guest'))
        "
        :errorMessage="getErrorMessage('role_type')"
      />
      <!-- Club member role only -->

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
        :errorMessage="getErrorMessage('firstname')"
      />
      <BaseInput
        v-model="user.lastname"
        :label="langTranslations.userForm.lastNameLabel"
        :type="'text'"
        :errorMessage="getErrorMessage('lastname')"
      />
      <BaseInput
        v-model="user.address"
        :label="langTranslations.addressLabel"
        :type="'text'"
        :errorMessage="getErrorMessage('address')"
      />
      <BaseInput
        v-model="user.user_city"
        :label="langTranslations.cityLabel"
        :type="'text'"
        :errorMessage="getErrorMessage('user_city')"
      />
      <BaseInput
        v-model="user.user_postal"
        :label="langTranslations.postalCodeLabel"
        :type="'text'"
        :errorMessage="getErrorMessage('user_postal')"
      />
      <BaseSelect
        v-model="user.user_country"
        :label="langTranslations.countryLabel"
        :options="ResourceList.countryList"
        :errorMessage="getErrorMessage('user_country')"
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
        :errorMessage="getErrorMessage('user_province')"
      />
      <BaseInput
        v-else-if="user.user_country !== ''"
        v-model="user.user_province"
        :label="langTranslations.stateOrProvinceLabel"
        :type="'text'"
        :errorMessage="getErrorMessage('user_province')"
      />
      <BaseInput
        v-model="user.phone"
        :label="langTranslations.phone"
        :type="'text'"
        :errorMessage="getErrorMessage('phone')"
      />
      <BaseInput
        v-model="user.email"
        :label="langTranslations.email"
        :type="'email'"
        :errorMessage="getErrorMessage('email')"
      />
      <BaseInput
        v-if="!isEdit || passwordReset.resetSet"
        v-model="user.password"
        :label="langTranslations.password"
        :type="'password'"
        :errorMessage="getErrorMessage('password')"
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
