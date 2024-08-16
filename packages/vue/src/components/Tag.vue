<script setup lang="ts">
import { computed } from 'vue'
import { useRounded } from '..'
import type { Variant } from '../types'
import { useColorClass, useColorStyle } from '../shared'

const props = withDefaults(defineProps<{
  color?: string
  variant?: Variant
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: string
  rightIcon?: string
}>(), {
  variant: 'default',
  rounded: 'md',
})

const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-2 py-0.5 text-xs'
    case 'lg':
      return 'px-4 py-1 text-base'
    case 'md':
    default:
      return 'px-3 py-0.5 text-sm'
  }
})

const rounded = useRounded(props)
const color = computed(() => props.color ?? 'primary')
const variant = computed(() => props.variant)
const colorClass = useColorClass(variant)
const colorStyle = useColorStyle(color, variant)
</script>

<template>
  <span
    :tabindex="-1"
    :style="[colorStyle, rounded.style]"
    :class="[colorClass, rounded.class, sizeCls]"
    class="inline-block h-fit flex cursor-pointer gap-1 border"
  >
    <i
      v-if="props.leftIcon"
      :class="props.leftIcon"
      class="h-container w-container shrink-0"
    />
    <slot
      v-else-if="$slots.leftIcon"
      name="left-icon"
    />
    <slot />
    <i
      v-if="props.rightIcon"
      :class="props.rightIcon"
      class="h-container w-container shrink-0"
    />
    <slot
      v-else-if="$slots.rightIcon"
      name="right-icon"
    />
  </span>
</template>
