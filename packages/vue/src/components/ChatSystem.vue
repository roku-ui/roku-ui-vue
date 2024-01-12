<script setup lang="ts">
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
      return 'bg-transparent'
  }
})
</script>

<template>
  <div
    class="flex gap-2 self-center w-full text-center"
  >
    <div
      class="rounded-xl px-3 py-2 w-full transition-background-color,border-color"
      :class="[
        bubbleColor,
      ]"
    >
      <slot />
    </div>
  </div>
</template>
