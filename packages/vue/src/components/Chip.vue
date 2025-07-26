<script setup lang="ts">
import type { Color, ContainerVariant } from '@/types'
import { computed } from 'vue'
import { useContainerCS } from '@/shared'
import { useRounded } from '@/utils/classGenerator'

const props = withDefaults(
  defineProps<{
    is?: string | any
    src?: string
    size?: 'sm' | 'md' | 'lg' | string | number
    color?: Color
    variant?: ContainerVariant
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
  }>(),
  {
    size: 'md',
    is: 'img',
    rounded: 'full',
    color: 'primary',
    variant: 'default',
  },
)
const rounded = useRounded(props)
const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm': {
      return 'px-3 py-0.5 text-xs'
    }
    case 'md': {
      return 'px-4 py-0.5 text-sm'
    }
    case 'lg': {
      return 'px-5 py-0.5 text-base'
    }
    default: {
      return ''
    }
  }
})

const variant = computed(() => props.variant)
const color = computed(() => props.color)
const chipCS = useContainerCS(variant, color)
</script>

<template>
  <span
    class="inline-flex gap-1 h-fit inline-block items-center"
    :class="[rounded.class, chipCS.class, sizeCls]"
    :style="[rounded.style, chipCS.style]"
  >
    <slot
      v-if="$slots.leftSection"
      name="leftSection"
    />
    <slot />
    <slot
      v-if="$slots.rightSection"
      name="rightSection"
    />
  </span>
</template>
