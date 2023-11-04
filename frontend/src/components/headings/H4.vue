<script lang="ts">
export default {
  name: "H4",
};
</script>

<script setup lang="ts">
defineProps<{
  content: string;
}>();
</script>

<template>
  <h3 class="text-base md:text-2xl font-bold">{{ content }}</h3>
</template>

<style lang="scss" scoped></style>
