import type { Color as CuloriColor } from 'culori'
import type { MaybeRef } from 'vue'
import type { VariantStyleConfig } from './style-recipes'
import type { Color, InputVariant } from '@/types'
import { formatHex, rgb } from 'culori'
import { computed, unref } from 'vue'
import { generateAdaptiveLightnessMap, generateColorsObjMap, generateColorsObjMapOKLCH } from '@/utils'
import { resolveTailwindPalette } from '@/utils/tailwindPalettes'
import { COLOR_LIGHTNESS_MAP } from '..'
import { safeHex, safeHex8 } from './color-helpers'
import {
  COLOR_BG,
  COLOR_TEXT,
  COLOR_TINT_INDEX,
  SURFACE_BG,
  SURFACE_BORDER,
  SURFACE_TEXT,
} from './constants'
import { buildVariantStyles } from './style-recipes'
import { getThemeColorString } from './theme'

function useCuloriColor(color: MaybeRef<Color>) {
  return computed(() => {
    const colorValue = unref(color)
    switch (colorValue) {
      case 'surface': {
        return rgb(getThemeColorString('surface'))
      }
      case 'primary': {
        return rgb(getThemeColorString('primary'))
      }
      case 'secondary': {
        return rgb(getThemeColorString('secondary'))
      }
      case 'tertiary': {
        return rgb(getThemeColorString('tertiary'))
      }
      // Added missing predefined theme color mappings so they resolve to theme hex values
      case 'success': {
        return rgb(getThemeColorString('success'))
      }
      case 'info': {
        return rgb(getThemeColorString('info'))
      }
      case 'warning': {
        return rgb(getThemeColorString('warning'))
      }
      case 'error': {
        return rgb(getThemeColorString('error'))
      }
      default: {
        return rgb(colorValue)
      }
    }
  })
}

const colorStyleCache = new Map<string, CuloriColor[]>()

export function useColors(color: MaybeRef<Color>, lightnessMap = COLOR_LIGHTNESS_MAP) {
  return computed(() => {
    const rawColor = unref(color)
    if (typeof rawColor === 'string') {
      const tailwindMatch = resolveTailwindPalette(rawColor)
      if (tailwindMatch) {
        const cacheKey = `tailwind:${tailwindMatch.normalizedName}`
        if (colorStyleCache.has(cacheKey)) {
          return colorStyleCache.get(cacheKey)!
        }
        const parsed = tailwindMatch.palette
          .map(hex => rgb(hex))
          .filter(c => c !== undefined) as CuloriColor[]
        colorStyleCache.set(cacheKey, parsed)
        return parsed
      }
    }
    const colorObj = useCuloriColor(color).value
    const colorHex = formatHex(colorObj) || '#000000'
    if (colorStyleCache.has(colorHex)) {
      return colorStyleCache.get(colorHex)!
    }
    function generatePredefinedColorList() {
      const resp = generateColorsObjMap(colorHex, lightnessMap).colors
      colorStyleCache.set(colorHex, resp)
      return resp
    }
    return generatePredefinedColorList()
  })
}

export function useSurfaceColors() {
  return computed(() => {
    const surfaceColorString = getThemeColorString('surface')
    const adaptiveLightnessMap = generateAdaptiveLightnessMap(surfaceColorString, 'surface')
    return generateColorsObjMapOKLCH(surfaceColorString, adaptiveLightnessMap, {
      strategy: 'conservative',
      gamut: 'srgb',
    }).colors
  })
}

export function useTextCS(color: MaybeRef<Color>) {
  return useColorCS(color, 'text', { dark: COLOR_TEXT.solid.dark, light: COLOR_TEXT.solid.light })
}

export type CSType = 'bg' | 'border' | 'text' | 'placeholder' | 'hover:bg' | 'hover:border' | 'hover:text' | 'outline'
export type CSIndex = number | { dark: number, light: number }

export interface CSOptions {
  color: MaybeRef<Color | 'surface'>
  type: CSType
  index: CSIndex
  alpha?: number
}

export interface CS {
  style: Record<string, string>
  class: string[] | string
}

export function getCSInner(colors: CuloriColor[], type: CSType, darkIndex: number, lightIndex: number, alpha = 1): CS {
  const dColor = colors[darkIndex]
  const lColor = colors[lightIndex]
  switch (type) {
    case 'outline': {
      return {
        style: {
          [`--d-outline`]: safeHex8(dColor, alpha),
          [`--l-outline`]: safeHex8(lColor, alpha),
        },
        class: [
          `dark:focus-visible:outline-[--d-outline]`,
          `focus-visible:outline-[--l-outline]`,
        ],
      }
    }
    case 'bg': {
      return {
        style: {
          [`--d-bg`]: safeHex8(dColor, alpha),
          [`--l-bg`]: safeHex8(lColor, alpha),
        },
        class: [
          `dark:bg-[--d-bg]`,
          `bg-[--l-bg]`,
        ],
      }
    }
    case 'border': {
      return {
        style: {
          [`--d-border`]: safeHex8(dColor, alpha),
          [`--l-border`]: safeHex8(lColor, alpha),
        },
        class: [
          `dark:border-[--d-border]`,
          `border-[--l-border]`,
        ],
      }
    }
    case 'text': {
      return {
        style: {
          [`--d-text`]: safeHex8(dColor, alpha),
          [`--l-text`]: safeHex8(lColor, alpha),
        },
        class: [
          `dark:text-[--d-text]`,
          `text-[--l-text]`,
        ],
      }
    }
    case 'placeholder': {
      return {
        style: {
          [`--d-placeholder`]: safeHex8(dColor, alpha),
          [`--l-placeholder`]: safeHex8(lColor, alpha),
        },
        class: [
          'dark:placeholder-[--d-placeholder]',
          'placeholder-[--l-placeholder]',
        ],
      }
    }
    case 'hover:bg': {
      return {
        style: {
          [`--d-bg-h`]: safeHex(dColor),
          [`--l-bg-h`]: safeHex(lColor),
        },
        class: [
          `dark:hover:bg-[--d-bg-h]`,
          `hover:bg-[--l-bg-h]`,
        ],
      }
    }
    case 'hover:border': {
      return {
        style: {
          [`--d-border-h`]: safeHex(dColor),
          [`--l-border-h`]: safeHex(lColor),
        },
        class: [
          'dark:hover:border-[--d-border-h]',
          'hover:border-[--l-border-h]',
        ],
      }
    }
    case 'hover:text': {
      return {
        style: {
          [`--d-text-h`]: safeHex(dColor),
          [`--l-text-h`]: safeHex(lColor),
        },
        class: [
          'dark:hover:text-[--d-text-h]',
          'hover:text-[--l-text-h]',
        ],
      }
    }
  }
}

export function useCS(cs: CSOptions) {
  if (cs.color === 'surface') {
    return useSurfaceCS(cs.type, cs.index)
  }
  return useColorCS(cs.color, cs.type, cs.index, cs.alpha)
}

export function useColorCS(color: MaybeRef<Color>, type: CSType, index: CSIndex, alpha = 1) {
  return computed(() => {
    const colors = useColors(color)
    if (typeof index === 'number') {
      return getCSInner(unref(colors), type, index, index, alpha)
    }
    return getCSInner(unref(colors), type, index.dark, index.light, alpha)
  })
}

export function useSurfaceCS(type: CSType, index: CSIndex, alpha = 1) {
  return computed(() => {
    const surfaceColorString = getThemeColorString('surface')
    const adaptiveLightnessMap = generateAdaptiveLightnessMap(surfaceColorString, 'surface')
    const { colors } = generateColorsObjMapOKLCH(surfaceColorString, adaptiveLightnessMap, {
      strategy: 'conservative',
      gamut: 'srgb',
    })
    if (typeof index === 'number') {
      return getCSInner(colors, type, index, index, alpha)
    }
    return getCSInner(colors, type, index.dark, index.light, alpha)
  })
}

export function useOutlineCS(color: MaybeRef<Color>) {
  return useCS({
    color,
    type: 'outline',
    index: { dark: SURFACE_BORDER.base.dark, light: SURFACE_BORDER.base.light },
  })
}

export function useMergedCS(csList: ReturnType<typeof useCS>[], extraClass: string[] = []) {
  return computed(() => {
    const style: Record<string, string> = {}
    const classList: string[] = []
    for (const c of csList) {
      Object.assign(style, c.value.style)
      const classToAdd = c.value.class
      if (Array.isArray(classToAdd)) {
        classList.push(...classToAdd)
      }
      else {
        classList.push(classToAdd)
      }
    }
    if (extraClass.length > 0) {
      classList.push(...extraClass)
    }
    return {
      style,
      class: classList,
    }
  })
}

export const borderCS = computed(() => {
  return useCS({
    color: 'surface',
    type: 'border',
    index: { dark: SURFACE_BORDER.base.dark, light: SURFACE_BORDER.base.light },
  }).value
})

const inputVariantConfigs: Record<InputVariant, VariantStyleConfig> = {
  default: {
    '--d-bg': { palette: 'surface', index: SURFACE_BG.container.dark },
    '--d-border-f': { index: COLOR_BG.solid.dark },
    '--d-border': { palette: 'surface', index: SURFACE_BORDER.base.dark },
    '--d-placeholder': { palette: 'surface', index: SURFACE_TEXT.muted.dark },
    '--d-text': { source: 'literal', value: 'white' },
    '--l-bg': { palette: 'surface', index: SURFACE_BG.base.light },
    '--l-border-f': { index: COLOR_TINT_INDEX },
    '--l-border': { palette: 'surface', index: SURFACE_BORDER.base.light },
    '--l-placeholder': { palette: 'surface', index: SURFACE_TEXT.muted.light },
    '--l-text': { source: 'literal', value: 'black' },
  },
  filled: {
    '--d-bg': { index: COLOR_BG.solid.dark },
    '--d-bg-h': { index: COLOR_BG.hover.dark },
    '--d-border': { source: 'literal', value: 'transparent' },
    '--l-bg': { index: COLOR_BG.solid.light },
    '--l-bg-h': { index: COLOR_BG.hover.light },
    '--l-border': { source: 'literal', value: 'transparent' },
  },
}

export function useInputColorStyle(color: MaybeRef<string>, variant: MaybeRef<InputVariant> = 'default') {
  const colors = useColors(color)
  const surfaceColors = useSurfaceColors()
  return computed(() => {
    const variantKey = unref(variant)
    const config = inputVariantConfigs[variantKey] ?? inputVariantConfigs.default
    return buildVariantStyles(config, {
      color: colors.value,
      surface: surfaceColors.value,
    })
  })
}
