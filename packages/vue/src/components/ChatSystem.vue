<script setup lang="ts">
import type { Color, ContainerVariant } from '@/types'
import { computed } from 'vue'
import { useContainerCS } from '@/shared'

const props = withDefaults(
  defineProps<{
    position?: 'left' | 'right'
    color?: Color
    variant?: ContainerVariant
    withBorder?: boolean
  }>(),
  {
    variant: 'default',
    withBorder: false,
    color: 'default',
  },
)
const variant = computed(() => props.variant)
const color = computed(() => props.color)
const bubbleCS = useContainerCS(variant, color)
</script>

<template>
  <div
    class="text-center flex gap-2 w-full self-center"
  >
    <div
      class="px-3 py-2 rounded-xl w-full"
      :class="[
        bubbleCS.class,
      ]"
      :style="bubbleCS.style"
    >
      <slot />
    </div>
  </div>
</template>
