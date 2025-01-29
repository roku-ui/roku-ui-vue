<script setup lang="ts">
defineProps<{
  icon?: string
  title?: string
}>()
</script>

<template>
  <div class="mb-12 mt-24">
    <h1 :id="title">
      <a
        class="font-bold decoration-none"
        :href="`#${title}`"
      >
        {{ title }}
      </a>
    </h1>
    <div class="text-sm text-surface-dimmed">
      <slot name="description" />
    </div>
  </div>
</template>
