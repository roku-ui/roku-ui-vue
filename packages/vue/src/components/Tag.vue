<script setup lang="ts">
import type { BtnVariant } from '@/types'
import { computed } from 'vue'
import { useButtonCS } from '@/shared'
import { useRounded } from '..'

const props = withDefaults(defineProps<{
  color?: string
  variant?: BtnVariant
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: string
  rightIcon?: string
}>(), {
  variant: 'default',
  rounded: 'md',
})

const _slots = defineSlots<{
  default?: (props: any) => any
  rightIcon?: (props: any) => any
  leftIcon?: (props: any) => any
}>()

const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm': {
      return 'px-2 py-0.5 text-xs'
    }
    case 'lg': {
      return 'px-4 py-1 text-base'
    }
    // case 'md':
    default: {
      return 'px-3 py-0.5 text-sm'
    }
  }
})

const rounded = useRounded(props)
const color = computed(() => props.color ?? 'primary')
const variant = computed(() => props.variant)
const cs = useButtonCS(variant, color)
</script>

<template>
  <span
    :tabindex="-1"
    :style="[cs.style, rounded.style]"
    :class="[cs.class, rounded.class, sizeCls]"
    class="inline-block h-fit flex cursor-pointer gap-1 border"
  >
    <i
      v-if="props.leftIcon"
      :class="props.leftIcon"
      class="shrink-0"
    />
    <slot
      v-else-if="$slots.leftIcon"
      name="leftIcon"
    />
    <slot />
    <i
      v-if="props.rightIcon"
      :class="props.rightIcon"
      class="h-container w-container shrink-0"
    />
    <slot
      v-else-if="$slots.rightIcon"
      name="rightIcon"
    />
  </span>
</template>
