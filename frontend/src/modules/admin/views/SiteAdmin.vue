<script lang="ts">
export default {
  name: "SiteAdmin",
};
</script>

<script setup lang="ts">
import { useLoggedInUserStore } from "@/stores/LoggedInUser";

const store = useLoggedInUserStore();
</script>

<template>
  <div>This is the site admin page</div>
  <div>{{ store.loggedInUser.fullName }}</div>
</template>

<style lang="scss" scoped></style>
