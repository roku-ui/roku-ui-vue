<script setup lang="ts">
import tinycolor from 'tinycolor2'
import { isClient } from '@vueuse/core'
import { darkTheme, lightTheme } from '../utils'
import type { ThemeData } from '../utils'

const props = withDefaults(
  defineProps<{
    is?: string
    theme?: ThemeData
  }>(),
  {
    is: 'div',
    theme() {
      if (typeof window === 'undefined') {
        return darkTheme
      }
      return document.documentElement.dataset.theme === 'dark' ? darkTheme : lightTheme
    },
  },
)

const currentTheme = ref(props.theme)
const currentThemeScheme = ref<string>(props.theme.scheme)
const rootTheme = useRootTheme()
watchEffect(() => {
  if (rootTheme.value) {
    currentThemeScheme.value = rootTheme.value
  }
})
provide('currentTheme', currentTheme)
provide('currentThemeScheme', currentThemeScheme)

type KeyOfThemeColors = keyof typeof currentTheme.value.colors
const colorVars = Object.keys(currentTheme.value.colors).map((key) => {
  const color = key as KeyOfThemeColors
  const colorValue = currentTheme.value.colors[color]
  return colorValue.reduce((acc, cur, idx) => {
    const c = tinycolor(cur).toRgb()
    acc[`--r-color-${color}-${idx}`] = `${c.r} ${c.g} ${c.b}`
    return acc
  }, {} as Record<string, string>)
}).reduce((acc, cur) => {
  return {
    ...acc,
    ...cur,
  }
}, {} as Record<string, string>)

// ------------------------------
// Calculate scrollbar width, and keep it updated
const scrollbarWidth = ref(0)
const currentScrollbar = ref(0)
if (isClient) {
  const resizeObserver = new ResizeObserver(() => {
    const curWidth = window.innerWidth - document.body.clientWidth
    if (curWidth !== 0) {
      scrollbarWidth.value = curWidth
    }
    currentScrollbar.value = curWidth
  })

  resizeObserver.observe(document.body)
}
const paddingRight = computed(() => {
  if (currentScrollbar.value === scrollbarWidth.value) {
    return `0px`
  }
  else {
    return `${scrollbarWidth.value}px`
  }
})
// ------------------------------
const colorStyles = {
  ...colorVars,
}
const themeStyles = {
  'color-scheme': currentTheme.value.scheme,
  'font-family': '\'Roboto\', sans-serif',
  'background-color': 'rgb(var(--r-color-surface-low))',
  'padding-right': paddingRight,
}
const providerStyles = Object.keys(themeStyles).map((key) => {
  return `${key}: ${(themeStyles as any)[key]}`
}).join(';')

watchEffect(() => {
  provide('theme', currentTheme.value.name)
})

const rokuProvider = ref<HTMLElement | null>(null)
</script>

<template>
  <component
    :is="is"
    id="roku-provider"
    ref="rokuProvider"
    :style="[
      colorStyles,
      providerStyles,
    ]"
    class="text-surface-on transition-background-color,border-color,color"
  >
    <slot />
  </component>
</template>
