<script lang="ts">
export default {
  name: "SideNavigation",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import { useProspectUserStore } from "@/stores/ProspecUserStore";
import type { AllUserRoles } from "@/utils/composables/UseAccessControl";
import { useAccessControl } from "@/utils/composables/UseAccessControl";
import ResourceList from "@/utils/classes/ResourceList";
import { logoutUser } from "@/utils/utils";

/* Data */

defineProps<{
  drawer: boolean;
}>();
defineEmits(["update:modelValue"]);
const userStore = useLoggedInUserStore();
const prospectUserStore = useProspectUserStore();

const { hasAccess } = useAccessControl();
const { langTranslations } = useLanguage();
const loggedinRole = ref("");
if (
  userStore.loggedInUser.user_id === 2 ||
  userStore.loggedInUser.user_id === 10
) {
  loggedinRole.value = "SuperAdmin";
} else if (userStore.loggedInUser.user_type === "SUPER") {
  loggedinRole.value = "SuperAdmin";
} else if (userStore.loggedInUser.role) {
  loggedinRole.value = userStore.loggedInUser.role;
} else if (userStore.loggedInUser.role) {
  loggedinRole.value = userStore.loggedInUser.role;
} else {
  loggedinRole.value = "guest";
}

const sideBarItems: Record<
  string,
  {
    label: string;
    icon: string;
    extras?: string;
    link: string;
    hasAccess: boolean;
    params?: Record<string, string>;
    query?: Record<string, string>;
  }
> = {
  home: {
    label: langTranslations.value.adminDash.homeLabel,
    icon: ResourceList.sidebarIcons.homeIcon,
    link: "Home",
    hasAccess: true,
  },
  profile: {
    label: langTranslations.value.adminDash.myProfileLabel,
    icon: ResourceList.sidebarIcons.myProfileIcon,
    link: "MyProfile",
    hasAccess: hasAccess(loggedinRole.value as AllUserRoles, "myprofile-view"),
  },
  settings: {
    label: langTranslations.value.adminDash.settingsLabel,
    icon: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor"
      class="iconify-icon w-6 h-6 text-gray-500 transition duration-75 group-hover:text-nearBlack"
       d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5
        0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49
        1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49
         0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4
         1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59
         1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/></svg>
    `,
    link: "Settings",
    hasAccess: hasAccess(
      loggedinRole.value as AllUserRoles,
      "webadmin-settings-view"
    ),
  },
  district: {
    label: langTranslations.value.adminDash.districtLabel,
    icon: ResourceList.sidebarIcons.districtIcon,
    link: "District",
    hasAccess: hasAccess(
      loggedinRole.value as AllUserRoles,
      "webadmin-district-settings-view"
    ),
  },
  clubs: {
    label: langTranslations.value.adminDash.clubLabel,
    icon: ResourceList.sidebarIcons.clubIcon,
    link: "Club",
    hasAccess: hasAccess(
      loggedinRole.value as AllUserRoles,
      "webadmin-club-settings-view"
    ),
  },
  districtAdminsSettings: {
    label:
      langTranslations.value.districtView.distictTabLabel +
      " " +
      langTranslations.value.adminDash.profile,
    icon: ResourceList.sidebarIcons.districtIcon,
    link: "DistrictAddEdit",
    params: {
      districtId: userStore.loggedInUser?.district_id?.toString() || "0",
    },
    query: {
      formType: "districtAdmin",
    },
    hasAccess: hasAccess(
      loggedinRole.value as AllUserRoles,
      "districtadmin-district-settings-view"
    ),
  },
  clubAdminsSettings: {
    label:
      langTranslations.value.clubLabel +
      " " +
      langTranslations.value.settingsLabel,
    icon: ResourceList.sidebarIcons.clubIcon,
    link: "ClubAddEdit",
    params: {
      clubId: userStore.loggedInUser?.club_id?.toString() || "0",
    },
    query: {
      formType: "clubAdmin",
    },
    hasAccess: hasAccess(
      loggedinRole.value as AllUserRoles,
      "clubadmin-club-settings-view"
    ),
  },
  clubAdminClubMembers: {
    label: langTranslations.value.clubsView.clubMembersLabel,
    icon: ResourceList.sidebarIcons.clubMembers,
    link: "ClubMembers",
    query: {
      tableView: "clubAdmins",
    },
    hasAccess: hasAccess(
      loggedinRole.value as AllUserRoles,
      "clubadmin-clubmembers-view"
    ),
  },
  districtAdminClubMembers: {
    label: langTranslations.value.adminDash.districtClubsLabel,
    icon: ResourceList.sidebarIcons.clubAdminViewIcon,
    link: "ClubsAdmin",
    hasAccess: hasAccess(
      loggedinRole.value as AllUserRoles,
      "districtadmin-clubadmin-view"
    ),
  },
  myProjects: {
    label: langTranslations.value.projectsLabel,
    icon: ResourceList.sidebarIcons.myProjects,
    link: "MyProjects",
    hasAccess: hasAccess(loggedinRole.value as AllUserRoles, "myprojects-view"),
  },
  approvals: {
    label: langTranslations.value.approvalsLabel,
    icon: ResourceList.sidebarIcons.approvals,
    link: "Approvals",
    hasAccess: hasAccess(loggedinRole.value as AllUserRoles, "approvals-view"),
  },
  prospectUsers: {
    label: langTranslations.value.prospectUserLabel,
    icon: ResourceList.sidebarIcons.prospectUsersIcon,
    extras: ResourceList.sidebarIcons.notificationIcon,
    link: "ProspectUsers",
    hasAccess: hasAccess(
      loggedinRole.value as AllUserRoles,
      "prospect-users-view"
    ),
  },
  superAdmins: {
    label: "Super Admin",
    icon: ResourceList.sidebarIcons.superAdmins,
    link: "SuperAdmin",
    hasAccess: hasAccess(loggedinRole.value as AllUserRoles, "superadmin-view"),
  },
};

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <aside
    :class="drawer ? 'translate-x-0' : '-translate-x-full'"
    class="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-nearBlack border-r border-gray-200 md:translate-x-0"
    aria-label="Sidenav"
    id="drawer-navigation"
  >
    <div class="overflow-y-auto py-5 px-3 h-full bg-nearBlack flex flex-col">
      <ul class="space-y-2">
        <li class="pb-3 border-b border-gray-200">
          <router-link
            @click="$emit('update:modelValue', !drawer)"
            :to="{ name: 'AdminWelcome' }"
            class="flex items-center p-2 text-base font-bold text-nearWhite rounded-lg hover:bg-nearWhite hover:text-nearBlack transition"
          >
            <svg
              aria-hidden="true"
              class="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-nearWhite"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
            </svg>
            <span class="flex-1 ml-3 text-center">{{
              langTranslations.welcome
            }}</span>
          </router-link>
        </li>
        <li v-for="item in sideBarItems" :key="item.link">
          <div v-if="item.hasAccess">
            <router-link
              class="w-2"
              :to="{
                name: item.link,
                params: item.params ? item.params : {},
                query: item.query ? item.query : {},
              }"
            >
              <button
                @click="$emit('update:modelValue', !drawer)"
                type="button"
                class="flex items-center p-2 w-full text-base font-bold duration-75 group text-nearWhite rounded-lg hover:bg-nearWhite hover:text-nearBlack transition"
                aria-controls="dropdown-pages"
                data-collapse-toggle="dropdown-pages"
              >
                <span v-html="item.icon"></span>
                <span class="flex-1 ml-3 text-center mt-1 whitespace-wrap">{{
                  item.label
                }}</span>
                <span
                  v-if="
                    item.link === 'ProspectUsers' &&
                    prospectUserStore.hasProspectUsers
                  "
                  v-html="item.extras"
                ></span>
              </button>
            </router-link>
          </div>
        </li>
      </ul>
      <div class="flex flex-col justify-end h-full">
        <p
          class="text-base font-bold text-nearWhite cursor-pointer"
          @click="logoutUser()"
        >
          {{ langTranslations.logoutLabel }}
        </p>
      </div>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.side-nav {
  @media screen and (max-width: $smallMobile) {
    display: none;
  }
}

.iconify-icon {
  width: 48px;
  height: 48px;
}
</style>
