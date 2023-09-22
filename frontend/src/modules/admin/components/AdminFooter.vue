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
  <footer class="bg-primaryNearBlack shadow mt-auto">
    <div
      class="w-full mx-auto max-w-screen-xl text-center p-4 md:flex md:items-center md:justify-between"
    >
      <span class="text-gray-500">
        {{ langTranslations.adminDash.footerCopyright }}
      </span>
      <ul
        class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0"
      >
        <li>
          <a href="#" class="mr-4 hover:underline md:mr-6"></a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<style lang="scss" scoped></style>
