<script lang="ts">
export default {
  name: "ProspectUsers",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
import BaseInput from "@/components/form/BaseInput.vue";
import type BaseDisplayTable from "@/components/tables/BaseDisplayTable.vue";
import type { CustomError } from "@/utils/classes/customError";
import ProspectUsersTable from "@/modules/admin/components/approvals/ProspectUsersTable.vue";
import { CustomErrors } from "@/utils/classes/CustomErrors";
import { UsersApi } from "@/api/services/UserApi";
import { ApiClient } from "@/api/ApiClient";

/* Data */
const { langTranslations } = useLanguage();
const { handleError } = errorHandler();
const userApi = new UsersApi(new ApiClient());
// const { exampleProperty } = defineProps<{
//   exampleProperty: string;
// }>();

/* Hooks */
onMounted(async () => {
});

/* Methods */

</script>

<template>
 <ProspectUsersTable/>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>