<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    position?: 'left' | 'right'
    color?: string
    variant?: 'default' | 'transparent' | 'fill'
    withBorder?: boolean
  }>(),
  {
    variant: 'default',
    withBorder: false,
  },
)
const bubbleColor = computed(() => {
  switch (props.variant) {
    case 'default':
      return 'bg-surface-base'
    case 'fill':
      switch (props.color) {
        case 'secondary':
          return 'bg-secondary-container text-secondary-on'
        case 'tertiary':
          return 'bg-tertiary-container text-tertiary-on'
        case 'error':
          return 'bg-error-container text-error-on'
        default:
          return 'bg-primary-container text-primary-on'
      }
    case 'transparent':
    default:
      return 'bg-transparent'
  }
})
</script>

<template>
  <div
    class="w-full flex self-center gap-2 text-center"
  >
    <div
      class="w-full rounded-xl px-3 py-2 transition-background-color,border-color"
      :class="[
        bubbleColor,
      ]"
    >
      <slot />
    </div>
  </div>
</template>
