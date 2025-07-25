<script setup lang="ts">
import type { Component } from 'vue'
import type { Theme } from '@/shared'
import type { ThemeData } from '@/utils'
import { computed, provide, ref, watchEffect } from 'vue'
import { provideRokuProvider } from '@/composables/modal'
import { defaultTheme, errorColor, primaryColor, provideTheme, secondaryColor, surfaceColor, tertiaryColor } from '@/shared'

const props = withDefaults(
  defineProps<{
    is?: string | Component
    theme?: string
    themes?: Record<string, ThemeData>
    themeObj?: Partial<Theme>
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
const themeData = computed(() => props.themes[props.theme])
watchEffect(() => {
  // TODO: Add support for tuple colors
  surfaceColor.value = typeof themeData.value.colors.surface === 'string' ? themeData.value.colors.surface : surfaceColor.value
  primaryColor.value = typeof themeData.value.colors.primary === 'string' ? themeData.value.colors.primary : primaryColor.value
  secondaryColor.value = typeof themeData.value.colors.secondary === 'string' ? themeData.value.colors.secondary : secondaryColor.value
  tertiaryColor.value = typeof themeData.value.colors.tertiary === 'string' ? themeData.value.colors.tertiary : tertiaryColor.value
  errorColor.value = typeof themeData.value.colors.error === 'string' ? themeData.value.colors.error : errorColor.value
})

const wrapperRef = ref<any>(null)
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
provideRokuProvider(wrapperRef)
if (props.themeObj) {
  provideTheme(props.themeObj)
}
</script>

<template>
  <component
    :is="is"
    ref="wrapperRef"
    :style="[
      styles,
    ]"
  >
    <slot />
  </component>
</template>
