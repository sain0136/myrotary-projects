<script lang="ts">
export default {
  name: "NotFound",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import H1 from "@/components/headings/H1.vue";
import H2 from "@/components/headings/H2.vue";
import RotaryButton from "@/components/buttons/RotaryButton.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const { langTranslations } = useLanguage();
</script>

<template>
  <div class="text-left">
    <div>
      <div
        class="z-[-1] absolute left-0 top-0 h-[100vh] w-[100vw] rounded-sm bg-gradient-to-t from-primary to-primaryNearBlack"
      />
    </div>
    <div class="z-[1] flex h-screen items-center justify-center">
      <div class="text-center flex flex-col gap-8">
        <H2 :content="langTranslations.notfoundText" />
        <H1 class="text-7xl" content="404" />
        <H2 :content="langTranslations.opps" />
        <div class="flex justify-center gap-8">
          <RotaryButton
            @click="router.push({ name: 'Landing' })"
            :theme="'black'"
            :label="langTranslations.home"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
