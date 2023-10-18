<script lang="ts">
export default {
  name: "MyProfile",
};
</script>
<script setup lang = "ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import ProfileForm from "@/modules/admin/components/sitesettings/ProfileForm.vue";
import H1 from "@/components/headings/H1.vue";


/* Data  */
const { langTranslations } = useLanguage();

</script>
<template>
    <div>
        <div>
        <H1
            class="text-center mb-8"
            :content="langTranslations.adminDash.myProfileLabel"
          />
        <div class="flex justify-center">
            <ProfileForm
            class="w-1/2"
            :title="langTranslations.profileImageUploadLabel"
            />
        </div>
        </div>
    </div>
</template>
