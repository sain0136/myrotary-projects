<script lang="ts">
export default {
  name: "Hr",
};
</script>

<script setup lang="ts">
const { heightInPixels } = defineProps<{
  heightInPixels?: string;
}>();
</script>

<template>
  <hr
    :class="[
      {
        'h-px': !heightInPixels,
        [`h-${heightInPixels}`]: heightInPixels,
      },
    ]"
    class="h-0.5 my-8 bg-gray-500 border-0"
  />
</template>

<style lang="scss" scoped></style>
