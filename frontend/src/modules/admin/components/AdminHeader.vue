<script lang="ts">
export default {
  name: "AdminHeader",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import router from "@/router";
import { useLoggedInDistrict } from "@/stores/LoggedInDistrict";
import { useLoggedInClub } from "@/stores/LoggedInClub";
import { CustomErrors } from "@/utils/classes/CustomErrors";
import { errorHandler } from "@/utils/composables/ErrorHandler";

/* Data */
const showSub = ref(false);
const userStore = useLoggedInUserStore();
const districtStore = useLoggedInDistrict();
const clubStore = useLoggedInClub();
const { handleError, handleSuccess, handleValidationForm } = errorHandler();
defineEmits(["update:modelValue"]);
defineProps<{
  drawerVal: boolean;
}>();
const { langTranslations, languagePref, setLanguage, availabileLanguages } =
  useLanguage();
const show = ref(false);
const rootElement = ref<HTMLElement | null>(null);

/* Hooks */
onMounted(async () => {});
onBeforeUnmount(() => {
  // Cleanup: Remove event listener to avoid memory leaks
  document.removeEventListener("click", hideDropdown);
});
/* Methods */
const changeLanguage = (pref: "en" | "fr") => {
  showSub.value = false;
  languagePref.value = pref;
  const lang = pref;
  setLanguage(lang);
};

const toggleDropdown = () => {
  show.value = !show.value;
  showSub.value = false;
  if (show.value) {
    document.addEventListener("click", hideDropdown);
  } else {
    document.removeEventListener("click", hideDropdown);
  }
};

const hideDropdown = (event: Event): void => {
  const target = event.target as Node;
  if (rootElement.value && !rootElement.value.contains(target)) {
    show.value = false;
    document.removeEventListener("click", hideDropdown);
  }
};

const logoutAdmin = async () => {
  try {
    userStore.logOut();
    districtStore.resetDistrict();
    clubStore.resetClub();
  } catch (error) {
    handleError(error as CustomErrors);
  }
};
</script>

<template>
  <nav
    class="bg-nearBlack border-b border-gray-200 px-4 py-2.5 fixed left-0 right-0 top-0 z-50"
  >
    <div class="flex flex-wrap justify-between items-center">
      <div class="flex justify-start items-center">
        <button
          @click="$emit('update:modelValue', !drawerVal)"
          data-drawer-target="drawer-navigation"
          data-drawer-toggle="drawer-navigation"
          aria-controls="drawer-navigation"
          class="p-2 mr-2 text-nearWhite rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100"
        >
          <svg
            aria-hidden="true"
            class="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <svg
            aria-hidden="true"
            class="hidden w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="sr-only">Toggle sidebar</span>
        </button>
        <div class="flex items-center justify-between mr-4">
          <img src="/rotary-logo.svg" class="mr-3 h-8" alt="Flowbite Logo" />
          <span
            class="text-nearWhite self-center text-2xl font-semibold whitespace-nowrap"
            >{{ langTranslations.adminDash.headerDashboard }}</span
          >
        </div>
      </div>
      <div class="flex items-center lg:order-2">
        <div ref="rootElement" class="flex flex-col">
          <!-- NOTE: By using @click.stop, you're stopping the click event from bubbling up to the document, so the dropdown stays open  -->
          <button
            @click.stop="toggleDropdown"
            type="button"
            class="buttons flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="dropdown"
          >
            <span class="sr-only">Open user menu</span>
            <img
              class="w-10 h-10 rounded-full"
              :src="
                userStore.loggedInUser?.extra_details?.profilePicture
                  ?.s3UrlLink ||
                userStore.loggedInUser?.extra_details?.profilePicture
                  ?.s3BaseUrlLink ||
                '/peter.jpg'
              "
              alt="user photo"
            />
          </button>
          <div
            :class="show ? 'block' : 'hidden'"
            class="z-50 my-4 fixed w-56 text-base list-none text-nearWhite bg-gray-600 divide-y divide-gray-100 shadow rounded-xl"
            id="dropdown"
          >
            <div class="py-3 px-4">
              <span class="block text-sm font-semibold text-nearWhite">{{
                userStore.loggedInUser.fullName ?? "John Doe"
              }}</span>
              <span class="block text-sm text-nearWhite truncate">{{
                userStore.loggedInUser.email ?? "john.doe@me.com"
              }}</span>
            </div>
            <ul class="py-1 text-nearWhite" aria-labelledby="dropdown">
              <li>
                <a
                  @click="
                    () => {
                      toggleDropdown();
                      router.push({
                        name: 'MyProfile',
                        query: { tabNameProp: 'profile' },
                      });
                    }
                  "
                  href="#"
                  class="block py-2 px-4 text-sm hover:bg-gray-100 hover:text-nearBlack"
                  >{{ langTranslations.adminDash.myProfileLabel }}</a
                >
              </li>
              <li>
                <span
                  @click="
                    () => {
                      toggleDropdown();
                    }
                  "
                  href="#"
                  class="flex items-center py-2 px-4 text-sm hover:bg-gray-100 hover:text-nearBlack"
                  >{{
                    langTranslations.langPrefrenceLabel +
                    ": " +
                    languagePref.toLocaleUpperCase()
                  }}
                  <svg
                    @click.stop=""
                    class="w-3.5 h-3.5 ms-2.5 cursor-pointer pl-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                    @click="showSub = !showSub"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </span>
                <div
                  :class="showSub ? 'block' : 'hidden'"
                  id="doubleDropdown"
                  class="z-60 fixed divide-y divide-gray-100 rounded-lg shadow w-44 text-nearWhite bg-gray-600"
                >
                  <ul
                    class="py-2 text-sm"
                    aria-labelledby="doubleDropdownButton"
                  >
                    <li
                      v-for="lang in availabileLanguages"
                      :key="lang"
                      class="rounded-lg"
                    >
                      <a
                        @click="changeLanguage(lang)"
                        href="#"
                        class="block px-4 py-2 hover:text-nearBlack hover:bg-gray-100 rounded-lg"
                        >{{ lang.toLocaleUpperCase() }}</a
                      >
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <router-link
                  :to="{ name: 'UserLogin' }"
                  @click="logoutAdmin"
                  href="#"
                  class="block py-2 px-4 text-sm hover:bg-gray-100 hover:text-nearBlack"
                  >{{ langTranslations.logoutLabel }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

nav {
  #dropdown {
    right: 0;
    top: 2.5rem;
  }
  .buttons {
    @media screen and (max-width: $tablet) {
      display: none;
    }
  }
  .mobile-button {
    display: none;
    @media screen and (max-width: $smallMobile) {
      display: block;
    }
  }
}
#doubleDropdown {
  right: 5rem;
  top: 13rem;
}
</style>
