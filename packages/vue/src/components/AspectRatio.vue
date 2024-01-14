<script setup lang="ts">
withDefaults(defineProps<{
  ratio?: number
  width?: number | string
  maxWidth?: number | string
  height?: number | string
  maxHeight?: number | string
}>(), {
  ratio: 1,
})
</script>

<template>
  <div
    :style="{
      '--ar-ratio': ratio,
      'width': width,
      'max-width': maxWidth,
      'height': height,
      'max-height': maxHeight,
    }"
    class="relative children:absolute children:top-0 before:block before:h-0 children:h-full children:w-full before:pb-[calc((1/var(--ar-ratio,1))*100%)] before:content-['']"
  >
    <slot />
  </div>
</template>
