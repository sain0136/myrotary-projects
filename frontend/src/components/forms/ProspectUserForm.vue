<script lang="ts">
export default {
  name: "ProspectUserForm",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref, watch } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { useVuelidate } from "@vuelidate/core";
import router from "@/router";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import H2 from "@/components/headings/H2.vue";
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
import type { IUser } from "@/utils/interfaces/IUser";
/* Types */

/* Data */
const route = useRoute();
const { langTranslations, languagePref, customPrintf } = useLanguage();
// Route data -- When using form from url
const userId = ref(route.params.userId);
const clubId = ref(route.query.clubId ?? null);
const isEdit = ref(route.query.isEdit ? true : false);

// Component data -- When using form from component
const { userIdProp, clubIdProp, isEditProp } =
  defineProps<{
    userIdProp?: string;
    clubIdProp?: string; 
    isEditProp?: boolean;
  }>();
userId.value = userIdProp ? userIdProp : userId.value;
clubId.value = clubIdProp ? clubIdProp : clubId.value;
isEdit.value = isEditProp ? isEditProp : isEdit.value;

const user = reactive(new User());
const { handleError, handleSuccess, handleInfo, handleValidationForm, } = errorHandler();
const userApi = new UsersApi(new ApiClient());
const clubApi = new ClubApi(new ApiClient());
const districtApi = new DistrictApi(new ApiClient());
// TODO: Verify later district names are unique in db
const districtMap = reactive<Map<string, number>>(new Map());
const chosenDistrict = ref("");
let prospectUserDistrictName:string
const chosenDistrictError = ref({
  en: "Must assign Admin to a District and Base Club",
  fr: "Doit assigner un Admin a un District et un Club",
});
const clubMap = reactive<Map<string, number>>(new Map());
const userTitle = ref("");
let prospectUserClubName: string

const maxLengthPostal = {
  en: "Must be at most 32 characters",
  fr: "Doit contenir au plus 32 caractères",
};

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

//Dinamically update clubMap based on changes to chosenDistrict
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
    if (userId.value) {
      const response = await userApi.getUser(parseInt(userId.value as string));
      Object.assign(user, response);
      prospectUserDistrictName = (await districtApi.getById(user.district_id)).district_name
      prospectUserClubName = (await clubApi.getById(user.club_id)).club_name

      const role = user.role ? user.role : user.role ? user.role : "";
      userTitle.value = role + ": " + user.fullName;
      user.role_type = role;  
    }
  } catch (error) {
    handleError(error as CustomErrors);
  }
});

/* Methods */
const approveUser = async(user:IUser) => {
user.is_prospect = false
await userApi.updateUser(user)
}

const denyUser = async(user:IUser) => {
  //TODO: Grab user.email address and send e-mail notification
  await userApi.deleteUser(user.user_id)
}

const redirect = () => {
    router.push({name:"ProspectUsers"})
    return;
};
</script>

<template>
  <form @submit.prevent class="">
     <!-- Form header -->
     <!-- TODO: Add prospect user header -->
    <H2
      class="text-center"
      :content="langTranslations.userFormHeader" 
    />
    <div class="flex-block flex-col items-center justify-center">
      <BaseInput
      v-model="prospectUserDistrictName"
        :label="langTranslations.prospectUserForm.districtLabel"
        :type="'text'"
        :disabled="true"
      />
      <BaseInput
      v-model="prospectUserClubName"
        :label="langTranslations.baseClubLabel"
        :type="'text'"
        :disabled="true"
      />
      <!--Right now, Only DistrictRole are being accepted. Add support for ClubRole to? check commonTypes.ts -->
      <BaseInput
      v-model="user.role" 
        :label="langTranslations.roleLabel"
        :type="'text'"
        :disabled="true"
      />
    </div>
    <div class="form-block">
      <BaseInput
        v-model="user.firstname"
        :label="langTranslations.userForm.firstNameLabel"
        :type="'text'"
        :errorMessage="v$.firstname?.$errors[0]?.$message as string | undefined"
        :disabled="true"
      />
      <BaseInput
        v-model="user.lastname"
        :label="langTranslations.userForm.lastNameLabel"
        :type="'text'"
        :errorMessage="v$.lastname?.$errors[0]?.$message as string | undefined"
        :disabled="true"
      />
      <BaseInput
        v-model="user.address"
        :label="langTranslations.addressLabel"
        :type="'text'"
        :errorMessage="v$.address?.$errors[0]?.$message as string | undefined"
        :disabled="true"
      />
      <BaseInput
        v-model="user.user_city"
        :label="langTranslations.cityLabel"
        :type="'text'"
        :errorMessage="v$.user_city?.$errors[0]?.$message as string | undefined"
        :disabled="true"
      />
      <BaseInput
        v-model="user.user_postal"
        :label="langTranslations.postalCodeLabel"
        :type="'text'"
        :errorMessage="v$.user_postal?.$errors[0]?.$message as string | undefined"
        :disabled="true"
      />
      <BaseSelect
        v-model="user.user_country"
        :label="langTranslations.countryLabel"
        :options="ResourceList.countryList"
        :errorMessage="v$.user_country?.$errors[0]?.$message as string | undefined"
        :disabled="true"
      />
      <BaseInput
        v-model="user.user_province"
        :label="langTranslations.stateOrProvinceLabel"
        :type="'text'"
        :errorMessage="v$.user_province?.$errors[0]?.$message as string | undefined"
        :disabled="true"
      />
      <BaseInput
        v-model="user.phone"
        :label="langTranslations.phone"
        :type="'text'"
        :errorMessage="v$.phone?.$errors[0]?.$message as string | undefined"
        :disabled="true"
      />
      <BaseInput
        v-model="user.email"
        :label="langTranslations.email"
        :type="'email'"
        :errorMessage="v$.email?.$errors[0]?.$message as string | undefined"
        :disabled="true"
      />
    </div>
    <!--Approval, Denial, Cancel buttons-->
    <div class="button_row mt-4 flex justify-center gap-4">
      <RotaryButton
        :theme="'primary'"
        :label="langTranslations.approveLabel"
        @click="
          async () => {
            await approveUser(user);
            handleSuccess(langTranslations.toastSucessApproveProspect,true);
            redirect()
          }
        "
      />
      <RotaryButton
        :theme="'primary'"
        :label="langTranslations.denyLabel"
        @click="
          async () => {
            await denyUser(user)
            handleInfo(langTranslations.toastDenyProspect,true);
            redirect()
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
