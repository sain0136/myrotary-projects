<script lang="ts">
export default {
  name: "BaseInput",
};
</script>

<script setup lang="ts">
import Password from "primevue/password";

defineEmits(["update:modelValue"]);
let dd = 7;

type inputType = "text" | "password" | "email" | "number" | "date";
const {
  modelValue,
  label,
  type,
  id,
  required,
  placeholder,
  errorMessage: errorMEssage,
  disabled,
  readonly,
  step,
  min,
  max,
  pattern,
  inputmode,
} = defineProps<{
  modelValue: string | number | Date;
  label?: string;
  type: inputType;
  id?: string;
  required?: boolean;
  placeholder?: string;
  errorMessage?: string;
  disabled?: boolean;
  readonly?: boolean;
  step?: number;
  min?: number;
  max?: number;
  pattern?: string;
  inputmode?:
    | "text"
    | "decimal"
    | "numeric"
    | "tel"
    | "search"
    | "email"
    | "url";
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
      :inputmode="inputmode ?? 'text'"
      :id="id ?? randomId"
      :pattern="pattern"
      :aria-label="label"
      :aria-invalid="!!errorMessage"
      :aria-required="required"
      :max="max ?? ''"
      :min="min ?? ''"
      :step="step ?? 1"
      :readonly="readonly ?? false"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :value="modelValue"
      :v-model="modelValue"
      :disabled="disabled ?? false"
      :autocomplete="Password ? 'new-password' : 'off'"
      :name="type"
      :type="type"
      :class="[
        disabled ? 'disabled-input' : 'enabled-input',
        'text-nearBlack text-sm rounded-lg block w-full p-2.5',
      ]"
      class="bg-gray-50 border text-nearBlack text-sm rounded-lg block w-full p-2.5"
      :placeholder="placeholder ?? ''"
      :required="required ?? false"
    />
    <p v-if="errorMessage" id="error" class="mt-2 text-sm text-red-600">
      <span class="font-medium">{{ errorMessage }}</span>
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
