<script setup lang="ts">
import type { BtnVariant } from '@/types'
import { computed, useAttrs } from 'vue'
import { useTagCS } from '@/shared'
import { useRounded } from '..'

const props = withDefaults(defineProps<{
  color?: string
  variant?: BtnVariant
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
  size?: 'sm' | 'md' | 'lg'
}>(), {
  variant: 'default',
  rounded: 'md',
})

const _slots = defineSlots<{
  default?: (props: any) => any
  rightSection?: (props: any) => any
  leftSection?: (props: any) => any
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
const hasInteraction = computed(() => {
  // 检测是否有点击相关的事件监听器
  const attrs = useAttrs()
  return !!(attrs.onClick || attrs.onDblclick || attrs.onMousedown || attrs.onMouseup)
})
const cs = useTagCS(variant, color, hasInteraction)
</script>

<template>
  <span
    :tabindex="-1"
    :style="[cs.style, rounded.style]"
    :class="[cs.class, rounded.class, sizeCls, { 'cursor-pointer': hasInteraction }]"
    class="h-fit inline-flex items-center gap-1 border"
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
