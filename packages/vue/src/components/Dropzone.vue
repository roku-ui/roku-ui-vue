<script setup lang="ts">
import { useDropZone } from '@vueuse/core'
import { ref } from 'vue'
import { useButtonCS, useContainerDefaultVariantCS } from '@/shared'

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
    emits('drop', [...files])
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
const cs = useButtonCS('default')
const dropCS = useContainerDefaultVariantCS()
</script>

<template>
  <div
    ref="dropZoneRef"
    :class="[
      cs.class,
      isOverDropZone && dropCS.class,
      {
        'bg-surface-low': !isOverDropZone,
        'border-dashed': dashed,
      }]"
    :style="[cs.style, isOverDropZone && dropCS.style]"
    class="h-full w-full flex cursor-pointer items-center justify-center border rounded"
    @pointerup="() => open()"
  >
    <slot />
  </div>
</template>
