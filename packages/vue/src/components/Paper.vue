<script setup lang="ts">
import type { Component } from 'vue'
import type { Color, Rounded } from '@/types'
import { useElementBounding, useMouse } from '@vueuse/core'
import { formatHex } from 'culori'
import { computed, ref } from 'vue'
import { useColors, useComponentDefaults, useTheme } from '@/shared'
import { useRounded } from '@/utils/classGenerator'

const props = withDefaults(
  defineProps<{
    rounded?: Rounded
    loading?: boolean
    is?: string | Component
    color?: Color
    traceAnimate?: boolean
    withBorder?: boolean
    noPadding?: boolean
  }>(),
  {
    rounded: undefined,
    is: 'div',
    loading: false,
    color: 'primary',
    traceAnimate: false,
    noPadding: false,
    withBorder: undefined,
  },
)
const theme = useTheme()
const componentDefaults = useComponentDefaults('Paper')

const withBorder = computed(() => props.withBorder ?? theme.value.withBorder)
const loading = computed(() => props.loading)

// 创建带有 theme 默认值的 props 对象用于 useRounded
const effectiveProps = computed(() => ({
  ...props,
  color: props.color ?? componentDefaults?.color ?? 'primary',
  rounded: props.rounded ?? componentDefaults?.rounded ?? theme.value.rounded,
}))

const color = computed(() => effectiveProps.value.color)
const roundedCls = useRounded(effectiveProps.value)
const { x, y } = useMouse({ type: 'client' })
const paperRef = ref<HTMLElement | null>(null)
const { width, height, top, left } = useElementBounding(paperRef)

const shortEdge = computed(() => {
  return Math.min(width.value, height.value)
})

const keyFrames = computed(() => {
  if (!width.value || !height.value) {
    return []
  }
  if (!loading.value) {
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

let ani: Animation | undefined

const mainColor = computed(() => formatHex(useColors(color.value).value[5]) || '#000000')

const loadingStyle = computed(() => {
  if (props.loading) {
    if (ani) {
      ani.play()
    }
    else {
      ani = paperRef.value?.animate(keyFrames.value, {
        duration: 1000,
        iterations: Number.POSITIVE_INFINITY,
      })
    }
    return {
      '--main-color': mainColor.value,
      '--gradient': `radial-gradient(circle at center, var(--main-color) ${shortEdge.value * 0.5}px, var(--border-color) ${shortEdge.value * 0.5}px)`,
      '--border-color': 'var(--r-border)',
      '--bg': `var(--r-surface-background-color)`,
      'background': 'linear-gradient(var(--bg), var(--bg)) padding-box, var(--gradient) border-box',
      'border-color': 'transparent',
      'background-color': 'var(--bg)',
      'background-size': '200% 200%',
    }
  }
  else {
    if (ani) {
      ani.pause()
    }
    return {
      background: 'var(--r-surface-background-color)',
    }
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
      '--main-color': mainColor.value,
      '--border-color': 'var(--r-border)',
      '--bg': `var(--r-surface-background-color)`,
      '--gradient': `radial-gradient(circle at ${points.value.x - left.value}px ${points.value.y - top.value}px, var(--main-color) ${shortEdge.value * 0.5}px, var(--border-color) ${shortEdge.value * 0.5}px)`,
      'background': 'linear-gradient(var(--bg), var(--bg)) padding-box, var(--gradient) border-box',
      'background-size': '200% 200%',
      'background-color': 'var(--bg)',
    }
  }
  else {
    return {}
  }
})
</script>

<template>
  <component
    :is="is"
    ref="paperRef"
    class="border relative"
    :class="[
      {
        'p-4': !noPadding,
        'border-[var(--r-border)]': withBorder && !traceAnimate && !loading,
        'border-transparent': !withBorder || traceAnimate || loading,
      },
      roundedCls.class,
    ]"
    :style="[
      roundedCls.style,
      loadingStyle,
      traceAnimateStyle,
    ]"
  >
    <slot />
  </component>
</template>
