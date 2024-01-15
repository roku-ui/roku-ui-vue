<script setup lang="ts">
defineProps<{
  features?: string[]
}>()
</script>

<template>
  <ProseH2 id="特性">
    特性
  </ProseH2>
  <div class="flex flex-col gap-2">
    <div
      v-for="f in features"
      :key="f"
      class="flex items-center gap-2 md:text-lg"
    >
      <i class="i-tabler-circle-check mr-1 w-24px flex-shrink-0 text-primary-container" />
      <span class="text-surface-onlow">{{ f }}</span>
    </div>
  </div>
</template>
