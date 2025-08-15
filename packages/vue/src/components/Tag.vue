<script setup lang="ts">
import type { BtnVariant } from '@/types'
import { computed, useAttrs } from 'vue'
import { useComponentDefaults, useTagCS, useTheme } from '@/shared'
import { useRounded } from '..'

const props = withDefaults(defineProps<{
  color?: string
  variant?: BtnVariant
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
  size?: 'sm' | 'md' | 'lg'
}>(), {
  variant: undefined,
  rounded: undefined,
  size: undefined,
  color: undefined,
})

const _slots = defineSlots<{
  default?: (props: any) => any
  rightSection?: (props: any) => any
  leftSection?: (props: any) => any
}>()

const theme = useTheme()
const componentDefaults = useComponentDefaults('Tag')

// 创建带有 theme 默认值的有效 props
const effectiveProps = computed(() => ({
  ...props,
  size: props.size ?? componentDefaults?.size ?? theme.value.defaultSize,
  color: props.color ?? componentDefaults?.color ?? theme.value.defaultColor,
  variant: props.variant ?? componentDefaults?.variant ?? 'default',
  rounded: props.rounded ?? componentDefaults?.rounded ?? 'md',
}))

const sizeCls = computed(() => {
  switch (effectiveProps.value.size) {
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

const rounded = useRounded(effectiveProps.value)
const color = computed(() => effectiveProps.value.color)
const variant = computed(() => effectiveProps.value.variant)
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
    class="border inline-flex gap-1 h-fit items-center"
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
