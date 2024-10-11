<script setup lang="ts">
import type { Color, ContainerVariant } from '@/types'
import { useContainerCS } from '@/shared'
import { computed } from 'vue'

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
    class="w-full flex self-center gap-2 text-center"
  >
    <div
      class="w-full rounded-xl px-3 py-2"
      :class="[
        bubbleCS.class,
      ]"
      :style="bubbleCS.style"
    >
      <slot />
    </div>
  </div>
</template>
