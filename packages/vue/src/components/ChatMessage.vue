<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    avatar?: string
    position?: 'left' | 'right'
    color?: string
    variant?: 'default' | 'transparent' | 'filled'
    withBorder?: boolean
  }>(),
  {
    position: 'left',
    variant: 'default',
    withBorder: false,
  },
)
const bubbleColor = computed(() => {
  switch (props.variant) {
    case 'default':
      return 'bg-surface-base'
    case 'filled':
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
        bubbleColor,
      ]"
    >
      <slot />
    </div>
  </div>
</template>
