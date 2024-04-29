<script lang="ts">
export default {
  name: "ProspectUsersTable",
};
</script>

<script setup lang="ts">
import { ApiClient } from "@/api/ApiClient";
import BaseDisplayTable from "@/components/tables/BaseDisplayTable.vue";
import type { CustomErrors } from "@/utils/classes/CustomErrors";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { onMounted, reactive, ref, watch } from "vue";
import { useLanguage } from "@/utils/languages/UseLanguage";
import router from "@/router";
import type { IUser } from "@/utils/interfaces/IUser";
import { UsersApi } from "@/api/services/UserApi";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import { useProspectUserStore } from "@/stores/ProspecUserStore";

/* Data */
const userStore = useLoggedInUserStore();
const prospectUserStore = useProspectUserStore();

//
const { langTranslations } = useLanguage();
const { handleError, handleSuccess, handleInfo } = errorHandler();
const userApi = new UsersApi(new ApiClient());
let allProspectUsers = reactive<Array<IUser>>([]);

const pagination = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  limit: 5,
});

const loaded = ref(false);

/* Hooks */
watch(
  () => pagination.limit,
  () => {
    getProspectUsers();
  }
);

onMounted(async () => {
  getProspectUsers();
});

/* Methods */

//This function fetches and populates the allProspectUsers variable
const getProspectUsers = async () => {
  loaded.value = false;
  try {
    const response = await userApi.getAllUsers(
      true,
      pagination.limit,
      pagination.currentPage,
      userStore.loggedInUser.district_id!
    );
    let selectedUsers = response.data;

    //Clearing array, to be re-populated according to page limit
    allProspectUsers.splice(0, allProspectUsers.length);

    //Update prospectUserStore so that we can update the notification icon
    prospectUserStore.setHasProspectUsers(
      selectedUsers.length > 0 ? true : false
    );

    //Display results based on the limit we set
    selectedUsers = selectedUsers.slice(0, pagination.limit);

    selectedUsers.map((user) => allProspectUsers.push(user as IUser));

    pagination.currentPage = response.meta.current_page;
    pagination.lastPage = response.meta.last_page;
    pagination.total = response.meta.total;

    loaded.value = true;
  } catch (error) {
    handleError(error as CustomErrors);
  }
};

const handlePageChange = (nextOrPrevious: "next" | "previous") => {
  pagination.currentPage =
    nextOrPrevious === "next"
      ? pagination.currentPage + 1
      : pagination.currentPage - 1;
  getProspectUsers();
};

// To use if opening form in a new page
const showProspectUserInfo = (user: IUser) => {
  router.push({
    name: "ProspectUserForm",
    params: { userId: user.user_id },
  });
};

const approveUser = async (user: IUser) => {
  user.is_prospect = false;
  await userApi.updateUser(user);
};

const denyUser = async (user: IUser) => {
  //TODO: Grab user.email address and send e-mail notification
  await userApi.deleteUser(user.user_id);
};

const refreshPage = async () => {
  await getProspectUsers();
};
</script>

<template>
  <div class="flex flex-col gap-8">
    <BaseDisplayTable
      :show-checkboxes="false"
      v-if="allProspectUsers.length > 0 && loaded"
      :handle-page-change="handlePageChange"
      :current-page="pagination.currentPage"
      :last-page="pagination.lastPage"
      :total-results="pagination.total"
      :limit="pagination.limit"
      @update:limit="pagination.limit = $event"
      :approve-button="{
        show: true,
        callBack: async (user) => {
          await approveUser(user as IUser);
          await refreshPage()
          handleSuccess(langTranslations.toastSucessApproveProspect,false);
        },
      }"
      :deny-button="{
        show: true,
        callBack: async (user) => {
          await denyUser(user as IUser)
          await refreshPage()
          handleInfo(langTranslations.toastDenyProspect,true);
        },
      }"
      :view-details-button="{
        show: true,
        callBack: (user) => {
          showProspectUserInfo(user as IUser);
        },
      }"
      :table-data="allProspectUsers"
      :columns="[
        {
          name: langTranslations.nameLabel,
          colName: 'fullName',
          columnWidth: 'w-1/12',
        },
      ]"
    />
    <h1 class="text-4xl font-bold no-users" v-if="allProspectUsers.length === 0">
      {{ langTranslations.noProspectUserAvailable }}
    </h1>
  </div>
</template>

<style lang="scss" scoped>
.no-users {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
@import "@/assets/_variables.scss";
</style>
