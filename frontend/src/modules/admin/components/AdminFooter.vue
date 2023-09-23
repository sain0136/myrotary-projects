<script lang="ts">
export default {
  name: "AdminFooter",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";

const { langTranslations } = useLanguage();
</script>

<template>
  <footer class="bg-primaryNearBlack shadow mt-auto text-center md:ml-64">
    <div
      class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between"
    >
      <span class="text-nearWhite font-bold">
        {{
          langTranslations.adminDash.footerCopyright +
          " " +
          new Date().getFullYear() +
          " " +
          "MyRotaryProjects"
        }}
      </span>
    </div>
  </footer>
</template>

<style lang="scss" scoped></style>
