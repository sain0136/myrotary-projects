<script lang="ts">
export default {
  name: "Landing-Page",
};
</script>

<script setup lang="ts">
import LandingHeader from "@/modules/home/components/LandingHeader.vue";
import LandingFooter from "@/modules/home/components/LandingFooter.vue";
</script>

<template>
  <LandingHeader />

  <div class="landing-container w-full h-full flex-1">
    <router-view></router-view>
  </div>
  <LandingFooter />
</template>

<style lang="scss" scoped></style>
