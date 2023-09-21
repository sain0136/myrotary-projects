<script lang="ts">
export default {
  name: "H1",
};
</script>

<script setup lang="ts">
import { defineProps } from "vue";
defineProps<{
  content: string;
}>();
</script>

<template>
  <h1 class="text-2xl md:text-5xl font-extrabold">{{ content }}</h1>
</template>

<style lang="scss" scoped></style>
