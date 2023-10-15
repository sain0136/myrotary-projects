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
import FilterTab from "@/modules/home/components/landinghome/FilterTab.vue";

/* Data */
const { langTranslations } = useLanguage();

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <Banners :banner-text="langTranslations.landingpageBannerText" />
  <div class="container">
    <div
      class="mt-8 md:pr-4 flex justify-center md:justify-end"
      id="viewButton"
    >
      <RotaryButton :label="'View'" :theme="'secondary'" />
    </div>
    <main class="landing-grid">
      <FilterTab />
      <div class="project-cards">
        <div class="h-60 bg-black"></div>
        <div class="h-60 bg-black"></div>
        <div class="h-60 bg-black"></div>
      </div>
    </main>
    <section id="paginationrow" class="landing-grid">
      <div></div>
      <div class="flex justify-center items-center">
        <div class="flex justify-center">
          <!-- Previous Button -->
          <!-- @click="handlePageChange('previous')"
        v-if="currentPage > 1" -->
          <a
            href="#"
            class="flex items-center justify-center px-3 h-8 mr-3 text-sm font-medium text-nearWhite bg-nearBlack hover:bg-primaryHover focus:ring-primaryFocus rounded-lg"
          >
            <svg
              class="w-3.5 h-3.5 mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 5H1m0 0 4 4M1 5l4-4"
              />
            </svg>
            {{ langTranslations.prevButtonLabel }}
          </a>
          <!--         @click="handlePageChange('next')"
        v-if="currentPage !== lastPage" -->
          <a
            href="#"
            class="flex items-center justify-center px-3 h-8 text-sm font-medium text-nearWhite bg-nearBlack hover:bg-primaryHover focus:ring-primaryFocus rounded-lg"
          >
            {{ langTranslations.nextButtonLabel }}
            <svg
              class="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
#paginationrow {
  height: 5rem;
}
@import "@/assets/_variables.scss";
.container {
  width: 100%;
  max-width: $wideDesktop;
  margin: 0 auto;
}
.landing-grid {
  display: grid;
  grid-template-columns: [first] 100%;
  grid-template-rows: [row1-start] 100%;
  @media screen and (min-width: $tablet) {
    display: grid;
    grid-template-columns: [first] 25% [second] 75%;
    grid-template-rows: [row1-start] 100%;
  }
  @media screen and (max-width: $smallMobile) {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
}

.project-cards {
  padding: 0 1rem;
  @media screen and (max-width: $smallMobile) {
    display: grid;
    grid-column: first;
    grid-row: row1-start;
    row-gap: 1rem;
  }
  @media screen and (min-width: $tablet) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 1rem;
    column-gap: 1rem;
  }
  @media screen and (min-width: $desktop) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    row-gap: 4rem;
    column-gap: 1rem;
  }
}
</style>
