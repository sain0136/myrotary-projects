<script lang="ts">
export default {
  name: "PrivacyPolicy",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import H3 from "@/components/headings/H3.vue";
import H4 from "@/components/headings/H4.vue";
import { useSiteAssets } from "@/stores/SiteAssets";
import Banners from "@/components/banners/Banners.vue";

/* Data */
const { langTranslations, languagePref } = useLanguage();
const { handleError } = errorHandler();
const assetsStore = useSiteAssets();

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <!-- Sample for show - hardcoded for now   -->
  <Banners :banner-text="'Privacy Policy'" />
  <div class="text-center flex flex-col">
    <div class="my-8 gap-4 flex flex-col privacy-policy">
      <section>
        <H4 :content="'Introduction'" />
        <p>
          Welcome to MyRotary Projects. This privacy policy explains how we
          collect, use, and protect your personal information.
        </p>
      </section>

      <section>
        <H4 :content="'Personal Information Collected'" />
        <p>
          We collect information such as your name, email address, and any other
          information you provide when using our services.
        </p>
      </section>

      <section>
        <H4 :content="'How We Use Your Personal Information'" />
        <p>
          The data collected is used to provide and improve our services,
          communicate with you, and ensure a secure experience.
        </p>
      </section>

      <section>
        <H4 :content="'Data Storage and Security'" />
        <p>
          Your data is securely stored on our servers. We employ
          industry-standard security measures to protect against unauthorized
          access or loss.
        </p>
      </section>

      <section>
        <H4 :content="'Cookies and Tracking Technologies'" />
        <p>
          We use cookies to enhance your browsing experience, understand user
          activity, and facilitate certain features of our website.
        </p>
      </section>

      <section>
        <H4 :content="'Third-Party Services'" />
        <p>
          We do not share your personal data with third parties except as
          required to provide our services or as required by law.
        </p>
      </section>

      <section>
        <H4 :content="'Your Rights'" />
        <p>
          You have the right to access, correct, or delete your personal
          information. Please contact us for any such requests.
        </p>
      </section>

      <section>
        <H4 :content="'Policy Updates'" />
        <p>
          We may update this policy from time to time. All changes will be
          posted on this page.
        </p>
      </section>

      <section>
        <H4 :content="'Contact Us'" />
        <p>
          For any privacy-related questions, please contact us at
          {{
            assetsStore.siteAssets.assets.contentManagement.myRotaryEmail[
              languagePref
            ]
          }}.
        </p>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
