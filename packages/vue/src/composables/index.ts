import type { RemovableRef } from '@vueuse/core'
import type { MaybeRef } from 'vue'
import type { ThemeColorValue } from '@/shared'
import { isClient, useLocalStorage } from '@vueuse/core'
import { rgb } from 'culori'
import { computed, onMounted, ref, unref } from 'vue'
import { generateColors } from '..'

export { generateEditorFriendlyColors, generateOKLCHString } from '../utils'
export * from './dom'

export const COLOR_LIGHTNESS_MAP = [
  0.98,
  0.8,
  0.7,
  0.6,
  0.45,
  0.4,
  0.37,
  0.28,
  0.2,
  0.1,
  0.05,
]
export const SURFACE_LIGHTNESS_MAP = [
  0.996,
  0.995,
  0.95,
  0.9,
  0.8,
  0.5,
  0.4,
  0.24,
  0.2,
  0.1,
  0.08,
]

function useColorTuple(color: MaybeRef<ThemeColorValue>, lightnessMap: number[] = COLOR_LIGHTNESS_MAP) {
  return computed(() => {
    const colorVal = unref(color)
    if (typeof colorVal === 'string') {
      // 使用正确的函数来获取字符串颜色数组
      return generateColors(colorVal, lightnessMap)
    }
    return colorVal
  })
}

export function useThemeStyles(theme: import('@/shared').ThemeData) {
  const currentTheme = ref(theme)
  type KeyOfThemeColors = keyof typeof currentTheme.value.colors
  const colorVars: Record<string, string> = {}
  for (const key of Object.keys(currentTheme.value.colors)) {
    const color = key as KeyOfThemeColors
    const colorValue = currentTheme.value.colors[color]
    if (!colorValue) {
      continue
    }
    const colorTuple = useColorTuple(colorValue, color === 'surface' ? SURFACE_LIGHTNESS_MAP : COLOR_LIGHTNESS_MAP)
    const colorTupleValue = [...colorTuple.value]
    for (const [idx, cur] of colorTupleValue.entries()) {
      const c = rgb(cur)
      colorVars[`--r-color-${color}-${idx}`] = c ? `${Math.round(c.r * 255)} ${Math.round(c.g * 255)} ${Math.round(c.b * 255)}` : '0 0 0'
    }
  }

  const colorStyles = {
    ...colorVars,
  }
  const themeStyles = {
    'backgroundColor': 'var(--r-surface-background-base-color)',
    'color': 'var(--r-surface-text-color)',
    '--un-default-border-color': 'var(--r-border)',
  }

  return {
    ...colorStyles,
    ...themeStyles,
  }
}

// Enhanced theme styles with editor-friendly variables (simplified)
export function useEditorFriendlyThemeStyles(theme: import('@/shared').ThemeData) {
  const currentTheme = ref(theme)
  type KeyOfThemeColors = keyof typeof currentTheme.value.colors
  const colorVars: Record<string, string> = {}

  for (const key of Object.keys(currentTheme.value.colors)) {
    const color = key as KeyOfThemeColors
    const colorValue = currentTheme.value.colors[color]
    if (!colorValue) {
      continue
    }
    const colorTuple = useColorTuple(colorValue, color === 'surface' ? SURFACE_LIGHTNESS_MAP : COLOR_LIGHTNESS_MAP)
    const colorTupleValue = [...colorTuple.value]
    for (const [idx, cur] of colorTupleValue.entries()) {
      const c = rgb(cur)
      colorVars[`--r-color-${color}-${idx}`] = c ? `${Math.round(c.r * 255)} ${Math.round(c.g * 255)} ${Math.round(c.b * 255)} /* ${cur} */` : '0 0 0'
    }
  }

  const colorStyles = {
    ...colorVars,
  }
  const themeStyles = {
    'backgroundColor': 'var(--r-surface-background-base-color)',
    'color': 'var(--r-surface-text-color)',
    '--un-default-border-color': 'var(--r-border)',
  }

  return {
    ...colorStyles,
    ...themeStyles,
  }
}

export function useId(props: { id?: string }) {
  const id = ref('')
  onMounted(() => {
    id.value = props.id || `switch-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`
  })
  return id
}

export const schemeSymbol = Symbol('scheme')

export function useSchemeString(): RemovableRef<string> {
  const scheme = useLocalStorage('scheme', 'light')
  if (isClient) {
    const observer = new MutationObserver(() => {
      if (scheme.value !== document.documentElement.dataset.scheme) {
        scheme.value = document.documentElement.dataset.scheme
      }
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-scheme'],
    })
  }
  return scheme
}
