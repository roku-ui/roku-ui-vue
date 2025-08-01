<script setup lang="ts">
import type { Color } from '@/types'
import { computed, useSlots } from 'vue'
import { useIndicatorFilledCS } from '@/shared'

const props = withDefaults(
  defineProps<{
    color?: Color
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
    case 'sm': {
      return 'w-2 h-2'
    }
    case 'md': {
      return 'w-3 h-3'
    }
    case 'lg': {
      return 'w-4 h-4'
    }
    default: {
      if (typeof props.size === 'number' || !Number.isNaN(Number(props.size))) {
        return `w-${props.size} h-${props.size}`
      }
      return props.size
    }
  }
})
const slots = useSlots()
const labelCls = computed(() => {
  if (!slots.label) {
    return ''
  }
  switch (props.size) {
    case 'sm': {
      return 'text-sm children:px-1.5'
    }
    case 'lg': {
      return 'text-lg children:px-2.5'
    }
    case 'md': {
      return 'text-md children:px-2'
    }
    default: {
      return 'text-md children:px-2'
    }
  }
})
const posCls = computed(() => {
  switch (props.position) {
    case 'bottom-left': {
      return 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2'
    }
    case 'bottom-right': {
      return 'bottom-0 right-0 translate-x-1/2 translate-y-1/2'
    }
    case 'top-left': {
      return 'top-0 left-0 -translate-x-1/2 -translate-y-1/2'
    }
    case 'top-right': {
      return 'top-0 right-0 translate-x-1/2 -translate-y-1/2'
    }
    default: {
      return ''
    }
  }
})

const color = computed(() => props.color)
const fillCS = useIndicatorFilledCS(color)
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
        class="border-2 border-transparent rounded-full box-content absolute animate-ping"
        :class="[
          {
            [sizeCls]: !$slots.label,
          },
          fillCS.class,
        ]"
        :style="[fillCS.style]"
      >
        <slot
          v-if="$slots.label"
          name="label"
        />
      </div>
      <div
        class="border-surface-low border-2 rounded-full box-content top-0"
        :class="[
          {
            [sizeCls]: !$slots.label,
          },
          fillCS.class,
        ]"
        :style="fillCS.style"
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
