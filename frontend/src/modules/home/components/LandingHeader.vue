<script lang="ts">
export default {
  name: "LandingHeader",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { computed, onMounted, ref, type Ref } from "vue";
import { useSiteAssets } from "@/stores/SiteAssets";
import { Icon } from "@iconify/vue";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { logoutUser } from "@/utils/utils";

/* Data */
const { langTranslations, setLanguage, languagePref } = useLanguage();
const assetsStore = useSiteAssets();
const showMenu = ref(false);
interface NavLink {
  label: string;
  link: string;
  disabled?: boolean;
}

//Array of links/buttons to be displayed in the navigation bar
//label: the text displayed on the button
//link: the path to navigate to when the button is clicked (needs to match what's in the router file)
const navLinks: Ref<NavLink[]> = computed(() => [
  {
    label: langTranslations.value.home,
    link: "Home",
  },
  {
    label: langTranslations.value.aboutLabel,
    link: "About",
  },
  {
    label: langTranslations.value.statsLabel,
    link: "Stats",
  },
  {
    label: langTranslations.value.contactusBannerText,
    link: "Contact",
  },
]);

/* Hooks */
onMounted(async () => {});

/* Methods */
const changeLanguage = () => {
  if (languagePref.value === "en") {
    setLanguage("fr");
  } else {
    setLanguage("en");
  }
};

const logout = async () => {
   logoutUser("Home");
};
</script>

<template>
  <div class="header_top bg-primary py-4">
    <div
      class="fixed-width-container flex flex-col items-center gap-4 md:flex-row md:justify-between"
    >
      <ul class="flex justify-center pl-4">
        <li class="flex text-primary-white gap-4">
          <a
            :href="`mailto:${assetsStore.siteAssets.assets.contentManagement.myRotaryEmail[languagePref]}`"
            :title="langTranslations.sendEmailLabel"
          >
            <Icon
              icon="dashicons:email-alt"
              class="text-3xl cursor-pointer hover:text-nearWhite"
          /></a>
          <span class="icon fa fa-envelope mr-1 font-bold m-auto">{{
            assetsStore.siteAssets.assets.contentManagement.myRotaryEmail[
              languagePref
            ] || ""
          }}</span>
        </li>
      </ul>
      <ul class="social-icon-one flex gap-8 pr-4">
        <li class="li_border">
          <a
            target="_blank"
            href="https://www.facebook.com/rotary"
            title="Rotary International on Facebook"
          >
            <Icon
              icon="cib:facebook"
              class="text-3xl hover:text-3xl hover:text-white"
            />
          </a>
        </li>
        <li class="li_border">
          <a
            target="_blank"
            title="Rotary International on Twitter"
            href="https://twitter.com/Rotary?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
          >
            <Icon
              target="_blank"
              icon="simple-icons:x"
              class="text-3xl hover:text-3xl hover:text-white"
          /></a>
        </li>
        <li class="li_border">
          <a
            title="Rotary International on Instagram"
            href="https://www.instagram.com/rotaryinternational/?hl=en"
          >
            <Icon
              icon="ri:instagram-fill"
              class="text-3xl hover:text-3xl hover:text-white"
            />
          </a>
        </li>
      </ul>
    </div>
  </div>
  <nav
    class="border-nearBlack bg-primary-white px-2 py-2.5 sm:px-4 border-b-2 border-solid"
  >
    <div
      class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
    >
      <div class="flex items-center">
        <img
          :src="
            assetsStore.siteAssets.assets.main_logo.s3UrlLink ||
            assetsStore.siteAssets.assets.main_logo.s3BaseUrlLink ||
            '/rotary-reserve-logo.png'
          "
          class="h-14 mr-3"
          alt="My Rotary Projects Main Logo"
        />
      </div>
      <button
        @click="showMenu = !showMenu"
        data-collapse-toggle="navbar-default"
        type="button"
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        aria-controls="navbar-default"
        aria-expanded="false"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>
      <div
        class="w-full md:block md:w-auto"
        :class="showMenu ? 'block' : 'hidden'"
        id="navbar-default"
      >
        <ul
          class="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg bg-nearWhite md:flex-row md:space-x-8 md:mt-0 md:border-0"
        >
          <li v-for="item in navLinks" :key="item.link">
            <!--This creates clickable links to the different pages, containing the name of the button and the path to the page -->
            <router-link v-if="!item.disabled" :to="{ name: item.link }">
              <!--Path-->
              <span
                href="#"
                class="block py-2 pl-3 pr-4 font-bold text-gray-900 rounded hover:text-primary"
                aria-current="page"
                >{{ item.label }}
                <!--Header Names--></span
              >
            </router-link>
          </li>
          <li v-if="!useLoggedInUserStore().isUserLoggedIn">
            <router-link :to="{ name: 'UserLogin' }">
              <span
                href="#"
                class="block py-2 pl-3 pr-4 font-bold text-gray-900 rounded hover:text-primary"
                aria-current="page"
                >{{ langTranslations.loginLabel }}</span
              >
            </router-link>
          </li>
          <li v-if="useLoggedInUserStore().isUserLoggedIn">
            <a
              class="block py-2 pl-3 pr-4 font-bold text-gray-900 rounded hover:text-primary"
              href=""
              @click="logout()"
            >
              {{ langTranslations.logoutLabel }}
            </a>
          </li>
          <li v-if="useLoggedInUserStore().isUserLoggedIn">
            <router-link :to="{ name: 'AdminWelcome' }">
              <span
                href="#"
                class="block py-2 pl-3 pr-4 font-bold text-gray-900 rounded hover:text-primary"
                aria-current="page"
                >{{ langTranslations.adminDash.headerDashboard }}</span
              >
            </router-link>
          </li>
          <li>
            <RotaryButton
              :label="
                languagePref === 'en'
                  ? langTranslations.french
                  : langTranslations.english
              "
              :theme="'secondary'"
              @click="changeLanguage()"
            />
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
