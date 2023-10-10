<script lang="ts">
export default {
  name: "DistrictAdminsTable",
};
</script>

<script setup lang="ts">
import { ApiClient } from "@/api/ApiClient";
import { DistrictApi } from "@/api/services/DistrictsApi";
import BaseDisplayTable from "@/components/tables/BaseDisplayTable.vue";
import type { CustomError } from "@/utils/classes/CustomError";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import type { IDistrict } from "@/utils/interfaces/IDistrict";
import { onMounted, reactive, ref, watch } from "vue";
import { useLanguage } from "@/utils/languages/UseLanguage";
import router from "@/router";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { modalHandler } from "@/utils/composables/ModalHandler";
import type { IUser } from "@/utils/interfaces/IUser";
import { UsersApi } from "@/api/services/UserApi";

/* Data */
const { langTranslations } = useLanguage();
const { handleError, handleSuccess } = errorHandler();
const districtApi = new DistrictApi(new ApiClient());
const allDistricts = reactive<IDistrict[]>([]);
const { changeShowModal, setModal } = modalHandler();
const allAdmins = reactive<IUser[]>([]);
const userApi = new UsersApi(new ApiClient());
const pagination = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  limit: 5,
});
/* Hooks */
onMounted(async () => {
  await getAllAdmins();
});
// watch () => pagination.limit --> expalantion here : https://vuejs.org/guide/essentials/watchers.html#deep-watchers
watch(
  () => pagination.limit,
  async () => {
    await getAllAdmins();
  }
);

/* Methods */
const getAllAdmins = async () => {
  try {
    allAdmins.splice(0, allAdmins.length);
    const response = await districtApi.getDistrictAdmins(
      pagination.currentPage,
      pagination.limit,
      1,
      true
    );
    const districtAdmins = response.data as IUser[];
    for (const user of districtAdmins) {
      user.title = user.role[0]?.district_role ?? "N/A";
      user.districtName = user.extra_details?.district_name ?? "N/A";
    }
    Object.assign(allAdmins, districtAdmins);
    pagination.currentPage = response.meta.current_page;
    pagination.lastPage = response.meta.last_page;
    pagination.total = response.meta.total;
  } catch (error) {
    handleError(error as CustomError);
  }
};
const deleteAdmin = async (user: unknown) => {
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
    await getAllAdmins();
  } catch (error) {
    handleError(error as CustomError);
  }
};

const handlePageChange = (nextOrPrevious: "next" | "previous") => {
  pagination.currentPage =
    nextOrPrevious === "next"
      ? pagination.currentPage + 1
      : pagination.currentPage - 1;
  getAllAdmins();
};
</script>

<template>
  <div class="flex flex-col gap-8">
    <BaseDisplayTable
      :multi-select-delete="(selectedItems) => {}"
      :show-checkboxes="false"
      :handle-page-change="handlePageChange"
      :current-page="pagination.currentPage"
      :last-page="pagination.lastPage"
      :total-results="pagination.total"
      :limit="pagination.limit"
      @update:limit="pagination.limit = $event"
      :delete-button="{
        show: true,
        callBack: (user) => {
          deleteAdmin(user);
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
                userType: 'districtAdmin'
              }
            });
          }
        },
      }"
      :table-data="allAdmins"
      :columns="[
        {
          name: langTranslations.nameLabel,
          colName: 'fullName',
          columnWidth: 'w-2/12',
        },
        {
          name: langTranslations.districtLabel,
          collapsable: true,
          colName: 'districtName',
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
        @click="
          router.push({
            name: 'UserAddEdit',
            query: { userType: 'districtAdmin' },
          })
        "
        :label="
          langTranslations.createLabel + ' ' + langTranslations.adminLabel
        "
        :theme="'primary'"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
