<script setup lang="ts">
import tinycolor from 'tinycolor2'
import { useRounded } from '../utils/classGenerator'

const props = withDefaults(defineProps<{
  blur?: boolean | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
  opacity?: number
  color?: string
}>(), {
  blur: false,
  rounded: 'none',
  opacity: 30,
  color: 'black',
})

const blurCls = computed(() => {
  switch (props.blur) {
    case 'sm':
      return 'backdrop-blur-sm'
    case 'md':
    case true:
      return 'backdrop-blur-md'
    case 'lg':
      return 'backdrop-blur-lg'
    default:
      return '123'
  }
})
const rounded = useRounded(props)
const wrapperRef = ref(null)
const colorRGB = tinycolor(props.color).toRgb()
const colorStyle = computed(() => {
  return {
    backgroundColor: `rgba(${colorRGB.r}, ${colorRGB.g}, ${colorRGB.b}, ${props.opacity / 100})`,
  }
})
</script>

<template>
  <div class="relative">
    <slot />
    <div
      v-bind="$attrs"
      ref="wrapperRef"
      :class="[blurCls, rounded.class]"
      :style="[rounded.style, colorStyle]"
      class="absolute left-0 top-0 h-full w-full overflow-hidden md:items-center"
    >
      <slot name="content" />
    </div>
  </div>
</template>
