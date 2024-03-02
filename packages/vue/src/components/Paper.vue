<script setup lang="ts">
import { useRounded } from '../utils/classGenerator'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | string | number
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
    withBorder?: boolean
    loading?: boolean
    is?: string | Component
    color?: string
  }>(),
  {
    size: 'md',
    rounded: 'md',
    withBorder: false,
    is: 'div',
    loading: false,
    color: 'primary',
  },
)

function getColorValue(color: string) {
  if (['primary', 'secondary', 'tertiary', 'error'].includes(color)) {
    return `rgb(var(--r-color-${color}-container))`
  }
  else {
    return color
  }
}

const roundedCls = useRounded(props)
const loadingStyle = computed(() => {
  if (props.loading) {
    return {
      'background': 'linear-gradient(var(--bg), var(--bg)) padding-box, var(--gradient) border-box',
      'background-color': 'var(--bg)',
      '--bg': 'rgba(var(--r-color-surface-low))',
      '--gradient': `radial-gradient(circle at center, ${getColorValue(props.color)} 25%, var(--bg) 25%)`,
      'background-size': '200% 200%',
    }
  }
  else {
    return {}
  }
})
const paperRef = ref<HTMLElement | null>(null)
const { width, height } = useElementBounding(paperRef)
const keyFrames = computed(() => {
  if (!width.value || !height.value) {
    return []
  }
  if (!props.loading) {
    return []
  }
  const res = [
    {
      backgroundPosition: '0% 0%',
      offset: 0,
    },
    {
      backgroundPosition: '0% 100%',
      offset: 0.5 * (height.value / width.value),
    },
    {
      backgroundPosition: '100% 100%',
      offset: 0.5,
    },
    {
      backgroundPosition: '100% 0%',
      offset: 1 - 0.5 * (height.value / width.value),
    },
    {
      backgroundPosition: '0% 0%',
      offset: 1,
    },
  ]
  return res
})
useAnimate(paperRef, keyFrames, {
  duration: 1000,
  iterations: Number.POSITIVE_INFINITY,
})
</script>

<template>
  <component
    :is="is"
    ref="paperRef"
    class="relative container-low rounded-lg p-4"
    :class="[
      {
        'border-transparent': !withBorder,
      },
      roundedCls.class,
    ]"
    :style="[roundedCls.style, loadingStyle]"
  >
    <slot />
  </component>
</template>
