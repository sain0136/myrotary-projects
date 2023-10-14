<script lang="ts">
export default {
  name: "Banners",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";

/* Data */
const { bannerText } = defineProps<{
  bannerText: string;
}>();
const { langTranslations } = useLanguage();

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <div class="w-full">
    <h1 class="header_h1 text-3xl md:text-7xl">{{ bannerText }}</h1>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.header_h1 {
  text-transform: capitalize;
  text-align: center;
  background-color: #404040;
  padding-bottom: 3rem;
  padding-top: 3rem;
  font-weight: 800;
  color: $nearWhite;
  font-family: "Montserrat", sans-serif;
}
</style>
