<script lang="ts">
export default {
  name: "RotaryButton",
};
</script>

<script setup lang="ts">
// eslint-disable-next-line vue/no-dupe-keys
import type { theme } from "@/utils/types/commonTypes";
type sizes = "md" | "lg";

const props = defineProps<{
  theme: theme;
  label: string;
  disable?: boolean;
  noMargin?: boolean;
  fallthroughClasses?: string; // for additional tailwind classes
  size?: sizes;
}>();

const sizes: Record<sizes, string> = {
  md: "",
  lg: "largeButton",
};

const themes: Record<theme, string> = {
  primary:
    "text-nearWhite bg-primary  hover:bg-primaryHover focus:ring-primaryFocus  ",
  black:
    "text-nearWhite bg-primaryNearBlack hover:bg-primaryNearBlackHover focus:ring-primaryNearBlackFocus ",
  secondary:
    "text-nearWhite bg-secondary hover:bg-secondaryHover focus:ring-secondaryFocus",
};

let baseClasses = `px-5 py-2.5 focus:ring-4 font-medium rounded-lg text-sm  mr-2 mb-2 cursor-pointer ${
  props.fallthroughClasses ?? ""
}`;
</script>

<template>
  <button
    :disabled="disable"
    type="button"
    :class="[
      baseClasses,
      themes[theme],
      { 'disable ': disable },
      { 'no-margin ': noMargin },
      props.size && { [sizes[props.size]]: props.size },
    ]"
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
.no-margin {
  margin: 0;
  margin-top: 1rem;
}

.largeButton {
  padding: 2rem 2rem;
  font-size: 1.5rem;
}
</style>
