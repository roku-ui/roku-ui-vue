import type { RemovableRef } from '@vueuse/core'
import type { MaybeRef, Ref } from 'vue'
import type { ColorsTuple, ThemeData } from '..'
import { isClient, useLocalStorage } from '@vueuse/core'
import { rgb } from 'culori'
import { computed, inject, onMounted, readonly, ref, unref } from 'vue'
import { generateColors, generateColorsObjMap, generateColorsOKLCH } from '..'

export { generateEditorFriendlyColors, generateOKLCHString } from '../utils'
export * from './dom'

export const COLOR_LIGHTNESS_MAP = [
  0.98,
  0.8,
  0.7,
  0.6,
  0.43,
  0.4,
  0.34,
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
  0.18,
  0.14,
]

export function useCurrentThemeData() {
  const fallback = computed(() => {
    return {
      name: 'default',
      colors: {
        primary: ['#0067cc', '#0067cc', '#0067cc', '#0067cc', '#0067cc', '#0067cc', '#0067cc', '#0067cc', '#0067cc', '#0067cc', '#0067cc'] as ColorsTuple,
        secondary: ['#5999A6', '#5999A6', '#5999A6', '#5999A6', '#5999A6', '#5999A6', '#5999A6', '#5999A6', '#5999A6', '#5999A6', '#5999A6'] as ColorsTuple,
        tertiary: ['#F76C22', '#F76C22', '#F76C22', '#F76C22', '#F76C22', '#F76C22', '#F76C22', '#F76C22', '#F76C22', '#F76C22', '#F76C22'] as ColorsTuple,
        error: ['#F95858', '#F95858', '#F95858', '#F95858', '#F95858', '#F95858', '#F95858', '#F95858', '#F95858', '#F95858', '#F95858'] as ColorsTuple,
        surface: ['#121212', '#121212', '#121212', '#121212', '#121212', '#121212', '#121212', '#121212', '#121212', '#121212', '#121212'] as ColorsTuple,
      },
    } as ThemeData
  })
  return inject<Ref<ThemeData>>('currentThemeData', fallback)
}

export function useCurrentThemeName() {
  return inject<Ref<string>>('currentThemeName', ref('default'))
}

export function useThemeData(
  name: string,
  color: {
    primary: MaybeRef<string>
    secondary: MaybeRef<string>
    tertiary: MaybeRef<string>
    error: MaybeRef<string>
    surface: MaybeRef<string>
  },
  lightnessMap: {
    primary?: number[]
    secondary?: number[]
    tertiary?: number[]
    error?: number[]
    surface?: number[]
  } = {},
  useOKLCH = true, // Option to use OKLCH color space for better color accuracy
) {
  const defaultColorLightness = COLOR_LIGHTNESS_MAP
  const defaultSurfaceLightness = SURFACE_LIGHTNESS_MAP
  if (lightnessMap.primary === undefined) {
    lightnessMap.primary = defaultColorLightness
  }
  if (lightnessMap.secondary === undefined) {
    lightnessMap.secondary = defaultColorLightness
  }
  if (lightnessMap.tertiary === undefined) {
    lightnessMap.tertiary = defaultColorLightness
  }
  if (lightnessMap.error === undefined) {
    lightnessMap.error = defaultColorLightness
  }
  if (lightnessMap.surface === undefined) {
    lightnessMap.surface = defaultSurfaceLightness
  }

  const colorGenerator = useOKLCH ? generateColorsOKLCH : generateColors

  return computed(() => {
    return {
      name,
      colors: {
        primary: colorGenerator(unref(color.primary), lightnessMap.primary),
        secondary: colorGenerator(unref(color.secondary), lightnessMap.secondary),
        tertiary: colorGenerator(unref(color.tertiary), lightnessMap.tertiary),
        error: colorGenerator(unref(color.error), lightnessMap.error),
        surface: colorGenerator(unref(color.surface), lightnessMap.surface),
      },
    }
  })
}

// New OKLCH-optimized theme data function
export function useThemeDataOKLCH(
  name: string,
  color: {
    primary: MaybeRef<string>
    secondary: MaybeRef<string>
    tertiary: MaybeRef<string>
    error: MaybeRef<string>
    surface: MaybeRef<string>
  },
  lightnessMap: {
    primary?: number[]
    secondary?: number[]
    tertiary?: number[]
    error?: number[]
    surface?: number[]
  } = {},
) {
  return useThemeData(name, color, lightnessMap, true)
}

// 添加 useColors 函数
function useColors(color: string, lightnessMap = COLOR_LIGHTNESS_MAP) {
  return computed(() => {
    return generateColorsObjMap(color, lightnessMap).colors
  })
}

function useColorTuple(color: MaybeRef<string | readonly [string, string, string, string, string, string, string, string, string, string, string, ...string[]]>, lightnessMap = COLOR_LIGHTNESS_MAP) {
  return computed(() => {
    const colorVal = unref(color)
    return typeof colorVal === 'string' ? useColors(colorVal, lightnessMap).value.map((d: any) => d.toHexString()) : colorVal
  })
}

export function useThemeStyles(theme: ThemeData) {
  const currentTheme = ref(theme)
  type KeyOfThemeColors = keyof typeof currentTheme.value.colors
  const colorVars: Record<string, string> = {}
  for (const key of Object.keys(currentTheme.value.colors)) {
    const color = key as KeyOfThemeColors
    const colorValue = currentTheme.value.colors[color]
    const colorTuple = useColorTuple(colorValue, color === 'surface' ? SURFACE_LIGHTNESS_MAP : COLOR_LIGHTNESS_MAP)
    const colorTupleValue = colorTuple.value as string[]
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
    '--un-default-border-color': 'var(--r-surface-border-color)',
  }

  return {
    ...colorStyles,
    ...themeStyles,
  }
}

// Enhanced theme styles with editor-friendly variables (simplified)
export function useEditorFriendlyThemeStyles(theme: ThemeData) {
  const currentTheme = ref(theme)
  type KeyOfThemeColors = keyof typeof currentTheme.value.colors
  const colorVars: Record<string, string> = {}

  for (const key of Object.keys(currentTheme.value.colors)) {
    const color = key as KeyOfThemeColors
    const colorValue = currentTheme.value.colors[color]
    const colorTuple = useColorTuple(colorValue, color === 'surface' ? SURFACE_LIGHTNESS_MAP : COLOR_LIGHTNESS_MAP)
    const colorTupleValue = colorTuple.value as string[]
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
    '--un-default-border-color': 'var(--r-surface-border-color)',
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

// Theme management composables
export function useThemeString(): RemovableRef<string> {
  const theme = useLocalStorage('theme', 'default')
  if (isClient) {
    const observer = new MutationObserver(() => {
      if (theme.value !== document.documentElement.dataset.theme) {
        theme.value = document.documentElement.dataset.theme
      }
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
  }
  return theme
}

export function useThemeManager() {
  const theme = useThemeString()
  const scheme = useSchemeString()

  const setTheme = (newTheme: string) => {
    theme.value = newTheme
    if (isClient) {
      document.documentElement.dataset.theme = newTheme
    }
  }

  const setScheme = (newScheme: string) => {
    scheme.value = newScheme
    if (isClient) {
      document.documentElement.dataset.scheme = newScheme
    }
  }

  const toggleScheme = () => {
    setScheme(scheme.value === 'light' ? 'dark' : 'light')
  }

  // Available themes
  const availableThemes = ['default', 'professional', 'vibrant', 'minimal']
  const availableSchemes = ['light', 'dark']

  return {
    theme: readonly(theme),
    scheme: readonly(scheme),
    setTheme,
    setScheme,
    toggleScheme,
    availableThemes,
    availableSchemes,
  }
}
