<script lang="ts">
export default {
  name: "ClubMembersTable",
};
</script>

<script setup lang="ts">
import { ApiClient } from "@/api/ApiClient";
import { DistrictApi } from "@/api/services/DistrictsApi";
import BaseDisplayTable from "@/components/tables/BaseDisplayTable.vue";
import type { CustomError } from "@/utils/classes/CustomError";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import { onMounted, reactive, ref, watch } from "vue";
import { useLanguage } from "@/utils/languages/UseLanguage";
import router from "@/router";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { modalHandler } from "@/utils/composables/ModalHandler";
import type { PaginationResult } from "@/utils/types/commonTypes";
import BaseSelect from "@/components/form/BaseSelect.vue";
import { ClubApi } from "@/api/services/ClubApi";
import H3 from "@/components/headings/H3.vue";
import type { IClub } from "@/utils/interfaces/IClub";
import type { IUser } from "@/utils/interfaces/IUser";
import { UsersApi } from "@/api/services/UserApi";
import type { IDistrict } from "@/utils/interfaces/IDistrict";
import { useRoute } from "vue-router";
import { useLoggedInUserStore } from "@/stores/LoggedInUser";
import LoadingSpinner from "@/components/loading/LoadingSpinner.vue";
import { useLoggedInDistrict } from "@/stores/LoggedInDistrict";

/* Data */
const route = useRoute();
type tableView = "clubAdmins" | "districtAdmins" | undefined;
// required form data
let tableView = route.query.tableView
  ? (route.query.tableView as tableView)
  : undefined;

const { tableViewProp } = defineProps<{
  tableViewProp?: tableView;
}>();
if (tableViewProp) {
  tableView = tableViewProp;
}

const { langTranslations } = useLanguage();
const { handleError, handleSuccess } = errorHandler();
const { changeShowModal, setModal } = modalHandler();
const allDistricts = reactive<Map<string, number>>(new Map());
const allClubsInDistrict = reactive<Map<string, number>>(new Map());
const districtApi = new DistrictApi(new ApiClient());
const chosenDistrict = ref("");
const userApi = new UsersApi(new ApiClient());
const chosenClub = ref("");
const chosenId = ref(0);
const clubApi = new ClubApi(new ApiClient());
const allUsersInClub = reactive<Array<IUser>>([]);
const pagination = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  limit: 5,
});
const loaded = ref(false);

/* Hooks */
watch(chosenDistrict, async () => {
  if (chosenDistrict.value !== undefined && tableView !== "clubAdmins") {
    allUsersInClub.splice(0, allUsersInClub.length);
    chosenClub.value = "";
    chosenId.value = 0;
    const id = allDistricts.get(chosenDistrict.value) as number;
    try {
      allClubsInDistrict.clear();
      const response = await clubApi.clubsInDistrict(
        id,
        pagination.currentPage,
        1000000
      );
      (response?.data as IClub[]).map((club) => {
        allClubsInDistrict.set(club.club_name, club.club_id as number);
      });
    } catch (error) {
      handleError(error as CustomError);
    }
  }
});

watch(chosenClub, () => {
  if (
    chosenClub.value !== undefined &&
    chosenClub.value !== "" &&
    tableView !== "clubAdmins"
  ) {
    chosenId.value = allClubsInDistrict.get(chosenClub.value) as number;
    getClubMembers();
  }
});

watch(
  () => pagination.limit,
  () => {
    getClubMembers();
  }
);

onMounted(async () => {
  try {
    if (tableView === "clubAdmins") {
      chosenId.value = useLoggedInUserStore().loggedInUser?.club_id;
      await getClubMembers();
      return;
    }
    const response = (await districtApi.getAllDistricts(
      false,
      1,
      100000
    )) as PaginationResult;
    (response.data as IDistrict[]).map((district) => {
      allDistricts.set(district.district_name, district.district_id as number);
    });
    if (tableView === "districtAdmins") {
      chosenDistrict.value =
        useLoggedInDistrict().loggedInDistrict.district_name || "";
      return;
    }
  } catch (error) {
    handleError(error as CustomError);
  }
});

/* Methods */
const getClubMembers = async () => {
  try {
    loaded.value = false;
    //Clearing array before repopulating it with new data (depending on the page)
    allUsersInClub.splice(0, allUsersInClub.length);
    const response = (await clubApi.getClubUsers(
      chosenId.value,
      pagination.currentPage,
      pagination.limit
    )) as PaginationResult;
    if (response?.data) {
      console.log(response.meta)
      for (const user of response.data as IUser[]) {
        if (user.role) {
          user.title = user.role ?? user.role;
        } else {
          user.title = "N/A";
        }
      }
      (response.data as IUser[]).map((user) => {
        allUsersInClub.push(user);
      });
      pagination.currentPage = response.meta.current_page;
      pagination.lastPage = response.meta.last_page;
      pagination.total = response.meta.total;
      loaded.value = true;
    }
  } catch (error) {
    handleError(error as CustomError);
  }
};

const handlePageChange = (nextOrPrevious: "next" | "previous") => {
  pagination.currentPage =
    nextOrPrevious === "next"
      ? pagination.currentPage + 1
      : pagination.currentPage - 1;
  getClubMembers();
};

const deleteClubMember = async (user: unknown) => {
  const toDelete = user as IUser;
  const id = toDelete.user_id;
  try {
    setModal(
      langTranslations.value.deleteLabel,
      langTranslations.value.confirmationDelete + " " + toDelete.fullName
    );
    const confirmed = await changeShowModal(true);
    if (id && confirmed) {
      await userApi.deleteUser(id);
      handleSuccess(langTranslations.value.succssDeleteToast);
    }
    getClubMembers();
  } catch (error) {
    handleError(error as CustomError);
  }
};

const createNewClubMember = () => {
  if (tableView === "districtAdmins") {
    router.push({
      name: "UserAddEdit",
      query: {
        formType: "DistrictAdmin",
        userType: "clubUser",
        clubId: chosenId.value,
      },
    });
    return;
  }
  router.push({
    name: "UserAddEdit",
    query: {
      formType: "clubAdmin",
      userType: "clubUser",
      clubId: chosenId.value,
      districtId: allDistricts.get(chosenDistrict.value),
    },
  });
};
</script>

<template>
  <div class="flex flex-col gap-8">
    <div
      v-if="tableView !== 'clubAdmins' && tableView !== 'districtAdmins'"
      class="flex mt-8 justify-center flex-col gap-4 items-center"
    >
      <H3 :content="langTranslations.clubsView.choseDistrictForClubs" />
      <BaseSelect
        class="w-1/2"
        :options="[...allDistricts.keys()]"
        v-model="chosenDistrict"
        :label="''"
      />
    </div>
    <H3
      class="text-center"
      :content="langTranslations.clubsView.clubMembersLabel"
      v-if="tableView === 'clubAdmins'"
    />
    <div
      class="flex mt-8 justify-center flex-col gap-4 items-center"
      v-if="
        chosenDistrict &&
        allClubsInDistrict.size > 0 &&
        tableView !== 'clubAdmins'
      "
    >
      <H3 :content="langTranslations.clubsView.clubsLabel" />
      <BaseSelect
        class="w-1/2"
        :options="[...allClubsInDistrict.keys()]"
        v-model="chosenClub"
        :label="''"
      />
    </div>
    <H3
      class="text-center"
      v-else-if="chosenDistrict && allClubsInDistrict.size === 0"
      :content="langTranslations.clubsView.noClubsInDistrict"
    />
    <BaseDisplayTable
      :show-checkboxes="false"
      v-if="allUsersInClub.length > 0 && loaded"
      :handle-page-change="handlePageChange"
      :current-page="pagination.currentPage"
      :last-page="pagination.lastPage"
      :total-results="pagination.total"
      :limit="pagination.limit"
      @update:limit="pagination.limit = $event"
      :delete-button="{
        show: true,
        callBack: (user) => {
          deleteClubMember(user);
        },
        hide: (user) => {
          const member = user as IUser;
          if (member.user_type === 'DISTRICT' || member.user_type === 'SUPER') {
            return true;
          }
          return false
        }
      }"
      :edit-button="{
        show: true,
        callBack: (user) => {
          const id = (user as IUser).user_id
          if(tableView === 'districtAdmins' && id){
            router.push({
              path: `user-form/${id}`,
              query: {
              formType: 'districtAdmin',
              isEdit: 'true',
              }
            })
            return
          }
          if(tableView === 'clubAdmins' && id){
            router.push({
              path: `user-form/${id}`,
              query: {
              formType: 'clubAdmin',
              isEdit: 'true',
            },
            })
            return
          }
          if (id) {
            router.push({
              path: `user-form/${id}`,
              query: {
              formType: 'siteAdminClub',
              isEdit: 'true',
            },
            });
            return
          }
        },
        hide: (user) => {
          const member = user as IUser;
          if (member.user_type === 'DISTRICT' || member.user_type === 'SUPER') {
            return true;
          }
          return false
        } 
      }"
      :table-data="allUsersInClub"
      :columns="[
        {
          name: langTranslations.nameLabel,
          colName: 'fullName',
          columnWidth: 'w-2/12',
        },
        {
          name: langTranslations.roleLabel,
          lgScreenCollapsable: true,
          colName: 'title',
        },
      ]"
    />
    <LoadingSpinner v-else-if="!loaded && chosenClub" />
    <div
      class="flex justify-center"
      v-else-if="
        chosenDistrict && chosenClub && allUsersInClub.length === 0 && loaded
      "
    >
      <H3 :content="langTranslations.clubsView.noClubMembersInClub" />
    </div>
    <div class="flex justify-center">
      <RotaryButton
        v-if="chosenId"
        @click="createNewClubMember()"
        :label="langTranslations.clubsView.creatNewClubMemberLabel"
        :theme="'primary'"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
