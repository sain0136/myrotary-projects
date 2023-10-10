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

/* Data */
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

/* Hooks */
watch(chosenDistrict, async () => {
  if (chosenDistrict.value !== undefined) {
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
  if (chosenClub.value !== undefined && chosenClub.value !== "") {
    chosenId.value = allClubsInDistrict.get(chosenClub.value) as number;
    getClubMembers();
  }
});

onMounted(async () => {
  try {
    const response = (await districtApi.getAllDistricts(
      false,
      1,
      100000
    )) as PaginationResult;
    response.data.map((district) => {
      allDistricts.set(district.district_name, district.district_id as number);
    });
  } catch (error) {
    handleError(error as CustomError);
  }
});

/* Methods */
const getClubMembers = async () => {
  try {
    allUsersInClub.splice(0, allUsersInClub.length);
    const response = (await clubApi.getClubUsers(
      chosenId.value,
      pagination.currentPage,
      pagination.limit
    )) as PaginationResult;
    if (response?.data) {
      for (const user of response.data as IUser[]) {
        if (user.role) {
          user.title = user.role[0]?.club_role ?? user.role[0]?.district_role;
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
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex mt-8 justify-center flex-col gap-4 items-center">
      <H3 :content="langTranslations.clubsView.choseDistrictForClubs" />
      <BaseSelect
        class="w-1/2"
        :options="[...allDistricts.keys()]"
        v-model="chosenDistrict"
        :label="''"
      />
    </div>
    <div
      v-if="chosenDistrict"
      class="flex mt-8 justify-center flex-col gap-4 items-center"
    >
      <H3 :content="langTranslations.clubsView.clubsLabel" />
      <BaseSelect
        class="w-1/2"
        :options="[...allClubsInDistrict.keys()]"
        v-model="chosenClub"
        :label="''"
      />
    </div>
    <BaseDisplayTable
      :show-checkboxes="false"
      v-if="allUsersInClub.length > 0"
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
      }"
      :edit-button="{
        show: true,
        callBack: (user) => {
          const id = (user as IUser).user_id
          if (id) {
            router.push({
              path: `user-form/${id}`,
              query: {
              formType: 'siteAdminClub',
            },
            });
          }
        },
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
    <div class="flex justify-center">
      <RotaryButton
        v-if="chosenId"
        @click="
          router.push({
            name: 'UserAddEdit',
            query: {
              formType: 'siteAdminClub',
              userType: 'clubUser',
              clubId: chosenId,
            },
          })
        "
        :label="langTranslations.clubsView.creatNewClubMemberLabel"
        :theme="'primary'"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
