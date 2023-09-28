<script lang="ts">
export default {
  name: "Settings",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import LogoUploadForm from "@/modules/admin/components/sitesettings/LogoUploadForm.vue";
import H1 from "@/components/headings/H1.vue";
/* Data */
const activeTab = ref("logo");
const { langTranslations } = useLanguage();
const tabs = ref([
  { name: "logo", label: langTranslations.value.adminDash.logoTabLabel },
  { name: "setting", label: langTranslations.value.adminDash.settingsLabel },
]);

/* Hooks */
onMounted(async () => {});

/* Methods */
const setActiveTab = (tabName: string) => {
  activeTab.value = tabName;
};
</script>

<template>
  <ul
    class="tabs flex flex-wrap text-sm font-medium text-center justify-center text-gray-500 border-b border-gray-200"
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
  <div
    v-if="activeTab === 'logo'"
    class="flex flex-col h-full items-center pt-16 gap-16"
  >
    <H1 :content="langTranslations.adminDash.uploadFileH1Header" />
    <LogoUploadForm />
  </div>
</template>

<style lang="scss" scoped></style>
