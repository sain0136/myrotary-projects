<script lang="ts">
export default {
  name: "BaseTextarea",
};
</script>

<script setup lang="ts">
defineEmits(["update:modelValue"]);

const { modelValue, label, placeholder, errorMessage } = defineProps<{
  modelValue: string;
  label: string;
  placeholder?: string;
  errorMessage?: string;
  rows?: number;
}>();
</script>

<template>
  <div class="mb-4">
    <label
      :aria-label="label"
      for="message"
      class="block pl-0.5 mb-2 text-sm font-semibold text-nearBlack"
    >
      {{ label }}
    </label>
    <textarea
      :v-model="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      id="message"
      :rows="rows ?? 4"
      class="block p-2.5 w-full text-sm text-nearBlack rounded-lg"
      :placeholder="placeholder ?? ''"
      >{{ modelValue }}</textarea
    >
    <p v-if="errorMessage" id="error" class="mt-2 text-sm text-red-600">
      <span class="font-medium">{{ errorMessage }}</span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
textarea {
  border-color: $primary-near-black !important;
  &:focus {
    border-color: $primary; // This sets the border color when the input is focused
    box-shadow: 0 0 0 3px rgba($primary, 0.5); // This creates a focus ring around the input
  }
}
</style>
