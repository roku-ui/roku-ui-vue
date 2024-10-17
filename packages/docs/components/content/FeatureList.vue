<script setup lang="ts">
import { useTextCS } from '@roku-ui/vue'

defineProps<{
  features?: string[]
}>()

const textCS = useTextCS('primary')
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
      <i
        v-bind="textCS"
        class="i-tabler-circle-check mr-1 w-24px flex-shrink-0"
      />
      <span class="text-surface-on-low">{{ f }}</span>
    </div>
  </div>
</template>
