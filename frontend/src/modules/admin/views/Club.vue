<script lang="ts">
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Club",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import ClubsTable from "@/modules/admin/components/club/ClubsTable.vue";
import ClubMembersTable from "@/modules/admin/components/club/ClubMembersTable.vue";

/* Data */
const { langTranslations } = useLanguage();
const activeTab = ref(sessionStorage.getItem("clubViewLastTab") || "clubs");
const tabs = ref([
  {
    name: "clubs",
    label: langTranslations.value.clubsView.clubsLabel,
  },
  {
    name: "members",
    label: langTranslations.value.clubsView.clubMembersLabel,
  },
]);

/* Hooks */
onMounted(async () => {});

/* Methods */
const setActiveTab = (tabName: string) => {
  activeTab.value = tabName;
  sessionStorage.setItem("clubViewLastTab", tabName);
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
  <div v-if="activeTab === 'clubs'">
    <ClubsTable />
  </div>
  <div v-if="activeTab === 'members'" class="mt-8">
    <ClubMembersTable />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
