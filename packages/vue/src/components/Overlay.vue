<script setup lang="ts">
import { rgb } from 'culori'
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
const colorStyle = computed(() => {
  const colorRGB = rgb(props.color)
  if (!colorRGB) {
    return { backgroundColor: `rgba(0, 0, 0, ${props.opacity / 100})` }
  }
  return {
    backgroundColor: `rgba(${Math.round(colorRGB.r * 255)}, ${Math.round(colorRGB.g * 255)}, ${Math.round(colorRGB.b * 255)}, ${props.opacity / 100})`,
  }
})
</script>

<template>
  <div class="inline-block relative">
    <slot />
    <div
      v-bind="$attrs"
      ref="wrapperRef"
      :class="[blurCls, rounded.class, animationCls]"
      :style="[rounded.style, colorStyle]"
      class="h-full w-full left-0 top-0 absolute overflow-hidden md:items-center"
    >
      <slot name="content" />
    </div>
  </div>
</template>
