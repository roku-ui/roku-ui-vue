<script setup lang="ts">
import { useDropZone } from '@vueuse/core'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    dashed?: boolean
    accept?: string
  }>(),
  {
    dashed: true,
    accept: '*',
  },
)

const emits = defineEmits<{
  drop: [files: File[] | null]
}>()
const dropZoneRef = ref<HTMLDivElement>()
const { onChange, open } = useFileDialog({
  accept: props.accept,
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
      '': isOverDropZone,
      ' bg-surface-low': !isOverDropZone,
      'border-dashed': dashed,
    }"
    class="h-full w-full flex cursor-pointer items-center justify-center rounded transition-background-color,border-color"
    @pointerup="() => open()"
  >
    <slot />
  </div>
</template>
