<script lang="ts">
export default {
  name: "BaseSelect",
};
</script>

<script setup lang="ts">
import { useLanguage } from "@/utils/languages/UseLanguage";
import { onMounted, ref } from "vue";
import { errorHandler } from "@/utils/composables/ErrorHandler";
defineEmits(["update:modelValue"]);

/* Data */
const { langTranslations } = useLanguage();
const { options, modelValue, defaultOption, label, errorMessage, disabled } =
  defineProps<{
    label?: string;
    errorMessage?: string;
    modelValue: string | number;
    defaultOption?: string;
    options: string[];
    disabled?: boolean;
  }>();
/* Hooks */
onMounted(async () => {});

/* Methods */
</script>

<template>
  <div>
    <label
      v-if="label"
      :for="label"
      class="block pl-0.5 mb-2 text-sm font-semibold text-nearBlack"
      >{{ label }}</label
    >
    <select
      :disabled="disabled ?? false"
      :value="modelValue"
      :id="label"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :class="[disabled ? 'disabled-input' : 'text-nearBlack']"
      class="bg-gray-50 border border-gray-300 rounded-lg text-sm block w-full p-2.5"
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
