<script lang="ts">
export default {
  name: "ProjectAdminsForm",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { useActiveProjectStore } from "@/stores/ActiveProjectStore";
import BaseSelect from "@/components/form/BaseSelect.vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import BaseInput from "@/components/form/BaseInput.vue";
import H3 from "@/components/headings/H3.vue";
import ResourceList from "@/utils/classes/ResourceList";
import { CustomErrors } from "@/utils/classes/CustomErrors";
import { ApiClient } from "@/api/ApiClient";
import { ClubApi } from "@/api/services/ClubApi";
import LoadingSpinner from "@/components/loading/LoadingSpinner.vue";
import BaseDisplayTable from "@/components/tables/BaseDisplayTable.vue";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import { useLoggedInClub } from "@/stores/LoggedInClub";
import type { IUser } from "@/utils/interfaces/IUser";
import { ProjectsApi } from "@/api/services/ProjectsApi";
const pagination = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  limit: 1000,
});

/* Data */
const loaded = ref(false);
const clubApi = new ClubApi(new ApiClient());
const projectsApi = new ProjectsApi(new ApiClient());
const { langTranslations } = useLanguage();
const { handleError, handleSuccess } = errorHandler();
const projectId = useActiveProjectStore().activeProject?.project_id ?? null;
const projectAdmins = reactive(
  useActiveProjectStore().activeProject?.projectDetails.projectAdmins ?? []
);
const loggedInClubid = useLoggedInUserStore().loggedInUser?.club_id
  ? useLoggedInUserStore().loggedInUser?.club_id
  : useLoggedInClub().loggedInClub?.club_id;

const chosenUser = ref("");
const allClubMembersNameList: string[] = reactive([]);
const allClubMembers: IUser[] = reactive([]);
let adminUsers: Array<
  | string
  | IUser
  | {
      fullName: string;
    }
> = reactive([]);
if (projectAdmins) {
  adminUsers = projectAdmins.map((user: IUser) => {
    return user;
  }) as Array<string | IUser>;
}
/* Hooks */
onMounted(async () => {
  try {
    const response = await clubApi.getClubUsers(
      loggedInClubid ?? 0,
      pagination.currentPage,
      pagination.limit
    );
    const clubMembersList = (response.data as IUser[]).map((member: IUser) => {
      return member.fullName;
    });
    const clubMembers = response.data as IUser[];
    Object.assign(allClubMembersNameList, clubMembersList);
    Object.assign(allClubMembers, clubMembers);
    pagination.currentPage = response.meta.current_page;
    pagination.lastPage = response.meta.last_page;
    pagination.total = response.meta.total;
    loaded.value = true;
  } catch (error) {
    handleError(error as CustomErrors);
  }
});

/* Methods */
const isUserAlreadyAdmin = () => {
  if (adminUsers.includes(chosenUser.value)) {
    handleError(
      new CustomErrors(500, "User already admin", {
        en: "User already admin",
        fr: "Utilisateur déjà administrateur",
      })
    );
  } else {
    return false;
  }
};

const addUserToProject = async () => {
  try {
    if (isUserAlreadyAdmin()) {
      return;
    }
    const memberID =
      allClubMembers.find((member: IUser) => {
        return member.fullName === chosenUser.value;
      })?.user_id ?? null;
    if (memberID) {
      await projectsApi.addProjectAdmins(memberID, projectId);
      handleSuccess(langTranslations.value.toastSuccess);
      adminUsers.push({ fullName: chosenUser.value });
      chosenUser.value = "";
    } else {
      throw new CustomErrors(500, "User not found", {
        en: "User not found",
        fr: "Utilisateur introuvable",
      });
    }
  } catch (error) {
    handleError(error as CustomErrors);
  }
};
</script>

<template>
  <div class="text-center py-8 flex flex-col items-center gap-8">
    <H3 :content="langTranslations.projectFormLabels.addProjectAdminsLabel" />
    <form
      @submit.prevent
      class="flex flex-col gap-8 justify-center items-center"
    >
      <div class="flex justify-center">
        <BaseSelect
          class=""
          v-model="chosenUser"
          :label="langTranslations.clubsView.clubMembersLabel + ':'"
          :options="allClubMembersNameList"
        />
      </div>
      <RotaryButton
        @click="addUserToProject()"
        :label="langTranslations.saveLabel"
        :theme="'black'"
      />
    </form>
    <div v-if="adminUsers.length > 0">
      <BaseDisplayTable
        :show-checkboxes="false"
        :handle-page-change="() => {}"
        :current-page="pagination.currentPage"
        :last-page="pagination.lastPage"
        :total-results="pagination.total"
        :limit="pagination.limit"
        :table-data="adminUsers"
        :hideActionsColumn="true"
        :disable-pagination="true"
        :columns="[
          {
            name: langTranslations.nameLabel,
            lgScreenCollapsable: true,
            colName: 'fullName',
          },
        ]"
      />
    </div>
    <div class="text-center" v-else>
      <H3 :content="langTranslations.projectFormLabels.noProjectAdminsLabel" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
