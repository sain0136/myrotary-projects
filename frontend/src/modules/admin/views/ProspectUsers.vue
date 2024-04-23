<script lang="ts">
export default {
  name: "ProspectUsers",
};
</script>

<script setup lang="ts">
import { onMounted} from "vue";
import ProspectUsersTable from "@/modules/admin/components/approvals/ProspectUsersTable.vue";

/* Data */

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