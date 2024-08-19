<script setup lang="ts">
import { isClient } from '@vueuse/core'
import type { ThemeData } from '../utils'
import { defaultTheme } from '../shared'

const props = withDefaults(
  defineProps<{
    is?: string | Component
    theme?: string
    themes?: Record<string, ThemeData>
  }>(),
  {
    is: 'div',
    theme: 'default',
    themes: () => ({
      default: defaultTheme.value,
    }),
  },
)
const themeData = computed(() => props.themes[props.theme])
const scheme = useSchemeString()
const preferScheme = usePreferredColorScheme()

watchEffect(() => {
  if (!isClient) {
    return 'dark'
  }
  if (scheme.value === 'dark') {
    document.documentElement.dataset.scheme = 'dark'
  }
  else if (scheme.value === 'light') {
    document.documentElement.dataset.scheme = 'light'
  }
  else if (preferScheme.value === 'dark') {
    document.documentElement.dataset.scheme = 'dark'
  }
  else {
    document.documentElement.dataset.scheme = 'light'
  }
  localStorage.setItem('scheme', document.documentElement.dataset.scheme)
})

provide(schemeSymbol, scheme)

const styles = computed(() => useThemeStyles(themeData.value))
provide('currentThemeData', computed(() => themeData.value))
</script>

<template>
  <component
    :is="is"
    :style="[
      styles,
    ]"
  >
    <slot />
  </component>
</template>
