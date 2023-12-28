<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
    size?: 'sm' | 'md' | 'lg' | string | number
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom' | 'left' | 'right'
    ping?: boolean
  }>(),
  {
    size: 'md',
    position: 'top-right',
    color: 'primary',
  },
)
const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-2 h-2'
    case 'md':
      return 'w-3 h-3'
    case 'lg':
      return 'w-4 h-4'
    default:
      if (typeof props.size === 'number' || !Number.isNaN(Number(props.size))) {
        return `w-${props.size} h-${props.size}`
      }
      return props.size
  }
})
const slots = useSlots()
const labelCls = computed(() => {
  if (!slots.label) {
    return ''
  }
  switch (props.size) {
    case 'sm':
      return 'text-sm children:px-1.5'
    case 'md':
      return 'text-md children:px-2'
    case 'lg':
      return 'text-lg children:px-2.5'
  }
})
const posCls = computed(() => {
  switch (props.position) {
    case 'top-left':
      return 'top-0 left-0 -translate-x-1/2 -translate-y-1/2'
    case 'top-right':
      return 'top-0 right-0 translate-x-1/2 -translate-y-1/2'
    case 'bottom-left':
      return 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2'
    case 'bottom-right':
      return 'bottom-0 right-0 translate-x-1/2 translate-y-1/2'
  }
})

const colorCls = computed(() => {
  switch (props.color) {
    case 'primary':
      return 'bg-primary-7'
    case 'secondary':
      return 'bg-secondary-7'
    case 'tertiary':
      return 'bg-tertiary-7'
    case 'error':
      return 'bg-error-7'
  }
})
</script>

<template>
  <div
    class="relative"
  >
    <div
      :class="[posCls, labelCls]"
      class="absolute z-1"
    >
      <div
        v-if="props.ping"
        class="absolute animate-ping rounded-full"
        :class="[
          {
            [sizeCls]: !$slots.label,
          },
          colorCls,
        ]"
      >
        <slot
          v-if="$slots.label"
          name="label"
        />
      </div>
      <div
        class="top-0 rounded-full"
        :class="[
          {
            [sizeCls]: !$slots.label,
          },
          colorCls,
        ]"
      >
        <slot
          v-if="$slots.label"
          name="label"
        />
      </div>
    </div>
    <slot />
  </div>
</template>
