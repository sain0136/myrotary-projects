<script lang="ts">
export default {
  name: "Approvals",
};
</script>

<script setup lang="ts">
import {
  useAccessControl,
  type AllUserRoles,
} from "@/utils/composables/UseAccessControl";
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import AprrovalTable from "@/modules/admin/components/approvals/AprrovalTable.vue";
import { loggedInRoleForAccessControl } from "@/utils/utils";

/* Data */
const { langTranslations } = useLanguage();
const { hasAccess } = useAccessControl();
const activeTab = ref(
  sessionStorage.getItem("approvalsViewLastTab") || "projectApprovals"
);
const accessRole = loggedInRoleForAccessControl();
const access = {
  projectApprovals: hasAccess(accessRole as AllUserRoles, "approve-projects"),
  reportsApprovals: hasAccess(
    accessRole as AllUserRoles,
    "approve-projects-reports"
  ),
};
if (!access.projectApprovals || !access.reportsApprovals) {
  if (!access.projectApprovals) {
    activeTab.value = "reportsApprovals";
  } else if (!access.reportsApprovals) activeTab.value = "projectApprovals";
}
const tabs = ref([
  {
    name: "projectApprovals",
    label:
      langTranslations.value.projectLabel +
      " " +
      langTranslations.value.approvalsLabel,
    hidden: !access.projectApprovals,
  },
  {
    name: "reportsApprovals",
    label:
      langTranslations.value.reportsLabel +
      " " +
      langTranslations.value.approvalsLabel,
    hidden: !access.reportsApprovals,
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
      v-if="access.projectApprovals || access.reportsApprovals"
      class="tabs flex flex-wrap text-sm font-medium text-center justify-center text-gray-500 border-b border-gray-200"
    >
      <li class="mr-2" v-for="tab in tabs" :key="tab.name">
        <a
          v-if="!tab.hidden"
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
    <div v-if="activeTab === 'projectApprovals' && access.projectApprovals">
      <AprrovalTable :table-type="'projectApproval'" />
    </div>
    <div v-if="activeTab === 'reportsApprovals' && access.reportsApprovals">
      <AprrovalTable :table-type="'reportApproval'" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
