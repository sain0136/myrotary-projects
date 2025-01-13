<script lang="ts">
export default {
  name: "AdminWelcome",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import H1 from "@/components/headings/H1.vue";

/* Data */
const { langTranslations } = useLanguage();
</script>

<template>
  <section
    class="h-full justify-center text-center gap-4 flex items-center flex-col"
  >
    <H1 :content="langTranslations.adminDash.welcomeH1" />
    <img src="/rotary-logo.svg" alt="" class="w-32 h-32" />
    <router-link :to="{ name: 'Home' }">
      <a href="#" class="hover:underline">{{
        langTranslations.landingPage.backLabel
      }}</a>
    </router-link>
  </section>
</template>

<style lang="scss" scoped></style>
