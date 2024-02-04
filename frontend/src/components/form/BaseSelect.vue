<script lang="ts">
export default {
  name: "BaseSelect",
};
</script>

<script setup lang="ts">
defineEmits(["update:modelValue"]);

/* Data */
const {
  options,
  modelValue,
  label,
  errorMessage,
  disabled,
  labelClass,
  selectWidth,
  flexView,
} = defineProps<{
  label?: string;
  labelClass?: string;
  errorMessage?: string;
  modelValue: string | number;
  options: string[];
  disabled?: boolean;
  selectWidth?: string;
  flexView?: boolean;
}>();

const baseStyling = `block pl-0.5 mb-2 text-nearBlack ${
  !labelClass ? "font-semibold text-sm" : ""
} ${labelClass ?? ""}`;
</script>

<template>
  <div :class="[flexView ? 'flex flex-col justify-center items-center' : '']">
    <label v-if="label" :for="label" :class="baseStyling">{{ label }}</label>
    <select
      :disabled="disabled ?? false"
      :value="modelValue"
      :id="label"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :class="[
        disabled ? 'disabled-input' : 'text-nearBlack',
        !selectWidth ? 'w-full' : selectWidth,
      ]"
      class="bg-gray-50 border border-gray-300 rounded-lg text-sm block p-2.5"
    >
      <option
        v-for="option in options"
        :key="option"
        :value="option"
        :selected="option === modelValue"
      >
        {{ option }}
      </option>
    </select>
    <p v-if="errorMessage" id="error" class="mt-2 text-sm text-red-600">
      <span class="font-medium">{{ errorMessage }}</span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
select {
  border-color: $primary-near-black !important;
  &:focus {
    border-color: $primary; // This sets the border color when the input is focused
    box-shadow: 0 0 0 3px rgba($primary, 0.5); // This creates a focus ring around the input
  }
}
</style>
