import type { Color as CuloriColor } from 'culori'
import type { MaybeRef } from 'vue'
import type { Color, InputVariant } from '@/types'
import { formatHex, rgb } from 'culori'
import { computed, unref } from 'vue'
import { generateAdaptiveLightnessMap, generateColorsObjMap, generateColorsObjMapOKLCH } from '@/utils'
import { COLOR_LIGHTNESS_MAP } from '..'
import { safeHex, safeHex8 } from './color-helpers'
import {
  darkBgIndex,
  darkBorderIndex,
  darkSurfaceBgVariant1Index,
  darkTextIndex,
  darkTextVariantIndex,
  lightBorderIndex,
  lightTextIndex,
  lightTextVariantIndex,
} from './constants'
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
  return useColorCS(color, 'text', { dark: darkTextIndex, light: lightTextIndex })
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
    index: { dark: darkBorderIndex, light: lightBorderIndex },
  })
}

export function useMergedCS(...cs: ReturnType<typeof useCS>[]) {
  return computed(() => {
    const style: Record<string, string> = {}
    const classList: string[] = []
    for (const c of cs) {
      Object.assign(style, c.value.style)
      const classToAdd = c.value.class
      if (Array.isArray(classToAdd)) {
        classList.push(...classToAdd)
      }
      else {
        classList.push(classToAdd)
      }
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
    index: { dark: darkBorderIndex, light: lightBorderIndex },
  }).value
})

export function useInputColorStyle(color: MaybeRef<string>, variant: MaybeRef<InputVariant> = 'default') {
  return computed(() => {
    const colors = useColors(color).value
    const surfaceColors = useSurfaceColors().value
    switch (unref(variant)) {
      case 'default': {
        return {
          '--d-bg': formatHex(surfaceColors[darkSurfaceBgVariant1Index]) || '#000000',
          '--d-border-f': formatHex(colors[darkBgIndex]) || '#000000',
          '--d-border': formatHex(surfaceColors[darkBorderIndex]) || '#000000',
          '--d-placeholder': formatHex(surfaceColors[darkTextVariantIndex]) || '#000000',
          '--d-text': 'white',

          '--l-bg': formatHex(surfaceColors[0]) || '#000000',
          '--l-border-f': formatHex(colors[3]) || '#000000',
          '--l-border': formatHex(surfaceColors[2]) || '#000000',
          '--l-placeholder': formatHex(surfaceColors[lightTextVariantIndex]) || '#000000',
          '--l-text': 'black',
        }
      }
      case 'filled': {
        return {
          '--d-bg': formatHex(colors[5]) || '#000000',
          '--d-bg-h': formatHex(colors[6]) || '#000000',
          '--d-border': 'transparent',
          '--l-bg': formatHex(colors[5]) || '#000000',
          '--l-bg-h': formatHex(colors[6]) || '#000000',
          '--l-border': 'transparent',

        }
      }
    }
  })
}
