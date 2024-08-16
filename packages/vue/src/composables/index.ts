import tinycolor from 'tinycolor2'
import type { RemovableRef } from '@vueuse/core'
import { isClient } from '@vueuse/core'
import type { MaybeRef } from 'vue'
import { type ThemeData, defaultTheme, generateColors } from '..'

export const COLOR_LIGHTNESS_MAP = [0.98, 0.96, 0.9, 0.7, 0.5, 0.4, 0.35, 0.3, 0.28, 0.2, 0.08]
export function useRootTheme() {
  if (!isClient) {
    return ref('dark')
  }
  const theme = ref(document.documentElement.dataset.scheme)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-scheme') {
        theme.value = document.documentElement.dataset.scheme
      }
    })
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

export function useCurrentThemeData() {
  return inject<Ref<ThemeData>>('currentThemeData', ref(defaultTheme))
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
  const defaultSurfaceLightness = [1, 0.99, 0.98, 0.9, 0.8, 0.5, 0.2, 0.12, 0.1, 0.08, 0.06]
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

export function useThemeStyles(theme: ThemeData) {
  const currentTheme = ref(theme)
  type KeyOfThemeColors = keyof typeof currentTheme.value.colors
  const colorVars = Object.keys(currentTheme.value.colors).map((key) => {
    const color = key as KeyOfThemeColors
    const colorValue = currentTheme.value.colors[color]
    return colorValue.reduce((acc, cur, idx) => {
      const c = tinycolor(cur).toRgb()
      acc[`--r-color-${color}-${idx}`] = `${c.r} ${c.g} ${c.b}`
      return acc
    }, {} as Record<string, string>)
  }).reduce((acc, cur) => {
    return {
      ...acc,
      ...cur,
    }
  }, {} as Record<string, string>)

  const colorStyles = {
    ...colorVars,
  }
  const themeStyles = {
    'background-color': 'rgb(var(--r-color-surface-lowest))',
    'color': 'rgb(var(--r-color-surface-on))',
  }

  return {
    ...colorStyles,
    ...themeStyles,
  }
}

export function useId(props: { id?: string }) {
  const id = ref('')
  onMounted(() => {
    if (props.id) {
      id.value = props.id
    }
    else {
      id.value = `switch-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`
    }
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
