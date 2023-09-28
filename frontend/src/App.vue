<script lang="ts">
export default {
  name: "App",
};
</script>
<script setup lang="ts">
import { useToast } from "primevue/usetoast";

import { ref, watch } from "vue";
import { toastHandler } from "@/utils/composables/ToastHandler";
import BaseModal from "./components/modal/BaseModal.vue";
import { modalHandler } from "@/utils/composables/ModalHandler";

const { toastRecord, refCounter } = toastHandler();
const toast = useToast();
watch(refCounter, () => {
  toast.add(toastRecord);
});
</script>

<template>
  <BaseModal />
  <div>
    <Toast />
    <main class="flex flex-col">
      <router-view></router-view>
    </main>
  </div>
</template>

<style lang="scss" scoped>
main {
  min-height: 100vh;
}
</style>
