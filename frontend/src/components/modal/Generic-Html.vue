<script lang="ts">
export default {
  name: "template",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";

/* Data */
const { langTranslations } = useLanguage();
const route = useRoute();
const htmlString = ref<null | string>(null);

/* Hooks */
onMounted(async () => {
  const routeName = route.name;
  switch (routeName) {
    case "TermsOfService":
      htmlString.value =
        langTranslations.value.stripeSubscription.termsOfServiceText;
      break;
    case "SubscriptionsPrivacyPolicy":
      htmlString.value =
        langTranslations.value.stripeSubscription.privacyPolicyText;
      break;

    default:
      router.push({ name: "Home" });
  }
});

/* Methods */
</script>

<template>
  <div class="bg-primary h-screen text-lg" v-html="htmlString"></div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
