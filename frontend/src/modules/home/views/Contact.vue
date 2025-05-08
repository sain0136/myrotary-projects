<script lang="ts">
export default {
  name: "Contact",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import Banners from "@/components/banners/Banners.vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import BaseTextarea from "@/components/form/BaseTextarea.vue";
import BaseInput from "@/components/form/BaseInput.vue";
import type { IEmail } from "@/utils/interfaces/IMail";
import H2 from "@/components/headings/H2.vue";
import H3 from "@/components/headings/H2.vue";
import { useSiteAssets } from "@/stores/SiteAssets";
import { Icon } from "@iconify/vue";
import { useVuelidate } from "@vuelidate/core";
import { MailApi } from "@/api/services/MailApi";
import { ApiClient } from "@/api/ApiClient";
import { CustomErrors } from "@/utils/classes/CustomErrors";
import { helpers, maxLength, required, email } from "@vuelidate/validators";

/* Data */
const { langTranslations, languagePref, customPrintf } = useLanguage();
const { handleError, handleSuccess } = errorHandler();
const assetsStore = useSiteAssets();
const mailApi = new MailApi(new ApiClient());
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
const submitEmail = async () => {
  try {
    const isFormValid = await v$.value.$validate();
    if (!isFormValid) {
      return;
    }
    await mailApi.sendMail(mail as IEmail);
    handleSuccess(langTranslations.value.toastSuccess);
    mail.senderEmail = "";
    mail.senderName = "";
    mail.messageBody.message = "";
    v$.value.$reset();
  } catch (error) {
    handleError(error as CustomErrors);
  }
};

const getErrorMessage = (validationObject: string) => {
  const error = v$.value[validationObject]
    ? v$.value[validationObject].$errors[0]
    : undefined;
  return error ? error.$message.toString() : undefined;
};
</script>

<template>
  <Banners :banner-text="langTranslations.contactusBannerText" />
  <section class="fluid-container">
    <form @submit.prevent class="">
      <div
        class="my-8 flex flex-col md:flex-row items-center justify-center gap-8"
      >
        <div class="flex flex-1 flex-col">
          <H3
            class="text-center"
            :content="langTranslations.contactPage.calloutMessage"
          />
          <p class="text-gray-400 text-center mt-4">
            {{ langTranslations.contactPage.calloutDescription }}
          </p>
          <div class="form-block">
            <BaseInput
              v-model="mail.senderName"
              :label="langTranslations.nameLabel"
              :type="'text'"
              :errorMessage="getErrorMessage('senderName')"
            />
            <BaseInput
              v-model="mail.senderEmail"
              :label="langTranslations.email"
              type="email"
              :errorMessage="getErrorMessage('senderEmail')"
            />
          </div>
          <div class="textarea-block">
            <BaseTextarea
              :rows="10"
              v-model="mail.messageBody.message"
              :label="langTranslations.messageLabel"
              :errorMessage="getErrorMessage('messageBody')"
            />
          </div>
          <div class="pl-3 flex justify-center md:justify-normal">
            <RotaryButton
              :theme="'primary'"
              :label="langTranslations.submit"
              @click="submitEmail"
            />
          </div>
        </div>
        <div class="flex flex-1 flex-col gap-4 items-center justify-center">
          <H3
            class="text-center"
            :content="langTranslations.contactPage.contactDetailsTitle"
          />
          <ul class="info flex flex-col justify-center items-center gap-4">
            <li class="flex w-full">
              <div class="flex mt-2 gap-1">
                <Icon
                  class="text-3xl text-gray-500"
                  icon="clarity:email-solid"
                />
                <h6 class="m-auto">{{ langTranslations.email + ":" }}</h6>
                <span class="text-primary-color m-auto">{{
                  assetsStore.$state.siteAssets.assets.contentManagement
                    .myRotaryEmail[languagePref] || "N/A"
                }}</span>
              </div>
            </li>
            <li
              v-if="
                assetsStore.$state.siteAssets.assets.contentManagement
                  .myRotaryPhone[languagePref]
              "
              class="flex w-full"
            >
              <div class="flex mt-2 gap-1 justify-center items-center">
                <Icon class="text-3xl text-gray-500" icon="ph:phone-fill" />
                <h6>{{ langTranslations.phone + ":" }}</h6>
                <span class="text-primary-color">{{
                  assetsStore.$state.siteAssets.assets.contentManagement
                    .myRotaryPhone[languagePref] || "N/A"
                }}</span>
              </div>
            </li>
            <li class="flex w-full">
              <div class="flex mt-2 gap-1 justify-center items-center">
                <Icon class="text-3xl text-gray-500" icon="entypo:address" />
                <h6>{{ langTranslations.addressLabel + ":" }}</h6>
                <span class="text-primary-color">{{
                  assetsStore.$state.siteAssets.assets.contentManagement
                    .myRotaryAddress[languagePref] || "N/A"
                }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </form>
  </section>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

</style>
