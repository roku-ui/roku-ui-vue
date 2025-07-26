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
      class="flex gap-2 items-center md:text-lg"
    >
      <i
        v-bind="textCS"
        class="i-tabler-circle-check mr-1 flex-shrink-0 w-24px"
      />
      <span class="text-surface-dimmed">{{ f }}</span>
    </div>
  </div>
</template>
