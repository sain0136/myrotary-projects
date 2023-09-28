<script lang="ts">
export default {
  name: "BaseInput",
};
</script>

<script setup lang="ts">
import Password from "primevue/password";

defineEmits(["update:modelValue"]);

type inputType = "text" | "password" | "email" | "number" | "date";
defineProps<{
  modelValue: string | number | Date;
  label: string;
  type: inputType;
  id?: string;
  required?: boolean;
  placeholder?: string;
  errorMEssage?: string;
  disabled?: boolean;
  readonly?: boolean;
  step?: number;
  min?: number;
  max?: number;
  pattern?: string;
}>();

const randomId =
  String.fromCharCode(97 + Math.floor(Math.random() * 26)) +
  String(Math.floor(Math.random() * 5000) + 5000);
</script>

<template>
  <div class="mb-4">
    <label
      :aria-label="label"
      :for="id ?? randomId"
      class="block pl-0.5 mb-2 text-sm font-semibold text-nearBlack"
      >{{ label }}</label
    >
    <input
      :id="id ?? randomId"
      :pattern="pattern"
      :aria-label="label"
      :aria-invalid="!!errorMEssage"
      :aria-required="required"
      :max="max ?? ''"
      :min="min ?? ''"
      :step="step ?? 1"
      :readonly="readonly ?? false"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :v-model="modelValue"
      :disabled="disabled ?? false"
      :autocomplete="Password ? 'new-password' : 'off'"
      :name="type"
      :type="type"
      class="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5"
      :placeholder="placeholder ?? ''"
      :required="required ?? false"
    />
    <p v-if="errorMEssage" id="error" class="mt-2 text-sm text-red-600">
      <span class="font-medium">{{ errorMEssage }}</span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
input {
  border-color: $primary-near-black !important;
  &:focus {
    border-color: $primary; // This sets the border color when the input is focused
    box-shadow: 0 0 0 3px rgba($primary, 0.5); // This creates a focus ring around the input
  }
}
</style>
