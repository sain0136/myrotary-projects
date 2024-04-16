<script lang="ts">
export default {
  name: "CreateAccount",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import BaseTextarea from "@/components/form/BaseTextarea.vue";
import BaseInput from "@/components/form/BaseInput.vue";
import type { IEmail } from "@/utils/interfaces/IMail";
import { useSiteAssets } from "@/stores/SiteAssets";
import { useVuelidate } from "@vuelidate/core";
import { MailApi } from "@/api/services/MailApi";
import { ApiClient } from "@/api/ApiClient";
import { CustomErrors } from "@/utils/classes/CustomErrors";
import { helpers, maxLength, required, email } from "@vuelidate/validators";
import UserForm from "@/components/forms/UserForm.vue";
import router from "@/router";

/* Data */
const { langTranslations, languagePref, customPrintf } = useLanguage();
const { handleError, handleSuccess } = errorHandler();
const assetsStore = useSiteAssets();

const userType = 'newUser' 
const formType = 'newAccount' 
const mail = reactive({
  senderEmail: "",
  senderName: "",
  subject: "Rotary Enquiry from Guest:",
  messageBody: {
    message: "",
    senderMeta: true,
    messageIntructions:
      "Click link to reply or just click reply to reply to the actual sender: \n",
  },
});

const rules = {
  senderEmail: {
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
  senderName: {
    required: helpers.withMessage(
      langTranslations.value.formErorrText.required,
      required
    ),
  },
  messageBody: {
    message: {
      required: helpers.withMessage(
        langTranslations.value.formErorrText.required,
        required
      ),
      maxLength: helpers.withMessage(
        customPrintf(langTranslations.value.maxLengthMessage, "1000"),
        maxLength(1000)
      ),
    },
  },
};
const v$ = useVuelidate(rules, mail);

/* Hooks */
onMounted(async () => {});

/* Methods */

</script>

<template>
  <UserForm
  :user-type-prop="userType"
  :form-type-prop="formType"
  />
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.icon {
  // padding: 1rem;
  // width: 2rem;
  // height: 2rem;
  // font-size: 1rem;
  // color: #cdcdcd;
  // border-radius: 50%;
  // text-align: center;
  // border: 0.1rem solid #a7a7a7;
  // margin-right: 2rem;
}
</style>
