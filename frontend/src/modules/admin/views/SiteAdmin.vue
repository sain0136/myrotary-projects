<script lang="ts">
export default {
  name: "SiteAdmin",
};
</script>

<script setup lang="ts">
import AdminFooter from "@/modules/admin/components/AdminFooter.vue";
import AdminHeader from "@/modules/admin/components/AdminHeader.vue";
import { useLanguage } from "@/utils/languages/UseLanguage";
import { ref } from "vue";
import SideNavigation from "@/modules/admin/components/SideNavigation.vue";
/* Data */
const { languagePref } = useLanguage();
const drawer = ref(false);
</script>

<template>
  <div class="dash-container flex flex-grow">
    <div class="antialiased bg-nearWhite dark:bg-gray-900 flex flex-col w-full">
      <AdminHeader :drawer-val="drawer" v-model="drawer" />
      <SideNavigation :key="languagePref" v-model="drawer" :drawer="drawer" />
      <main :key="languagePref" class="p-4 md:ml-64 h-full pt-20">
        <div class="fluid-container h-full">
          <router-view></router-view>
        </div>
      </main>
      <AdminFooter />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
