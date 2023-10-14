<script lang="ts">
export default {
  name: "LandingHome",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import Banners from "@/components/banners/Banners.vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
/* Data */
const { langTranslations } = useLanguage();

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <Banners :banner-text="langTranslations.landingpageBannerText" />
  <div class="mt-8 md:mr-24 flex justify-center md:justify-end" id="viewButton">
    <RotaryButton :label="'View'" :theme="'secondary'" />
  </div>
  <main class="landing-grid"></main>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.landing-grid {
  height: 1000px;
  display: grid;
  grid-template-columns: [first] 100%;
  grid-template-rows: [row1-start] 100%;
  @media screen and (min-width: $tablet) {
    display: grid;
    grid-template-columns: [first] 25% [second] 75%;
    grid-template-rows: [row1-start] 100%;
  }
  @media screen and (max-width: $smallMobile) {
    grid-column: first;
    grid-row: row1-start;
  }
}
</style>
