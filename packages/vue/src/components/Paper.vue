<script setup lang="ts">
import { useColorStyleWithKey } from '../shared'
import type { Rounded } from '../types'
import { useRounded } from '../utils/classGenerator'

const props = withDefaults(
  defineProps<{
    rounded?: Rounded
    loading?: boolean
    is?: string | Component
    color?: string
    traceAnimate?: boolean
    withBorder?: boolean
    noPadding?: boolean
  }>(),
  {
    rounded: 'md',
    withBorder: false,
    is: 'div',
    loading: false,
    color: 'primary',
    traceAnimate: false,
    noPadding: false,
  },
)

const color = computed(() => props.color)
const colorStyle = useColorStyleWithKey(color, ['fill'])

const roundedCls = useRounded(props)
const { x, y } = useMouse({ type: 'client' })
const paperRef = ref<HTMLElement | null>(null)
const { width, height, top, left } = useElementBounding(paperRef)

const shortEdge = computed(() => {
  return Math.min(width.value, height.value)
})
const loadingStyle = computed(() => {
  if (props.loading) {
    return {
      'background': 'linear-gradient(var(--bg), var(--bg)) padding-box, var(--gradient) border-box',
      'background-color': 'var(--bg)',
      '--bg': 'rgba(var(--r-color-surface-low) / 1)',
      '--gradient': `radial-gradient(circle at center, var(--l-fill) ${shortEdge.value * 0.5}px, var(--bg) ${shortEdge.value * 0.5}px)`,
      'background-size': '200% 200%',
    }
  }
  else {
    return {}
  }
})

const traceAnimateStyle = computed(() => {
  if (props.traceAnimate) {
    const center = computed(() => {
      return {
        x: left.value + width.value / 2,
        y: top.value + height.value / 2,
      }
    })
    const points = computed(() => {
      // 如果 x, y 在 paperRef 之外
      if (x.value < left.value || x.value > left.value + width.value || y.value < top.value || y.value > top.value + height.value) {
        return {
          x: x.value,
          y: y.value,
        }
      }
      const centerX = center.value.x
      const centerY = center.value.y

      // Otherwise, calculate the intersection point with paperRef boundaries
      let intersectionX, intersectionY

      // Calculate slope of line from center to (x, y)
      const slope = (y.value - centerY) / (x.value - centerX)

      // Calculate intersection points with paperRef boundaries
      if (x.value < centerX) { // Left side of paperRef
        intersectionX = left.value
        intersectionY = centerY + slope * (left.value - centerX)
      }
      else { // Right side of paperRef
        intersectionX = left.value + width.value
        intersectionY = centerY + slope * (intersectionX - centerX)
      }

      // Check if intersectionY is within paperRef height, adjust if necessary
      if (intersectionY < top.value) {
        intersectionY = top.value
        intersectionX = centerX + (intersectionY - centerY) / slope
      }
      else if (intersectionY > top.value + height.value) {
        intersectionY = top.value + height.value
        intersectionX = centerX + (intersectionY - centerY) / slope
      }
      return {
        x: intersectionX,
        y: intersectionY,
      }
    })
    return {
      '--bg': `rgba(var(--r-color-surface-low) / 1)`,
      '--gradient': `radial-gradient(circle at ${points.value.x - left.value}px ${points.value.y - top.value}px, var(--l-fill) ${shortEdge.value * 0.5}px, var(--bg) ${shortEdge.value * 0.5}px)`,
      'background': 'linear-gradient(var(--bg), var(--bg)) padding-box, var(--gradient) border-box',
      'background-size': '200% 200%',
      'background-color': 'var(--bg)',
    }
  }
  else {
    return {}
  }
})

const keyFrames = computed(() => {
  if (!width.value || !height.value) {
    return []
  }
  if (!props.loading) {
    return []
  }
  const res = [
    {
      backgroundPosition: `0% 0%`,
      offset: 0,
    },
    {
      backgroundPosition: '0% 100%',
      offset: 0.25,
    },
    {
      backgroundPosition: '100% 100%',
      offset: 0.5,
    },
    {
      backgroundPosition: '100% 0%',
      offset: 0.75,
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
    class="relative container-low transition-background-color,border-color,color"
    :class="[
      {
        'border-transparent': !withBorder,
        'p-4': !noPadding,
      },
      roundedCls.class,
    ]"
    :style="[roundedCls.style, loadingStyle, traceAnimateStyle, colorStyle]"
  >
    <slot />
  </component>
</template>
