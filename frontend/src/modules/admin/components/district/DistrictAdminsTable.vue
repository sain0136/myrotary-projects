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
import { onMounted, reactive, ref } from "vue";
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
const currentPage = ref(1);
const allAdmins = reactive<IUser[]>([]);
const userApi = new UsersApi(new ApiClient());
/* Hooks */
onMounted(async () => {
  try {
    const response = await districtApi.getDistrictAdmins(
      currentPage.value,
      10,
      1,
      true
    );
    const districtAdmins = response.data as IUser[];
    for (const user of districtAdmins) {
      user.title = user.role[0].district_role ?? "N/A";
      user.districtName = user.extra_details.district_name ?? "N/A";
    }
    Object.assign(allAdmins, districtAdmins);
    currentPage.value = response.meta.current_page;
  } catch (error) {
    handleError(error as CustomError);
  }
});
/* Methods */
</script>

<template>
  <div class="flex flex-col gap-8">
    <BaseDisplayTable
      :delete-button="{
        show: true,
        callBack: async (user ) => {
          const toDelete =(user as IUser)
          const id = toDelete.user_id
          try {
            setModal(langTranslations.deleteLabel, langTranslations.confirmationDelete + ' ' + toDelete.fullName )
           const confirmed = await changeShowModal(true)
            if (id && confirmed) {
              await userApi.deleteUser(id)
              handleSuccess(langTranslations.succssDeleteToast)
          }
          } catch (error) {
            handleError(error as CustomError);
          }
          router.go(0)
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
