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
    class="relative before:pb-[calc((1/var(--ar-ratio,1))*100%)] before:h-0 children:h-full children:w-full before:block before:content-[''] children:top-0 children:absolute"
  >
    <slot />
  </div>
</template>
