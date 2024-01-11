<script setup lang="ts">
import { useDropZone } from '@vueuse/core'

const emits = defineEmits<{
  drop: [files: File[] | null]
}>()
const dropZoneRef = ref<HTMLDivElement>()
const { onChange, open } = useFileDialog({
  accept: 'image/*',
})

onChange((files) => {
  if (files) {
    emits('drop', Array.from(files))
  }
  else {
    emits('drop', null)
  }
})

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop: (files) => {
    emits('drop', files)
  },
})
</script>

<template>
  <div
    ref="dropZoneRef"
    :class="{
      'bg-primary-container/10 border-primary-container/40 border text-primary-on': isOverDropZone,
      'btn-default hover:bg-surface-high': !isOverDropZone,
    }"
    class="w-full h-full flex items-center justify-center cursor-pointer rounded border-dotted"
    @pointerup="() => open()"
  >
    <slot />
  </div>
</template>
