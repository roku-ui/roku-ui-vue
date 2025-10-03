import type { RemovableRef } from '@vueuse/core'
import type { MaybeRef } from 'vue'
import type { ThemeColorValue } from '@/shared'
import { isClient, useLocalStorage } from '@vueuse/core'
import { rgb } from 'culori'
import { computed, onMounted, ref, unref } from 'vue'
import { generateColors } from '..'

export { generateEditorFriendlyColors, generateOKLCHString } from '../utils'
export * from './dom'

// Tailwind-inspired lightness ramp matching stops 50 through 950
export const COLOR_LIGHTNESS_MAP = [
  0.985,
  0.94,
  0.87,
  0.78,
  0.68,
  0.58,
  0.49,
  0.39,
  0.29,
  0.21,
  0.14,
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

/**
 * Build CSS variable style object for a theme.
 * When editorFriendly=true, embeds original color string as a comment for easier inspection in DevTools / inline styles.
 * Usage: useThemeStyles(theme) or useThemeStyles(theme, { editorFriendly: true })
 */
export function useThemeStyles(
  theme: import('@/shared').ThemeData,
  options?: { editorFriendly?: boolean },
) {
  const { editorFriendly = false } = options ?? {}
  const currentTheme = ref(theme)
  type KeyOfThemeColors = keyof typeof currentTheme.value.colors
  const colorVars: Record<string, string> = {}

  for (const key of Object.keys(currentTheme.value.colors)) {
    const color = key as KeyOfThemeColors
    const colorValue = currentTheme.value.colors[color]
    if (!colorValue) {
      continue
    }

    const colorTuple = useColorTuple(colorValue, COLOR_LIGHTNESS_MAP)
    const colorTupleValue = [...colorTuple.value]
    for (const [idx, cur] of colorTupleValue.entries()) {
      const c = rgb(cur)
      const base = c
        ? `${Math.round(c.r * 255)} ${Math.round(c.g * 255)} ${Math.round(
            c.b * 255,
          )}`
        : '0 0 0'
      colorVars[`--r-color-${color}-${idx}`] = editorFriendly ? `${base} /* ${cur} */` : base
    }
  }

  const themeStyles = {
    'backgroundColor': 'var(--r-surface-background-base-color)',
    'color': 'var(--r-surface-text-color)',
    '--un-default-border-color': 'var(--r-border-base)',
  }

  return {
    ...colorVars,
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
