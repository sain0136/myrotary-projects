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
    type="button"
    :class="themes[theme]"
    class="focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
  >
    {{ label }}
  </button>
</template>

<style lang="scss" scoped></style>
