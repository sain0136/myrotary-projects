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
import BaseSelect from "@/components/form/BaseSelect.vue";
import H3 from "@/components/headings/H3.vue";

import { errorHandler } from "@/utils/composables/ErrorHandler";
import type { IDistrict } from "@/utils/interfaces/IDistrict";
import { onMounted, reactive, ref, watch } from "vue";
import { useLanguage } from "@/utils/languages/UseLanguage";
import router from "@/router";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import type { PaginationResult } from "@/utils/types/commonTypes";

import { modalHandler } from "@/utils/composables/ModalHandler";
import type { IUser } from "@/utils/interfaces/IUser";
import { UsersApi } from "@/api/services/UserApi";

/* Data */
const { langTranslations } = useLanguage();

const { handleError, handleSuccess } = errorHandler();
const districtApi = new DistrictApi(new ApiClient());
const allDistricts = reactive<Map<string, number>>(new Map());
const { changeShowModal, setModal } = modalHandler();
const allDistrictsinDistrict = reactive<IDistrict[]>([]);

const chosenDistrict = ref("");
const chosenDistrictId = ref(0);
const userApi = new UsersApi(new ApiClient());
const pagination = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  limit: 5,
});

/* Hooks */

watch(chosenDistrict, () => {
  if (chosenDistrict.value !== undefined) {
    chosenDistrictId.value = allDistricts.get(chosenDistrict.value) as number;
    Object.assign(pagination, {
      currentPage: 1,
      lastPage: 1,
      total: 0,
      limit: 5,
    });
    getDistrictAdmin();
  }
});

onMounted(async () => {
  try {
    const response = (await districtApi.getAllDistricts(
      false,
      1,
      10
    )) as PaginationResult;
    response.data.map((district) => {
      allDistricts.set(
        (district as IDistrict).district_name,
        district.district_id as number
      );
    });
  } catch (error) {
    handleError(error as CustomError);
  }
  await getDistrictAdmin();
});

// watch () => pagination.limit --> expalantion here : https://vuejs.org/guide/essentials/watchers.html#deep-watchers
watch(
  () => pagination.limit,
  async () => {
    await getDistrictAdmin();
  }
);

/* Methods */

const getDistrictAdmin = async () => {
  try {
    allDistrictsinDistrict.splice(0, allDistrictsinDistrict.length);
    const response = (await districtApi.getDistrictAdmins(
      pagination.currentPage,
      pagination.limit,
      chosenDistrictId.value,
      false
    )) as PaginationResult;

    const districtAdmins = response.data as IUser[];

    for (const user of districtAdmins) {
      if (user.role && user.role[0]) {
        user.title = user.role[0].district_role ?? "N/A";
      } else {
        user.title = "N/A";
      }

      if (user.extra_details) {
        user.districtName = user.extra_details.district_name ?? "N/A";
      } else {
        user.districtName = "N/A";
      }
    }

    Object.assign(allDistrictsinDistrict, districtAdmins);
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
    await getDistrictAdmin();
  } catch (error) {
    handleError(error as CustomError);
  }
};

const editAdmin = async (user: unknown) => {
  const toEdit = user as IUser;
  const id = toEdit.user_id;
  try {
    if (id) {
      router.push({
        path: `user-form/${id}`,
        query: {
          formType: "siteAdminDistrict",
          userType: "districtAdmin",
        },
      });
    }
    await getDistrictAdmin();
  } catch (error) {
    handleError(error as CustomError);
  }
};

const handlePageChange = (nextOrPrevious: "next" | "previous") => {
  pagination.currentPage =
    nextOrPrevious === "next"
      ? pagination.currentPage + 1
      : pagination.currentPage - 1;
  getDistrictAdmin();
};
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex mt-8 justify-center flex-col gap-4 items-center">
      <H3 :content="langTranslations.districtView.choseAdminForDistrict" />
      <BaseSelect
        class="w-1/2"
        :options="[...allDistricts.keys()]"
        v-model="chosenDistrict"
        :label="''"
      />
    </div>
    <BaseDisplayTable
      v-if="allDistrictsinDistrict.length > 0"
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
          editAdmin(user);
        },
      }"
      :table-data="allDistrictsinDistrict"
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
    <div class="flex justify-center" v-else>
      <H3 :content="langTranslations.districtView.noAdminsInDistrict" />
    </div>
    <div class="flex justify-center">
      <RotaryButton
        @click="
          router.push({
            name: 'UserAddEdit',
            query: { userType: 'districtAdmin', formType: 'siteAdminDistrict' },
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
