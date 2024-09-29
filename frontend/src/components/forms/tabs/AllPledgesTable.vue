<script lang="ts">
export default {
  name: "AllPledgesTable",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref } from "vue";
import BaseDisplayTable from "@/components/tables/BaseDisplayTable.vue";
import { useActiveProjectStore } from "@/stores/ActiveProjectStore";
import H3 from "@/components/headings/H3.vue";
import type { IPledge } from "@/utils/interfaces/IPledge";
import { modalHandler } from "@/utils/composables/ModalHandler";
import { ApiClient } from "@/api/ApiClient";
import { PledgesApi } from "@/api/services/PledgesApi";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import type { CustomError } from "@/utils/classes/CustomError";

/* Data */
const pledgeApi = new PledgesApi(new ApiClient());
const { changeShowModal, setModal } = modalHandler();
const { handleError, handleSuccess } = errorHandler();

const { langTranslations } = useLanguage();
const projectPledges = ref<IPledge[]>([]);
const projectId = useActiveProjectStore().activeProject?.project_id ?? null;

const pagination = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  limit: 1000000000,
});
/* Hooks */
onMounted(async () => {
  try {
    const response = await pledgeApi.getPledgesByProject(projectId);
    projectPledges.value = response;
  } catch (error) {
    handleError(error as CustomError);
  }
});

/* Methods */
const deletePledge = async (pledge: unknown) => {
  const toDelete = pledge as IPledge;
  try {
    setModal(
      langTranslations.value.deleteLabel,
      langTranslations.value.pledgeProcess.confirmDeletePledgeLabel
    );
    const confirmed = await changeShowModal(true);
    if (toDelete.pledge_id && confirmed) {
      await pledgeApi.deletePledge(toDelete.pledge_id);
      handleSuccess(langTranslations.value.succssDeleteToast);
      const response = await pledgeApi.getPledgesByProject(projectId);
      projectPledges.value = response;
    } else if (!projectId || !toDelete.pledge_id) {
      throw new Error("Error deleting pledge");
    }
  } catch (error) {
    handleError(error as CustomError);
  }
};
</script>

<template>
  <div class="my-8">
    <div v-if="projectPledges.length > 0">
      <BaseDisplayTable
        :show-checkboxes="false"
        :handle-page-change="() => {}"
        :current-page="pagination.currentPage"
        :last-page="pagination.lastPage"
        :total-results="pagination.total"
        :limit="pagination.limit"
        :table-data="projectPledges"
        :disable-pagination="true"
        :delete-button="{
          show: true,
          callBack: deletePledge,
        }"
        :columns="[
          {
            name: langTranslations.nameLabel,
            colName: 'fullname',
          },
          {
            name: langTranslations.pledgeProcess.amountLabel,
            colName: 'pledge_amount',
            columnWidth: 'w-2/12',
            isCurrency: true,
          },
          {
            name: langTranslations.email,
            colName: 'email',
          },
          {
            name: langTranslations.phone,
            collapsable: true,
            colName: 'phone',
          },
          {
            name: langTranslations.districtLabel,
            lgScreenCollapsable: true,
            colName: 'district_number',
          },
          {
            name: langTranslations.clubLabel,
            lgScreenCollapsable: true,
            colName: 'club_name',
          },
        ]"
      />
    </div>
    <div class="text-center" v-else>
      <H3 :content="langTranslations.projectFormLabels.noPedgesLabel" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
