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
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { modalHandler } from "@/utils/composables/ModalHandler";
import type { PaginationResult } from "@/utils/types/commonTypes";
import BaseSelect from "@/components/form/BaseSelect.vue";
import H3 from "@/components/headings/H3.vue";
import type { IUser } from "@/utils/interfaces/IUser";
import { UsersApi } from "@/api/services/UserApi";
import { DistrictApi } from "@/api/services/DistrictsApi";
import { ClubApi } from "@/api/services/ClubApi";
import type { IDistrict } from "@/utils/interfaces/IDistrict";
import { useRoute } from "vue-router";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import LoadingSpinner from "@/components/loading/LoadingSpinner.vue";
import { useLoggedInDistrict } from "@/stores/LoggedInDistrict";
import { first } from "lodash";
import { all } from "node_modules/axios/index.cjs";


/* Data */
const userStore = useLoggedInUserStore();

//
const { langTranslations } = useLanguage();
const { handleError, handleSuccess } = errorHandler();
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

    //Filter out any prospect users that are not on the same district as logged  user
    let selectedUsers = response.filter((user)=> user.district_id === userStore.loggedInUser.district_id)
    const totalResult = selectedUsers.length
    
    //Display results based on the limit we set
    selectedUsers = selectedUsers.slice(0, pagination.limit)


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
user.isProspect = false
//await userApi.createNewUser(user)
}

const denyUser = async(user:IUser) => {
  console.log("Denying user")
  //TODO: Grab user.email address and send e-mail notification
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
        callBack: (user) => {
          approveUser(user as IUser);
        },
      }"
      :deny-button="{
        show: true,
        callBack: (user) => {
          denyUser(user as IUser)
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
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss"; 
</style>
