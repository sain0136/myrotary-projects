<script lang="ts">
export default {
  name: "H3",
};
</script>

<script setup lang="ts">
defineProps<{
  content: string;
}>();
</script>

<template>
  <h3 class="text-lg md:text-3xl font-bold dark:text-white">{{ content }}</h3>
</template>

<style lang="scss" scoped></style>
