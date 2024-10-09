<script setup lang="ts">
import type { ContainerVariant } from '../types'
import { computed } from 'vue'
import { useContainerCS } from '../shared'

const props = withDefaults(
  defineProps<{
    avatar?: string
    position?: 'left' | 'right'
    color?: string
    variant?: ContainerVariant
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
const bubbleCS = useContainerCS(variant, color)
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
      class="rounded-xl px-3 py-2"
      :class="[
        {
          'rounded-tr': position === 'right',
          'rounded-tl': position === 'left',
          'border': withBorder,
        },
        bubbleCS.class,
      ]"
      :style="[bubbleCS.style]"
    >
      <slot />
    </div>
  </div>
</template>
