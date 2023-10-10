<script lang="ts">
export default {
  name: "Landing",
};
</script>

<script setup lang="ts">
import LandingHeader from "@/modules/home/components/LandingHeader.vue";
</script>

<template>
  <LandingHeader />
  <div class="fluid-container h-full">
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped></style>
