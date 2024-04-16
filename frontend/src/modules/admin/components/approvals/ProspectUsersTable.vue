<script lang="ts">
export default {
  name: "ProspectUsersTable",
};
</script>

<script setup lang="ts">
import { ApiClient } from "@/api/ApiClient";
import BaseDisplayTable from "@/components/tables/BaseDisplayTable.vue";
import type { CustomError } from "@/utils/classes/CustomError";
import type { CustomErrors } from "@/utils/classes/CustomErrors";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { onMounted, reactive, ref, watch } from "vue";
import { useLanguage } from "@/utils/languages/UseLanguage";
import router from "@/router";
import type { IUser } from "@/utils/interfaces/IUser";
import { UsersApi } from "@/api/services/UserApi";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";

/* Data */
const userStore = useLoggedInUserStore();

//
const { langTranslations } = useLanguage();
const { handleError, handleSuccess,handleInfo} = errorHandler();
const userApi = new UsersApi(new ApiClient());
let allProspectUsers = reactive<Array<IUser>>([]);



const pagination = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  limit: 5,
});



//Hardcode pagination settings for now (in the future this will be part of the api response)
const paginationOptions = {first_page:1,last_page:3,current_page: 1, per_page: 5}
const loaded = ref(false);

/* Hooks */
watch(
  () => pagination.limit,
  () => {
    getProspectUsers();
  }
);  

onMounted(async () => {
  getProspectUsers()
});

/* Methods */

//This function fetches and populates the allProspectUsers variable
const getProspectUsers = async () => {
  loaded.value = false;
  try {
    const response = await userApi.getAllProspectUsers()

    //Clearing array, to be re-populated according to page limit
    allProspectUsers.splice(0, allProspectUsers.length);
    console.log("All prospect users:", JSON.stringify(response, null, 2));
    //Filter out for is_prospect, and same district as logged in user
    let selectedUsers = response.filter((user)=> (
    user.district_id === userStore.loggedInUser.district_id
  )
  )

    const totalResult = selectedUsers.length

    //Display results based on the limit we set
    selectedUsers = selectedUsers.slice(0, pagination.limit)

    //CURRENT LOGGED IN USER DISCTRICT = DISTRICT 7000
    selectedUsers.map((user) => allProspectUsers.push(user))


    //TODO: Update these values correctly when I press "next" button
    pagination.currentPage = paginationOptions.current_page
    pagination.lastPage = paginationOptions.last_page
    pagination.total = totalResult
  
    loaded.value = true;
  } catch (error) {
    handleError(error as CustomErrors);
  }
}

const handlePageChange = (nextOrPrevious: "next" | "previous") => {
  console.log('Changing Page')
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
    params: { userId: user.user_id }
  })
}

const approveUser = async(user:IUser) => {
console.log("Approving user")
user.is_prospect = false
await userApi.updateUser(user)
}

const denyUser = async(user:IUser) => {
  console.log("Denying user")
  //TODO: Grab user.email address and send e-mail notification
  await userApi.deleteUser(user.user_id)
}

const refreshPage = async ()=>{
  await getProspectUsers()
}

</script>

<template>
  <div class="flex flex-col gap-8">
    <BaseDisplayTable
      :show-checkboxes="false"
      v-if="allProspectUsers.length > 0 && loaded"
      :handle-page-change="handlePageChange"
      :current-page= "pagination.currentPage"
      :last-page= "pagination.lastPage"
      :total-results= "pagination.total"
      :limit= "pagination.limit"
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
    <h1 v-if="allProspectUsers.length === 0" class = 'no_users'>
      {{langTranslations.noProspectUserAvailable}} 
    </h1>
  </div>
</template>

<style lang="scss" scoped>
.no_users {
display: flex;
 justify-content: center; 
 align-items: center;
 height: 80vh
}
@import "@/assets/_variables.scss"; 
</style>
