<script lang="ts">
export default {
  name: "BaseCheckBox",
};
</script>

<script setup lang="ts">
import { onMounted } from "vue";

/* Data */
const { label, modelValue, disabled } = defineProps<{
  label: string;
  modelValue: boolean;
  disabled?: boolean;
  htmlLabel?: boolean;
}>();
defineEmits(["update:modelValue"]);

/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <div class="flex items-center mb-4">
    <input
      :checked="modelValue"
      id="default-checkbox"
      :disabled="disabled ?? false"
      :class="[disabled ? 'disabled-input' : 'text-secondary']"
      type="checkbox"
      @change="
        $emit('update:modelValue', ($event.target as HTMLInputElement).checked)
      "
      value=""
      class="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
    />
    <label
      v-if="!htmlLabel"
      for="default-checkbox"
      class="ml-2 text-sm font-medium text-gray-900"
      >{{ label }}</label
    >
    <span
      v-if="htmlLabel"
      class="ml-2 text-sm font-medium text-gray-900"
      v-html="label"
    ></span>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
input {
  border-color: $primary-near-black !important;
  &:focus {
    border-color: $primary; // This sets the border color when the input is focused
    box-shadow: 0 0 0 3px rgba($secondary, 0.5); // This creates a focus ring around the input
  }
}
</style>
