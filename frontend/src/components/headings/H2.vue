<script lang="ts">
export default {
  name: "H2",
};
</script>

<script setup lang="ts">
import { defineProps } from "vue";
defineProps<{
  content: string;
}>();
</script>
<template>
  <h2 class="text-4xl font-bold dark:text-white">{{ content }}</h2>
</template>

<style lang="scss" scoped></style>
