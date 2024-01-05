<script lang="ts">
export default {
  name: "TermsAndConditions",
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
const assetsStore = useSiteAssets();
const { langTranslations, languagePref } = useLanguage();
const { handleError } = errorHandler();
// const { exampleProperty } = defineProps<{
//   exampleProperty: string;
// }>();

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <!-- Sample for show - hardcoded for now   -->
  <Banners :banner-text="'Terms and Conditions'" />
  <div class="text-center flex flex-col">
    <div class="terms-conditions my-8 gap-4 flex flex-col">
      <section>
        <H4 :content="'Introduction'" />
        <p>
          By accessing and using MyRotary Projects, you agree to these Terms and
          Conditions.
        </p>
      </section>

      <section>
        <H4 :content="'Use of the Service'" />
        <p>
          Our service is intended for lawful purposes only. Any misuse or
          unauthorized access is strictly prohibited.
        </p>
      </section>

      <section>
        <H4 :content="'Account Responsibilities'" />
        <p>
          Users are responsible for maintaining the confidentiality of their
          account information and for all activities under their account.
        </p>
      </section>

      <section>
        <H4 :content="'Content Ownership and Copyright'" />
        <p>
          All content provided on the site is the property of MyRotary Projects
          or its content suppliers and protected by intellectual property laws.
        </p>
      </section>

      <section>
        <H4 :content="'Modifications to the Service'" />
        <p>
          We reserve the right to modify or discontinue the service with or
          without notice to the user.
        </p>
      </section>

      <section>
        <H4 :content="'Disclaimer of Warranties'" />
        <p>
          The service is provided "as is" without any express or implied
          warranties of any kind.
        </p>
      </section>

      <section>
        <H4 :content="'Limitation of Liability'" />
        <p>
          MyRotary Projects shall not be liable for any damages arising out of
          the use or inability to use the service.
        </p>
      </section>

      <section>
        <H4 :content="'Governing Law'" />
        <p>
          These terms shall be governed by and construed in accordance with the
          laws of the jurisdiction in which MyRotary Projects operates.
        </p>
      </section>

      <section>
        <H4 :content="'Contact Information'" />
        <p>
          For any questions regarding these Terms and Conditions, please contact
          us at
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
