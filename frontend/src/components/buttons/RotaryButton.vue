<script lang="ts">
export default {
  name: "RotaryButton",
};
</script>

<script setup lang="ts">
import type { theme } from "@/utils/types/commonTypes";

defineProps<{
  theme: theme;
  label: string;
  disable?: boolean;
}>();

const themes: Record<theme, string> = {
  primary:
    "text-nearWhite bg-primary  hover:bg-primaryHover focus:ring-primaryFocus  ",
  black:
    "text-nearWhite bg-primaryNearBlack hover:bg-primaryNearBlackHover focus:ring-primaryNearBlackFocus ",
  secondary:
    "text-nearWhite bg-secondary hover:bg-secondaryHover focus:ring-secondaryFocus",
};
</script>

<template>
  <button
    :disabled="disable"
    type="button"
    :class="[themes[theme], { 'disable ': disable }]"
    class="focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 cursor-pointer"
  >
    {{ label }}
  </button>
</template>

<style lang="scss" scoped>
.disable {
  pointer-events: none;
  cursor: not-allowed;
  opacity: 0.5;
  &:hover {
    background: none;
  }
}
</style>
