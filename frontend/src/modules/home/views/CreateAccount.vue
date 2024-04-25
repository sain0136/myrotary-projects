<script lang="ts">
export default {
  name: "CreateAccount",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { helpers, maxLength, required, email } from "@vuelidate/validators";
import UserForm from "@/components/forms/UserForm.vue";

/* Data */
const { langTranslations, customPrintf } = useLanguage();

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
</style>
