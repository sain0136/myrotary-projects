<script lang="ts">
export default {
  name: "MyProjects",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import CreatedProjectsTable from "@/modules/admin/components/myprojects/CreatedProjectsTable.vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { useLoggedInDistrict } from "@/stores/LoggedInDistrict";
import { DateTime } from "luxon";
import { useLoggedInClub } from "@/stores/LoggedInClub";
import router from "@/router";
import {
  useAccessControl,
  type AllUserRoles,
} from "@/utils/composables/UseAccessControl";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import Qmark from "@/components/icons/Qmark.vue";

/* Data */
const { hasAccess } = useAccessControl();
const startDate =
  useLoggedInDistrict().loggedInDistrict.district_details?.dates
    ?.grant_submission_startdate || "";
const closeDate =
  useLoggedInDistrict().loggedInDistrict.district_details?.dates
    ?.grant_submission_closedate || "";
const isProjectsOpen = ref(true);
if (!startDate || !closeDate) {
  isProjectsOpen.value = false;
}
const todaysDate = new Date(DateTime.now().toLocaleString());
const closeDateLuxon = new Date(closeDate);
const startDateLuxon = new Date(startDate);
if (todaysDate < startDateLuxon || todaysDate > closeDateLuxon) {
  isProjectsOpen.value = false;
}
const { langTranslations, customPrintf } = useLanguage();
const activeTab = ref(
  sessionStorage.getItem("myprojectsViewLastTab") || "created"
);
const access = {
  allProjects: hasAccess(
    useLoggedInUserStore().loggedInUser.user_type === "SUPER"
      ? "SuperAdmin"
      : (useLoggedInUserStore().loggedInUser.role as AllUserRoles),
    "all-projects-tab"
  ),
  districtAllProjects: hasAccess(
    useLoggedInUserStore().loggedInUser.role as AllUserRoles,
    "district-all-projects-tab"
  ),
  clubAllProjects: hasAccess(
    useLoggedInUserStore().loggedInUser.role as AllUserRoles,
    "club-all-projects-tab"
  ),
};
const tabs = ref([
  {
    name: "allProjects",
    label: langTranslations.value.allProjectsLabel,
    hide: !access.allProjects,
  },
  {
    name: "districtsProjects",
    label:
      langTranslations.value.districtLabel +
      " " +
      langTranslations.value.projectsLabel,
    hide: !access.districtAllProjects,
  },
  {
    name: "clubProjects",
    label: langTranslations.value.myClubProjectsLabel,
    hide: !access.clubAllProjects,
  },
  {
    name: "created",
    label: langTranslations.value.myProjectsLabel,
  },
  {
    name: "administrating",
    label: langTranslations.value.myprojectsView.administratingProjectsLabel,
    toolTip:
      langTranslations.value.myprojectsView.administratingProjectsToolTip,
  },
  {
    name: "newProject",
    label: langTranslations.value.myprojectsView.newProjectsLabel,
  },
]);

/* Hooks */
onMounted(async () => {});

/* Methods */
const setActiveTab = (tabName: string) => {
  activeTab.value = tabName;
  sessionStorage.setItem("myprojectsViewLastTab", tabName);
};
</script>

<template>
  <ul
    class="tabs flex flex-wrap text-sm font-medium text-center justify-center text-gray-500 border-b border-gray-200"
  >
    <li class="mr-2" v-for="tab in tabs" :key="tab.name">
      <a
        v-if="!tab.hide"
        @click="setActiveTab(tab.name)"
        class="inline-block cursor-pointer rounded-t-lg p-4 text-2xl hover:bg-gray-300 hover:text-gray-600"
        :class="{
          ' active  bg-gray-100 text-nearBlack': tab.name === activeTab,
          'flex flex-nowrap': tab.toolTip,
        }"
      >
        {{ tab.label }}
        <Qmark :help-text="tab.toolTip ?? ''" v-if="tab.toolTip" />
      </a>
    </li>
  </ul>
  <div v-if="activeTab === 'allProjects'">
    <CreatedProjectsTable :all-projects-view="true" v-if="access.allProjects" />
  </div>
  <div v-if="activeTab === 'districtsProjects'">
    <CreatedProjectsTable
      :district-admin-view="true"
      v-if="access.districtAllProjects"
    />
  </div>
  <div v-if="activeTab === 'clubProjects'">
    <CreatedProjectsTable
      :club-projects-view="true"
      v-if="access.clubAllProjects"
    />
  </div>
  <div v-if="activeTab === 'created'">
    <CreatedProjectsTable />
  </div>
  <div v-if="activeTab === 'administrating'">
    <CreatedProjectsTable :adminstrating-view="true" />
  </div>
  <div
    class="py-8 flex flex-col items-center gap-4"
    v-if="activeTab === 'newProject'"
  >
    <span class="text-secondary">{{
      "*" +
      customPrintf(
        langTranslations.myprojectsView.submissionDatesLabel,
        startDate,
        closeDate
      )
    }}</span>
    <div class="buttons-container flex justify-center">
      <RotaryButton
        :label="langTranslations.clubLabel"
        :theme="'primary'"
        class="w-48"
        @click="
          () => {
            router.push({
              name: 'ClubProjectForm',
            });
          }
        "
      />
      <RotaryButton
        :label="langTranslations.myprojectsView.dsgProjectsLabel"
        :theme="'primary'"
        class="w-48"
        @click="
          () => {
            router.push({
              name: 'SimplifiedProjectForm',
            });
          }
        "
        v-if="
          isProjectsOpen === true &&
          !useLoggedInClub().loggedInClub?.settings?.disableDsg
        "
      />
      <RotaryButton
        :label="langTranslations.myprojectsView.dmProjectsLabel"
        :theme="'primary'"
        class="w-48"
        @click="
          () => {
            router.push({
              name: 'MatchingProjectForm',
            });
          }
        "
        v-if="
          isProjectsOpen === true &&
          !useLoggedInClub().loggedInClub?.settings?.disableDM
        "
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
