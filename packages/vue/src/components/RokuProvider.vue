<script setup lang="ts">
import type { ThemeData } from '@/utils'
import { isClient } from '@vueuse/core'
import { type Component, computed, provide, watchEffect } from 'vue'
import { defaultTheme, errorColor, primaryColor, secondaryColor, surfaceColor, tertiaryColor } from '../shared'

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
const scheme = useSchemeString()
const preferScheme = usePreferredColorScheme()
const themeData = computed(() => props.themes[props.theme])
watchEffect(() => {
  // TODO: Add support for tuple colors
  surfaceColor.value = typeof themeData.value.colors.surface === 'string' ? themeData.value.colors.surface : surfaceColor.value
  primaryColor.value = typeof themeData.value.colors.primary === 'string' ? themeData.value.colors.primary : primaryColor.value
  secondaryColor.value = typeof themeData.value.colors.secondary === 'string' ? themeData.value.colors.secondary : secondaryColor.value
  tertiaryColor.value = typeof themeData.value.colors.tertiary === 'string' ? themeData.value.colors.tertiary : tertiaryColor.value
  errorColor.value = typeof themeData.value.colors.error === 'string' ? themeData.value.colors.error : errorColor.value
})

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

const styles = computed(() => useThemeStyles({
  colors: {
    surface: surfaceColor.value,
    primary: primaryColor.value,
    secondary: secondaryColor.value,
    tertiary: tertiaryColor.value,
    error: errorColor.value,
  },
  name: themeData.value.name,
}))
provide(schemeSymbol, scheme)
provide('currentThemeData', computed(() => themeData.value))
</script>

<template>
  <component
    :is="is"
    :style="[
      styles,
    ]"
    class="bg-[--l-bg] text-[--l-text] dark:bg-[--d-bg] dark:text-[--d-text]"
  >
    <slot />
  </component>
</template>
