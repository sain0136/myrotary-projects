<script lang="ts">
export default {
  name: "BaseDisplayInput",
};
</script>

<script setup lang="ts">
type inputType = "text";

const { modelValue, label } = defineProps<{
  modelValue: string | number | Date;
  label: string;
}>();
const randomId =
  String.fromCharCode(97 + Math.floor(Math.random() * 26)) +
  String(Math.floor(Math.random() * 5000) + 5000);
</script>

<template>
  <div class="mb-4">
    <label
      :aria-label="label"
      :for="randomId"
      class="block pl-0.5 mb-2 text-sm font-semibold text-nearBlack"
      >{{ label }}</label
    >
    <input :value="modelValue" :id="randomId" disabled class="mb-8 py-4" />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
