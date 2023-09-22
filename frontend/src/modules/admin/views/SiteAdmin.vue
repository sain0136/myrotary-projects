<script lang="ts">
export default {
  name: "SiteAdmin",
};
</script>

<script setup lang="ts">
import AdminFooter from "@/modules/admin/components/AdminFooter.vue";
</script>

<template>
  <div class="fluid-container">
    <router-view></router-view>
  </div>
  <AdminFooter />
</template>

<style lang="scss" scoped></style>
