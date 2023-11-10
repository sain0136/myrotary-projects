<script lang="ts">
export default {
  name: "AllPledgesTable",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, reactive, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import BaseDisplayTable from "@/components/tables/BaseDisplayTable.vue";
import { useActiveProjectStore } from "@/stores/ActiveProjectStore";
import H3 from "@/components/headings/H3.vue";

/* Data */
const { langTranslations } = useLanguage();
const { handleError } = errorHandler();
const projectPledges = reactive(
  useActiveProjectStore().activeProject?.pledgesAssociated ?? []
);
const pagination = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  limit: 1000000000,
});
/* Hooks */
onMounted(async () => {});

/* Methods */
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
        :hideActionsColumn="true"
        :disable-pagination="true"
        :columns="[
          {
            name: langTranslations.nameLabel,
            lgScreenCollapsable: true,
            colName: 'fullname',
          },
          {
            name: langTranslations.pledgeProcess.amountLabel,
            colName: 'pledge_amount',
            columnWidth: 'w-2/12',
            isCurrency: true,
          },
          {
            name: langTranslations.landingPage.grantTypeLabel,
            lgScreenCollapsable: true,
            colName: 'email',
          },
          {
            name: langTranslations.statusLabel,
            lgScreenCollapsable: true,
            colName: 'phone',
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
