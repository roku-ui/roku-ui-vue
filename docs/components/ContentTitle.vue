<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  icon?: string
}>()
</script>

<template>
  <div class="mb-12 mt-24">
    <h1>{{ title }}</h1>
    <p class="text-sm text-surface-onlow">
      {{ description }}
    </p>
  </div>
</template>
