<script lang='ts'>
export default {
  name: 'App',
};

</script>
<script setup lang='ts'>
import Test from '@/modules/admin/views/Test.vue'
import { useLanguage } from '@/utils/languages/UseLanguage'
import { useToast } from "primevue/usetoast";
import { onMounted, watch } from 'vue';
import { toastHandler } from '@/utils/composables/ToastHandler'
const { langTranslations } = useLanguage()
const { toastRecord ,refCounter } = toastHandler()
const toast = useToast();

watch(refCounter, () => {
  toast.add(toastRecord)
}, )
</script>

  
<template>
  <div>
    <Toast />
    <nav class=" ">

      <div class=" font-bold text-white">
        {{ langTranslations.welcome }}
      </div>
    </nav>
    <Test />
  </div>
</template>

<style lang='scss' scoped>
div {
  height: 100%;
  margin: auto;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

nav {
  width: 100vw;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>