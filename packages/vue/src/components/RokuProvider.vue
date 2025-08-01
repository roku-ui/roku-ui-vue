<script setup lang="ts">
import type { Component } from 'vue'
import type { Theme } from '@/shared'
import type { ThemeData } from '@/utils'
import { computed, provide, ref } from 'vue'
import { schemeSymbol, useSchemeString, useThemeData, useThemeStyles } from '@/composables'
import { provideRokuProvider } from '@/composables/modal'
import { provideTheme } from '@/shared'

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
      default: useThemeData('default', {
        primary: '#0067cc',
        secondary: '#5999A6',
        tertiary: '#F76C22',
        error: '#F95858',
        surface: '#121212',
      }).value,
    }),
  },
)
const scheme = useSchemeString()
const themeData = computed(() => props.themes[props.theme])
const wrapperRef = ref<any>(null)
const styles = computed(() => useThemeStyles(themeData.value))
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
