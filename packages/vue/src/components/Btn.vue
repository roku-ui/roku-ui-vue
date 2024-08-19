<script setup lang="ts">
import { useColorClass, useColorStyle } from '../shared'
import type { Variant } from '../types'
import { useRounded } from '../utils/classGenerator'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    size?: 'sm' | 'md' | 'lg'
    is?: string | Component
    icon?: boolean
    pressEffect?: 'translate' | 'scale'
    variant?: Variant
    hoverVariant?: Variant
    color?: string
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
    disabled?: boolean
  }>(),
  {
    rounded: 'md',
    type: 'button',
    size: 'md',
    is: 'button',
    icon: false,
    pressEffect: 'translate',
    disabled: false,
  },
)
const rounded = useRounded(props)

const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        normalContent: 'min-w-16 h-6 px-2 py-1 text-xs',
        iconContent: 'h-6 w-6 p-1',
      }

    case 'lg':
      return {
        normalContent: 'min-w-24 h-10 px-4 py-2 text-base',
        iconContent: 'h-10 w-10 p-3',
      }
    case 'md':
    default:
      return {
        normalContent: 'min-w-20 h-8 px-3 py-1 text-sm',
        iconContent: 'h-8 w-8 p-2',
      }
  }
})
const btn = ref<HTMLElement | null>(null)
const isHover = useElementHover(btn)

const variant = computed(() => {
  if (props.hoverVariant && isHover.value) {
    return props.hoverVariant
  }
  return props.variant ?? 'default'
})
const color = computed(() => props.color ?? 'primary')
const colorClass = useColorClass(variant)
const colorStyle = useColorStyle(color, variant)
</script>

<template>
  <component
    :is="is"
    ref="btn"
    :data-size="size"
    :type="type"
    class="flex items-center justify-center gap-1 decoration-none"
    :style="[
      rounded.style,
      colorStyle,
    ]"
    :class="[
      colorClass,
      rounded.class,
      icon ? sizeCls.iconContent : sizeCls.normalContent,
      {
        'filter-grayscale pointer-events-none select-none filter-brightness-80': disabled,
        'active:translate-y-0.25': pressEffect === 'translate',
        'active:scale-98': pressEffect === 'scale',
      },
    ]"
    :disabled="disabled"
    v-bind="$attrs"
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
  </component>
</template>
