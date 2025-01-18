<script lang="ts">
export default {
  name: "MyProfile",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import ProfileForm from "@/modules/admin/components/myprofile/ProfileForm.vue";
import H1 from "@/components/headings/H1.vue";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import UserForm from "@/components/forms/UserForm.vue";
import Hr from "@/components/hr/Hr.vue";
import H2 from "@/components/headings/H2.vue";
import { ref } from "vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import type { CustomError } from "@/utils/classes/CustomError";
import { UsersApi } from "@/api/services/UserApi";
import { ApiClient } from "@/api/ApiClient";
import { DateTime } from "luxon";

/* Data  */
const usersApi = new UsersApi(new ApiClient());
const { handleError, handleSuccess } = errorHandler();
const { langTranslations, languagePref, setLanguage, availabileLanguages } =
  useLanguage();
const userStore = useLoggedInUserStore();
const tabs = ref([
  { name: "personal", label: langTranslations.value.adminDash.personal },
  { name: "settings", label: langTranslations.value.adminDash.settingsLabel },
]);
const activeTab = ref(localStorage.getItem("profileLastTab") ?? "personal");
const changeLanguage = (pref: "en" | "fr") => {
  languagePref.value = pref;
  const lang = pref;
  setLanguage(lang);
};

const map = new Map([
  ["en", langTranslations.value.english],
  ["fr", langTranslations.value.french],
]);

/* Methods */
const setActiveTab = (tabName: string) => {
  activeTab.value = tabName;
  localStorage.setItem("profileLastTab", tabName);
};

const handleSubmit = async () => {
  try {
    const subId = userStore.loggedInUser.subscription_id;
    if (subId) {
      const updatedUser = await usersApi.cancelSubscription(
        subId,
        userStore.loggedInUser.user_id
      );
      userStore.setLoggedInUser(updatedUser);
    } else {
      throw new Error("No subscription found");
    }
    handleSuccess(
      langTranslations.value.stripeSubscription.cancelSubscriptionSuccess
    );
  } catch (error) {
    handleError(error as CustomError);
  }
};
</script>

<template>
  <div class="flex flex-col gap-4 items-center justify-center">
    <iconify-icon icon="mdi:home"></iconify-icon>
    <H1
      class="text-center mb-8"
      :content="langTranslations.adminDash.myProfileLabel"
    />
  </div>
  <ul
    class="tabs flex flex-wrap text-sm font-medium text-center justify-center text-gray-500"
  >
    <li class="mr-2" v-for="tab in tabs" :key="tab.name">
      <a
        @click="setActiveTab(tab.name)"
        class="inline-block cursor-pointer rounded-t-lg p-4 text-2xl hover:bg-gray-300 hover:text-gray-600"
        :class="{
          ' active  bg-gray-100 text-nearBlack': tab.name === activeTab,
        }"
      >
        {{ tab.label }}
      </a>
    </li>
  </ul>
  <div>
    <div>
      <Hr />

      <div v-if="activeTab === 'personal'" class="personal">
        <!-- profile pic -->
        <div
          class="profile-img flex flex-col gap-4 items-center justify-center"
        >
          <div class="circular-image-container h-80 w-80">
            <img
              :src="
                userStore.loggedInUser?.extra_details?.profilePicture
                  ?.s3UrlLink ||
                userStore.loggedInUser?.extra_details?.profilePicture
                  ?.s3BaseUrlLink ||
                '/peter.jpg'
              "
              alt="brand"
            />
          </div>
          <ProfileForm
            class="w-1/2"
            :title="langTranslations.profileImageUploadLabel"
          />
        </div>
        <!-- personal info -->
        <UserForm
          :user-id-prop="userStore.loggedInUser?.user_id.toString()"
          :form-type-prop="'myProfile'"
          :is-edit-prop="true"
        />
      </div>
      <div v-if="activeTab === 'settings'" class="settings">
        <!-- lang -->
        <div class="lang-pref">
          <H2
            class="text-center mb-8"
            :content="langTranslations.langPrefrenceLabel"
          />
          <div class="flex flex-col items-center justify-center gap-4">
            <div
              v-for="lang in availabileLanguages"
              :key="lang"
              class="flex items-center mb-4"
            >
              <input
                id="default-radio-1"
                type="radio"
                :value="lang"
                v-model="languagePref"
                @change="changeLanguage(lang)"
                name="default-radio"
                class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label for="default-radio-1" class="ms-2 text-sm font-medium">{{
                map.get(lang)
              }}</label>
            </div>
          </div>
          <Hr />
        </div>
        <!-- subscription -->
        <div
          v-if="userStore.loggedInUser.subscription_id"
          class="subscription-management"
        >
          <H2
            class="text-center mb-8"
            :content="langTranslations.adminDash.subscription"
          />
          <p class="text-center">
            {{ langTranslations.stripeSubscription.activeSubscriptionText }}
          </p>
          <div class="flex justify-center mt-8">
            <RotaryButton
              v-if="
                userStore.loggedInUser.subscription_id &&
                !userStore.loggedInUser.extra_details.subscription_end_date
              "
              @click="handleSubmit"
              :label="
                langTranslations.stripeSubscription.cancelSubscriptionButton
              "
              theme="primary"
            />
            <p
              v-if="
                userStore.loggedInUser.subscription_id &&
                userStore.loggedInUser.extra_details.subscription_end_date
              "
            >
              {{
                useLanguage().customPrintf(
                  langTranslations.stripeSubscription.subscriptionEndDate,
                  DateTime.fromISO(
                    userStore.loggedInUser.extra_details.subscription_end_date
                  ).toFormat("dd-LLL-yyyy")
                )
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.circular-image-container {
  border-radius: 50%; /* this makes it circular */
  overflow: hidden; /* hides any part of the image that overflows the container */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* this will ensure the image covers the entire container without warping its aspect ratio */
  }
}
</style>
