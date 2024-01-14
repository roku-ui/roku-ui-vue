<script setup lang="ts">
defineProps<{
  icon?: string
}>()
</script>

<template>
  <div class="mb-12 mt-24">
    <ProseH1 class="mb-1">
      <slot />
    </ProseH1>
    <div class="text-sm text-surface-onlow">
      <slot name="description" />
    </div>
  </div>
</template>
