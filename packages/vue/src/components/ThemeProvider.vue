<script setup lang="ts">
import type { ComponentDefaults, ThemeData } from '@/shared'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import { useThemeStyles } from '@/composables'
import { defaultThemeData, provideTheme, useTheme } from '@/shared'

const props = defineProps<{
  theme?: ThemeData
  scheme?: string
}>()

function mergeTheme(
  baseTheme: ThemeData,
  incomingTheme?: ThemeData,
): ThemeData {
  if (!incomingTheme) {
    return baseTheme
  }

  const mergedColors = {
    ...baseTheme.colors,
    ...incomingTheme.colors,
  }

  const baseComponentDefaults: ComponentDefaults = baseTheme.componentDefaults
    ? { ...baseTheme.componentDefaults }
    : {}
  const incomingComponentDefaults: ComponentDefaults = incomingTheme.componentDefaults ?? {}
  const mergedComponentDefaults: ComponentDefaults = { ...baseComponentDefaults }
  for (const key of Object.keys(incomingComponentDefaults)) {
    const componentKey = key as keyof ComponentDefaults
    mergedComponentDefaults[componentKey] = {
      ...baseComponentDefaults[componentKey],
      ...incomingComponentDefaults[componentKey],
    }
  }

  return {
    ...baseTheme,
    ...incomingTheme,
    colors: mergedColors,
    componentDefaults: Object.keys(mergedComponentDefaults).length > 0 ? mergedComponentDefaults : undefined,
  }
}

const parentTheme = useTheme()
const resolvedTheme = computed<ThemeData>(() => {
  const baseTheme = parentTheme.value ?? defaultThemeData
  return mergeTheme(baseTheme, props.theme)
})
const styles = computed(() => useThemeStyles(resolvedTheme.value))
const localStorageScheme = useLocalStorage('scheme', 'light')
const scheme = computed(() => props.scheme || localStorageScheme.value)

provideTheme(resolvedTheme)
</script>

<template>
  <div
    :style="[styles]"
    :data-scheme="scheme"
    data-theme="default"
  >
    <slot />
  </div>
</template>
