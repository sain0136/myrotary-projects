<script lang="ts">
export default {
  name: "LandingFooter",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { useSiteAssets } from "@/stores/SiteAssets";
import { Icon } from "@iconify/vue";

/* Data */
const { langTranslations } = useLanguage();
const assetsStore = useSiteAssets();

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <footer class="bg-gray-800 text-nearWhite">
    <div class="p-4 py-6 lg:py-8">
      <div class="fixed-width-container md:flex md:justify-between">
        <div class="child1 mb-6 md:mb-0 flex flex-col">
          <a
            href="https://flowbite.com/"
            class="flex items-center justify-center"
          >
            <img
              :src="
                assetsStore.siteAssets.assets.main_logo.s3UrlLink ||
                '/rotary-reserve-logo.png'
              "
              class="h-24 mr-3"
              alt="My Rotary Projects Logo"
            />
          </a>
          <div class="mt-4 text-center :md:text-left">
            {{
              assetsStore?.siteAssets?.assets?.contentManagement
                ?.myRotaryfooterDescription || ""
            }}
          </div>
        </div>
        <div
          class="child2 text-center :md:text-left grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2"
        >
          <div>
            <h2 class="mb-6 text-sm font-semibold text-nearWhite uppercase">
              {{ langTranslations.landingFooter.followUsLabel }}
            </h2>
            <ul class="text-gray-500 dark:text-gray-400 font-medium">
              <li class="mb-4 flex gap-2 justify-start flex-wrap">
                <Icon
                  :href="`mailto:${assetsStore.siteAssets.assets.contentManagement.myRotaryEmail}`"
                  icon="ic:round-email"
                  class="text-2xl text-primary cursor-pointer hover:text-nearWhite"
                />
                <span class="flex justify-start">{{
                  assetsStore?.siteAssets?.assets?.contentManagement
                    ?.myRotaryEmail || ""
                }}</span>
              </li>
              <li class="mb-4 flex gap-2 justify-start flex-wrap">
                <Icon
                  :href="`mailto:${assetsStore.siteAssets.assets.contentManagement.myRotaryEmail}`"
                  icon="ph:phone-fill"
                  class="text-2xl text-primary cursor-pointer hover:text-nearWhite"
                />
                <span class="flex justify-start">{{
                  assetsStore?.siteAssets?.assets?.contentManagement
                    ?.myRotaryPhone || ""
                }}</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 class="mb-6 text-sm font-semibold text-nearWhite uppercase">
              {{ langTranslations.landingFooter.legalHeaderLabel }}
            </h2>
            <ul class="text-gray-500 dark:text-gray-400 font-medium">
              <div class="mb-4">
                <router-link :to="{ name: '' }">
                  <span href="#" class="hover:underline">{{
                    langTranslations.landingFooter.privacyPolicyLabel
                  }}</span>
                </router-link>
              </div>
              <div class="mb-4">
                <router-link :to="{ name: '' }">
                  <a href="#" class="hover:underline">{{
                    langTranslations.landingFooter.termsOfUseLabel
                  }}</a>
                </router-link>
              </div>
            </ul>
          </div>
        </div>
      </div>
      <hr class="my-6 border-gray-200 sm:mx-auto lg:my-8" />
      <div
        class="fixed-width-container flex flex-col items-center sm:flex-row sm:items-center sm:justify-between"
      >
        <div
          class="w-full mx-auto max-w-screen-xl text-center p-4 md:flex md:items-center md:justify-between"
        >
          <span class="text-gray-500 font-bold">
            {{
              langTranslations.adminDash.footerCopyright +
              " " +
              new Date().getFullYear() +
              " " +
              "MyRotaryProjects"
            }}
          </span>
        </div>
        <div class="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
          <a
            href="https://www.facebook.com/rotary"
            title="Rotary International on Facebook"
          >
            <Icon
              icon="cib:facebook"
              class="text-2xl text-gray-500 hover:text-nearWhite"
            />
          </a>
          <a
            title="Rotary International on Twitter"
            href="https://twitter.com/Rotary?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
          >
            <Icon
              icon="simple-icons:x"
              class="text-2xl text-gray-500 hover:text-nearWhite"
          /></a>
          <a
            title="Rotary International on Instagram"
            href="https://www.instagram.com/rotaryinternational/?hl=en"
          >
            <Icon
              icon="ri:instagram-fill"
              class="text-2xl text-gray-500 hover:text-nearWhite"
            />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.child1 {
  flex: 0 0 40%;
}
.child2 {
  flex: 0 0 50%;
}
</style>
