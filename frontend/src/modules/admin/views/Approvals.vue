<script lang="ts">
export default {
  name: "Approvals",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import AprrovalTable from "@/modules/admin/components/approvals/AprrovalTable.vue";
/* Data */
const { langTranslations } = useLanguage();
const { handleError } = errorHandler();
const activeTab = ref(
  sessionStorage.getItem("approvalsViewLastTab") || "projectApprovals"
);
const tabs = ref([
  {
    name: "projectApprovals",
    label:
      langTranslations.value.projectLabel +
      " " +
      langTranslations.value.approvalsLabel,
  },
  {
    name: "reportsApprovals",
    label:
      langTranslations.value.reportsLabel +
      " " +
      langTranslations.value.approvalsLabel,
  },
]);

/* Hooks */
onMounted(async () => {});

/* Methods */
const setActiveTab = (tabName: string) => {
  activeTab.value = tabName;
  sessionStorage.setItem("approvalsViewLastTab", tabName);
};
</script>

<template>
  <div>
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
    <div v-if="activeTab === 'projectApprovals'">
      <AprrovalTable :table-type="'projectApproval'" />
    </div>
    <div v-if="activeTab === 'reportsApprovals'">
      <AprrovalTable :table-type="'reportApproval'" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
