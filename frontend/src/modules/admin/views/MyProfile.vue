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

/* Data  */
const { langTranslations } = useLanguage();
const siteAssetsStore = useSiteAssets();
const userStore = useLoggedInUserStore();
</script>

<template>
  <div>
    <div>
      <H1
        class="text-center mb-8"
        :content="langTranslations.adminDash.myProfileLabel"
      />
      <div class="flex flex-col gap-4 items-center justify-center">
        <div class="circular-image-container h-52 w-52">
          <img
            :src="
              userStore.loggedInUser?.extra_details?.profilePicture
                ?.s3UrlLink ?? '/peter.jpg'
            "
            alt="brand"
          />
        </div>
        <ProfileForm
          class="w-1/2"
          :title="langTranslations.profileImageUploadLabel"
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
