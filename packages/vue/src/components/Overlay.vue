<script setup lang="ts">
import tinycolor from 'tinycolor2'
import { computed, ref } from 'vue'
import { useRounded } from '@/utils/classGenerator'

const props = withDefaults(defineProps<{
  blur?: boolean | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
  opacity?: number
  color?: string
  animation?: boolean
}>(), {
  blur: false,
  rounded: 'none',
  opacity: 30,
  color: 'black',
  animation: false,
})

const blurCls = computed(() => {
  switch (props.blur) {
    case 'sm': {
      return 'backdrop-blur-sm'
    }
    case 'md':
    case true: {
      return 'backdrop-blur-md'
    }
    case 'lg': {
      return 'backdrop-blur-lg'
    }
    default: {
      return ''
    }
  }
})

const animationCls = computed(() => {
  return props.animation ? 'transition-all duration-300 ease-in-out' : ''
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
  <div class="relative inline-block">
    <slot />
    <div
      v-bind="$attrs"
      ref="wrapperRef"
      :class="[blurCls, rounded.class, animationCls]"
      :style="[rounded.style, colorStyle]"
      class="absolute left-0 top-0 h-full w-full overflow-hidden md:items-center"
    >
      <slot name="content" />
    </div>
  </div>
</template>
