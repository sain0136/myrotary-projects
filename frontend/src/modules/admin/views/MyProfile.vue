<script lang="ts">
export default {
  name: "MyProfile",
};
</script>
<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import ProfileForm from "@/modules/admin/components/myprofile/ProfileForm.vue";
import H1 from "@/components/headings/H1.vue";
import { useSiteAssets } from "@/stores/SiteAssets";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import UserForm from "@/components/forms/UserForm.vue";
import Hr from "@/components/hr/Hr.vue";
import H2 from "@/components/headings/H2.vue";
import BaseCheckBox from "@/components/form/BaseCheckBox.vue";
import { ref } from "vue";

/* Data  */
const { langTranslations, languagePref, setLanguage, availabileLanguages } =
  useLanguage();
const siteAssetsStore = useSiteAssets();
const userStore = useLoggedInUserStore();
const changeLanguage = (pref: "en" | "fr") => {
  languagePref.value = pref;
  const lang = pref;
  setLanguage(lang);
};
const map = new Map([
  ["en", langTranslations.value.english],
  ["fr", langTranslations.value.french],
]);
</script>

<template>
  <div>
    <div>
      <div class="flex flex-col gap-4 items-center justify-center">
        <H1
          class="text-center mb-8"
          :content="langTranslations.adminDash.myProfileLabel"
        />
      </div>
      <Hr />
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
      <div class="flex flex-col gap-4 items-center justify-center">
        <div class="circular-image-container h-52 w-52">
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
        <UserForm
          :user-id-prop="userStore.loggedInUser?.user_id.toString()"
          :form-type-prop="'myProfile'"
        />
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
