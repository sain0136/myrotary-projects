<script lang="ts">
export default {
  name: "About",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { useSiteAssets } from "@/stores/SiteAssets";
import Banners from "@/components/banners/Banners.vue";

/* Data */
const { langTranslations, languagePref } = useLanguage();
const assetsStore = useSiteAssets();

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <Banners :banner-text="langTranslations.aboutpageBannerText" />

  <section
    class="flex items-center py-10 bg-stone-100 xl:h-screen font-poppins"
  >
    <div class="justify-center flex-1 max-w-6xl py-4 mx-auto lg:py-6 md:px-6">
      <div class="flex flex-wrap">
        <div class="w-full px-4 mb-10 lg:w-1/2 lg:mb-0">
          <div class="relative">
            <img
              src="https://i.postimg.cc/QtyYkbxp/pexels-andrea-piacquadio-927022.jpg"
              alt=""
              class="relative z-40 object-cover w-full h-96 lg:rounded-tr-[80px] lg:rounded-bl-[80px] rounded"
            />
            <div
              class="absolute z-10 hidden w-full h-full bg-primary rounded-bl-[80px] rounded -bottom-6 right-6 lg:block"
            ></div>
          </div>
        </div>
        <div class="w-full px-4 mb-10 lg:w-1/2 lg:mb-0">
          <div class="relative">
            <h1
              class="absolute -top-20 left-0 text-[20px] lg:text-[100px] text-gray-900 font-bold opacity-5 md:block hidden"
            >
              {{ langTranslations.aboutLabel }}
            </h1>
            <h1
              class="pl-2 text-3xl font-bold border-l-8 border-primary md:text-5xl dark:text-white"
            >
              {{ langTranslations.welcomeToMyRotaryProjects }}
            </h1>
          </div>
          <p
            class="mt-6 mb-10 text-base leading-7 text-gray-500 dark:text-gray-400"
          >
            {{
              assetsStore?.siteAssets?.assets?.contentManagement?.myRotaryAbout[
                languagePref
              ] || ""
            }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
