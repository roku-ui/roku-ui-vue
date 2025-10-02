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

  const baseDefaults = baseTheme.componentDefaults ?? {}
  const incomingDefaults = incomingTheme.componentDefaults ?? {}
  const mergedDefaults: Record<string, unknown> = {}
  const componentKeys = new Set([
    ...Object.keys(baseDefaults),
    ...Object.keys(incomingDefaults),
  ]) as Set<keyof ComponentDefaults>

  for (const componentKey of componentKeys) {
    const mergedValue = mergeComponentDefault(
      componentKey,
      baseDefaults[componentKey],
      incomingDefaults[componentKey],
    )
    if (mergedValue) {
      mergedDefaults[componentKey as string] = mergedValue
    }
  }

  return {
    ...baseTheme,
    ...incomingTheme,
    colors: mergedColors,
    componentDefaults: Object.keys(mergedDefaults).length > 0 ? mergedDefaults as ComponentDefaults : undefined,
  }
}

function mergeComponentDefault<K extends keyof ComponentDefaults>(
  _key: K,
  baseValue: ComponentDefaults[K] | undefined,
  incomingValue: ComponentDefaults[K] | undefined,
): ComponentDefaults[K] | undefined {
  if (!baseValue && !incomingValue) {
    return undefined
  }
  return Object.assign({}, baseValue ?? {}, incomingValue ?? {}) as ComponentDefaults[K]
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
