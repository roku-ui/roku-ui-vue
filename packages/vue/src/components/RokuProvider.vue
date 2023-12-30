<script setup lang="ts">
import tinycolor from 'tinycolor2'
import { darkTheme } from '../utils'
import type { ThemeData } from '../utils'

const props = withDefaults(
  defineProps<{
    is?: string
    theme?: ThemeData
  }>(),
  {
    is: 'div',
    theme() {
      return darkTheme
    },
  },
)

type KeyOfThemeColors = keyof typeof darkTheme.colors
const colorVars = Object.keys(darkTheme.colors).map((key) => {
  const color = key as KeyOfThemeColors
  const colorValue = darkTheme.colors[color]
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

const outProvider = inject('theme', null)
const themeStyles = {
  '--r-color-theme': darkTheme.theme,
  ...colorVars,
  'color-scheme': 'dark light',
  'font-family': '\'Roboto\', sans-serif',
  'background-color': 'rgb(var(--r-color-surface-low))',
}

if (!outProvider) {
  document.documentElement.style.cssText = Object.keys(themeStyles).map((key) => {
    return `${key}: ${(themeStyles as any)[key]}`
  }).join(';')
}
watchEffect(() => {
  document.documentElement.dataset.theme = props.theme.name
})
provide('theme', props.theme)

// ------------------------------
// Calculate scrollbar width, and keep it updated
const scrollbarWidth = ref(0)
const currentScrollbar = ref(0)
const resizeObserver = new ResizeObserver(() => {
  const curWidth = window.innerWidth - document.body.clientWidth
  if (curWidth !== 0) {
    scrollbarWidth.value = curWidth
  }
  currentScrollbar.value = curWidth
})

const paddingRight = computed(() => {
  if (currentScrollbar.value === scrollbarWidth.value) {
    return `0px`
  }
  else {
    return `${scrollbarWidth.value}px`
  }
})
resizeObserver.observe(document.body)
// ------------------------------
</script>

<template>
  <component
    :is="is"
    :style="[themeStyles, {
      'padding-right': paddingRight,
    }]"
  >
    <slot />
  </component>
</template>
