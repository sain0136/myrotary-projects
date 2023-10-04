<script lang="ts">
export default {
  name: "UserForm",
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
import { UsersApi } from "@/api/services/UserApi";
import { ApiClient } from "@/api/ApiClient";
import type { CustomError } from "@/utils/classes/CustomError";
import { useRoute } from "vue-router";
import User from "@/utils/classes/User";

/* Data */
const route = useRoute();
const { langTranslations } = useLanguage();
const userId = route.params.userId;
const userType = route.query.userType;
const user = reactive(new User());
const { handleError, handleSuccess, handleValidationForm } = errorHandler();
const userApi = new UsersApi(new ApiClient());
const submitLabel = userId
  ? {
      en: "Update",
      fr: "Modifier",
    }
  : {
      en: "Submit",
      fr: "Soumettre",
    };

/* Validations */
const rules = {};
const v$ = useVuelidate(rules, user);

/* Hooks */
onMounted(async () => {
  if (userId) {
    try {
      const response = await userApi.getUser(parseInt(userId as string));
      Object.assign(user, response);
    } catch (error) {
      handleError(error as CustomError);
    }
  }
});

/* Methods */
</script>

<template>
  <form @submit.prevent class="">
    <H2 class="text-center" :content="langTranslations.userFormHeader" />
    <Hr />
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
    </div>
  </form>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
