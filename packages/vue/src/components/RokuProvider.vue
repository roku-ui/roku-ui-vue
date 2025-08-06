<script setup lang="ts">
import type { Component } from 'vue'
import type { ThemeData } from '@/shared'
import { computed, provide, ref } from 'vue'
import { schemeSymbol, useSchemeString, useThemeStyles } from '@/composables'
import { provideRokuProvider } from '@/composables/modal'
import { defaultThemeData, provideTheme } from '@/shared'

const props = withDefaults(
  defineProps<{
    is?: string | Component
    themeObj?: Partial<ThemeData>
  }>(),
  {
    is: 'div',
  },
)

const scheme = useSchemeString()
const wrapperRef = ref<any>(null)

// Use themeObj if provided, otherwise use defaultThemeData
const currentTheme = computed(() => {
  if (props.themeObj) {
    return Object.assign({}, defaultThemeData, props.themeObj)
  }
  return defaultThemeData
})

const styles = computed(() => useThemeStyles(currentTheme.value))

provide(schemeSymbol, scheme)
provide('currentThemeData', currentTheme)
provideRokuProvider(wrapperRef)
provideTheme(currentTheme)
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
