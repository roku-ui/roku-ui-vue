import type { RemovableRef } from '@vueuse/core'
import type { MaybeRef, Ref } from 'vue'
import type { ColorsTuple, ThemeData } from '..'
import { isClient, useLocalStorage } from '@vueuse/core'
import tinycolor from 'tinycolor2'
import { computed, inject, onMounted, ref, unref } from 'vue'
import { generateColors, generateColorsObjMap } from '..'

export * from './dom'

export const COLOR_LIGHTNESS_MAP = [
  0.98,
  0.8,
  0.7,
  0.6,
  0.43,
  0.4,
  0.36,
  0.3,
  0.2,
  0.1,
  0.01,
]
export const SURFACE_LIGHTNESS_MAP = [
  1,
  0.995,
  0.95,
  0.9,
  0.8,
  0.5,
  0.4,
  0.16,
  0.1,
  0.075,
  0.05,
]
export function useRootTheme() {
  if (!isClient) {
    return ref('dark')
  }
  const theme = ref(document.documentElement.dataset.scheme)
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-scheme') {
        theme.value = document.documentElement.dataset.scheme
      }
    }
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-scheme'],
  })
  return theme
}

export function useCurrentThemeScheme() {
  return inject<Ref<string> | null>('currentThemeScheme', null)
}

// 创建 defaultTheme，避免循环依赖
export const defaultTheme = useThemeData('default', {
  primary: '#0067cc',
  secondary: '#5999A6',
  tertiary: '#F76C22',
  error: '#F95858',
  surface: '#121212',
})

export function useCurrentThemeData() {
  // 使用计算属性延迟引用 defaultTheme 避免初始化顺序问题
  const fallback = computed(() => {
    // 如果 defaultTheme 还未初始化，返回一个空的 ThemeData
    try {
      return defaultTheme.value
    }
    catch {
      return {
        name: 'default',
        colors: {
          primary: ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000'] as ColorsTuple,
          secondary: ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000'] as ColorsTuple,
          tertiary: ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000'] as ColorsTuple,
          error: ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000'] as ColorsTuple,
          surface: ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000'] as ColorsTuple,
        },
      } as ThemeData
    }
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
  return computed(() => {
    return {
      name,
      colors: {
        primary: generateColors(unref(color.primary), lightnessMap.primary),
        secondary: generateColors(unref(color.secondary), lightnessMap.secondary),
        tertiary: generateColors(unref(color.tertiary), lightnessMap.tertiary),
        error: generateColors(unref(color.error), lightnessMap.error),
        surface: generateColors(unref(color.surface), lightnessMap.surface),
      },
    }
  })
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
      const c = tinycolor(cur).toRgb()
      colorVars[`--r-color-${color}-${idx}`] = `${c.r} ${c.g} ${c.b}`
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
