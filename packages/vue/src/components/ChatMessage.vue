<script setup lang="ts">
import { useColorClass, useColorStyle } from '../shared'
import type { Variant } from '../types'

const props = withDefaults(
  defineProps<{
    avatar?: string
    position?: 'left' | 'right'
    color?: string
    variant?: Variant
    withBorder?: boolean
  }>(),
  {
    position: 'left',
    variant: 'default',
    withBorder: false,
    color: 'primary',
  },
)
const variant = computed(() => props.variant)
const color = computed(() => props.color)
const bubbleStyle = useColorStyle(color, variant)
const bubbleClass = useColorClass(variant)
</script>

<template>
  <div
    class="flex gap-2"
    :class="[
      {
        'flex-row-reverse': position === 'right',
        'flex-row': position === 'left',
      },
    ]"
  >
    <slot
      v-if="$slots.avatar"
      name="avatar"
    />
    <Avatar
      v-else-if="avatar"
      :src="avatar"
    />
    <div
      class="rounded-xl px-3 py-2 transition-background-color,border-color"
      :class="[
        {
          'rounded-tr': position === 'right',
          'rounded-tl': position === 'left',
          'border': withBorder,
        },
        bubbleClass,
      ]"
      :style="[bubbleStyle]"
    >
      <slot />
    </div>
  </div>
</template>
