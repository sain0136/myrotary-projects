<script lang="ts">
export default {
  name: "DefaultParagraph",
};
</script>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  p1: string;
  p2: string;
}>();
</script>
<template>
  <div>
    <p class="mb-3 text-gray-500">{{ p1 }}</p>
    <p class="text-gray-500">{{ p2 }}</p>
  </div>
</template>

<style lang="scss" scoped></style>
