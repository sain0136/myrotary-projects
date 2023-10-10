<script lang="ts">
export default {
  name: "Landing",
};
</script>

<script setup lang="ts">
import LandingHeader from "@/modules/home/components/LandingHeader.vue";
import LandingFooter from "@/modules/home/components/LandingFooter.vue";
</script>

<template>
  <LandingHeader />
  <div class="fluid-container h-full">
    <router-view></router-view>
  </div>
  <LandingFooter />
</template>

<style lang="scss" scoped></style>
