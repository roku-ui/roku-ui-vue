import type { Color as CuloriColor } from 'culori'
import type { ComputedRef, MaybeRef } from 'vue'
import type { BtnVariant, Color, ContainerVariant, InputVariant, Rounded } from '@/types'
import { formatHex, formatHex8, rgb } from 'culori'
import { computed, inject, provide, unref } from 'vue'
import { generateColorsObjMap, generateColorsObjMapOKLCH, generateAdaptiveLightnessMap } from '@/utils'

import { COLOR_LIGHTNESS_MAP } from '..'

// const darkSurfaceBgBaseIndex = 10
const darkSurfaceBgIndex = 9
const darkSurfaceBgVariant1Index = 8
const darkSurfaceBgVariant2Index = 7
const darkBorderIndex = 7
const darkBorderVariantIndex = 7
const darkTextIndex = 3
const darkTextVariantIndex = 6

const darkBgIndex = 5
const darkBgVariantIndex = 6
const lightBorderIndex = 3
const lightBorderVariantIndex = 4
const darkOpacity = 0.25
const darkOpacityVariant = 0.3

// const lightSurfaceBgBaseIndex = 0
const lightSurfaceBgIndex = 1
const lightSurfaceBgVariantIndex = 2
const lightTextIndex = 6
const lightTextVariantIndex = 5

const lightBgIndex = 4
const lightBgVariantIndex = 5
const lightOpacity = 0.08
const lightOpacityVariant = 0.15

function getThemeColorString(colorKey: keyof ThemeColors): string {
  const theme = useTheme()
  return theme.colors[colorKey]
}

export const borderCS = computed(() => {
  return useCS({
    color: 'surface',
    type: 'border',
    index: { dark: darkBorderIndex, light: lightBorderIndex },
  }).value
})

export function useTextCS(color: MaybeRef<Color>) {
  return useColorCS(color, 'text', { dark: darkTextIndex, light: lightTextIndex })
}

export const primaryColors = computed(() => {
  return generateColorsObjMap(getThemeColorString('primary'), COLOR_LIGHTNESS_MAP).colors
})

export const secondaryColors = computed(() => {
  return generateColorsObjMap(getThemeColorString('secondary'), COLOR_LIGHTNESS_MAP).colors
})

export const tertiaryColors = computed(() => {
  return generateColorsObjMap(getThemeColorString('tertiary'), COLOR_LIGHTNESS_MAP).colors
})

export const errorColors = computed(() => {
  return generateColorsObjMap(getThemeColorString('error'), COLOR_LIGHTNESS_MAP).colors
})

export const surfaceColors = computed(() => {
  const surfaceColorString = getThemeColorString('surface')
  const adaptiveLightnessMap = generateAdaptiveLightnessMap(surfaceColorString, 'surface')
  return generateColorsObjMapOKLCH(surfaceColorString, adaptiveLightnessMap, {
    strategy: 'conservative', // Surface colors should be more muted
    gamut: 'srgb', // Ensure compatibility
  }).colors
})

export function useContainerCS(variant: MaybeRef<ContainerVariant>, color: MaybeRef<Color>) {
  return computed(() => {
    switch (unref(variant)) {
      case 'filled': {
        return useContainerFilledCS(color).value
      }
      case 'light': {
        return useContainerLightCS(color).value
      }
      default: {
        return useContainerDefaultCS().value
      }
    }
  })
}

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

type CSType = 'bg' | 'border' | 'text' | 'placeholder' | 'hover:bg' | 'hover:border' | 'hover:text' | 'outline'
type CSIndex = number | { dark: number, light: number }
interface CSOptions {
  color: MaybeRef<Color | 'surface'>
  type: CSType
  index: CSIndex
  alpha?: number
}
interface CS {
  style: Record<string, string>
  class: string[] | string
}

export function useContainerDefaultCS() {
  return computed(() => {
    const bgCS = useCS({
      color: 'surface',
      type: 'bg',
      index: { dark: darkSurfaceBgIndex, light: lightSurfaceBgIndex },
    })
    const borderCS = useCS({
      color: 'surface',
      type: 'border',
      index: { dark: darkBorderIndex, light: lightBorderIndex },
    })
    const cs = useMergedCS(bgCS, borderCS)
    cs.value.class = [...cs.value.class, 'border']
    return cs.value
  })
}

export function useContainerDefaultVariantCS() {
  return computed(() => {
    const bgCS = useCS({
      color: 'surface',
      type: 'bg',
      index: { dark: 7, light: 2 },
    })
    const borderCS = useCS({
      color: 'surface',
      type: 'border',
      index: { dark: 6, light: 4 },
    })
    return useMergedCS(bgCS, borderCS).value
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

export function useIndicatorFilledCS(color: MaybeRef<Color>) {
  return computed(() => {
    const bgCS = useCS({
      color,
      type: 'bg',
      index: { dark: 5, light: 4 },
    })
    const borderCS = useCS({
      color: 'surface',
      type: 'border',
      index: { dark: darkSurfaceBgIndex, light: lightSurfaceBgIndex },
    })
    const textCS = useCS({
      color,
      type: 'text',
      index: 0,
    })
    return useMergedCS(bgCS, borderCS, textCS).value
  })
}

export function useContainerFilledCS(color: MaybeRef<Color>) {
  return computed(() => {
    const bgCS = useCS({
      color,
      type: 'bg',
      index: { dark: darkBgIndex, light: lightBgIndex },
    })
    const borderCS = useCS({
      color,
      type: 'border',
      index: { dark: darkBgIndex, light: lightBgIndex },
    })
    const textCS = useCS({
      color,
      type: 'text',
      index: 0,
    })
    return useMergedCS(bgCS, borderCS, textCS).value
  })
}

export function useContainerLightCS(color: MaybeRef<Color>) {
  return computed(() => {
    const bgCS = useCS({
      color,
      type: 'bg',
      index: { dark: darkBgIndex, light: lightBgIndex },
      alpha: 0.15,
    })
    const textCS = useCS({
      color,
      type: 'text',
      index: { dark: darkTextIndex, light: lightTextIndex },
    })
    const borderCS = useCS({
      color,
      type: 'border',
      index: { dark: 5, light: 4 },
      alpha: 0,
    })
    return useMergedCS(bgCS, textCS, borderCS).value
  })
}

export function getCSInner(colors: CuloriColor[], type: CSType, darkIndex: number, lightIndex: number, alpha = 1): CS {
  switch (type) {
    case 'outline': {
      return {
        style: {
          [`--d-outline`]: formatHex8({ ...colors[darkIndex], alpha }) || '#00000000',
          [`--l-outline`]: formatHex8({ ...colors[lightIndex], alpha }) || '#00000000',
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
          [`--d-bg`]: formatHex8({ ...colors[darkIndex], alpha }) || '#00000000',
          [`--l-bg`]: formatHex8({ ...colors[lightIndex], alpha }) || '#00000000',
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
          [`--d-border`]: formatHex8({ ...colors[darkIndex], alpha }) || '#00000000',
          [`--l-border`]: formatHex8({ ...colors[lightIndex], alpha }) || '#00000000',
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
          [`--d-text`]: formatHex8({ ...colors[darkIndex], alpha }) || '#00000000',
          [`--l-text`]: formatHex8({ ...colors[lightIndex], alpha }) || '#00000000',
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
          [`--d-placeholder`]: formatHex8({ ...colors[darkIndex], alpha }) || '#00000000',
          [`--l-placeholder`]: formatHex8({ ...colors[lightIndex], alpha }) || '#00000000',
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
          [`--d-bg-h`]: formatHex({ ...colors[darkIndex], alpha }) || '#000000',
          [`--l-bg-h`]: formatHex({ ...colors[lightIndex], alpha }) || '#000000',
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
          [`--d-border-h`]: formatHex({ ...colors[darkIndex], alpha }) || '#000000',
          [`--l-border-h`]: formatHex({ ...colors[lightIndex], alpha }) || '#000000',
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
          [`--d-text-h`]: formatHex({ ...colors[darkIndex], alpha }) || '#000000',
          [`--l-text-h`]: formatHex({ ...colors[lightIndex], alpha }) || '#000000',
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

export function useButtonCS(variant: MaybeRef<BtnVariant> = 'default', color: MaybeRef<Color> = 'primary'): ComputedRef<CS> {
  return computed(() => {
    const colors = useColors(color).value
    const surfaceColorString = getThemeColorString('surface')
    const adaptiveLightnessMap = generateAdaptiveLightnessMap(surfaceColorString, 'surface')
    const surface = generateColorsObjMapOKLCH(surfaceColorString, adaptiveLightnessMap, {
      strategy: 'conservative',
      gamut: 'srgb',
    }).colors
    const variantStyles: Record<BtnVariant, () => Record<string, string>> = {
      default: () => getDefaultVariantStyle(surface),
      filled: () => getFilledVariantStyle(colors),
      light: () => getLightVariantStyle(colors),
      outline: () => getOutlineVariantStyle(colors),
      transparent: () => getTransparentVariantStyle(colors),
      subtle: () => getSubtleVariantStyle(colors),
      contrast: () => getContrastVariantStyle(colors),
      white: () => getWhiteVariantStyle(colors),
    }
    return {
      style: variantStyles[unref(variant)](),
      class: 'custom-colors',
    }
  })
}

function getDefaultVariantStyle(surface: CuloriColor[]): Record<string, string> {
  return {
    '--d-bg': formatHex(surface[darkSurfaceBgVariant1Index]) || '#000000',
    '--d-bg-h': formatHex(surface[darkSurfaceBgVariant2Index]) || '#000000',
    '--d-border': formatHex(surface[darkBorderVariantIndex]) || '#000000',
    '--l-bg': formatHex(surface[lightSurfaceBgIndex]) || '#000000',
    '--l-bg-h': formatHex(surface[lightSurfaceBgVariantIndex]) || '#000000',
    '--l-border': formatHex(surface[lightBorderVariantIndex]) || '#000000',
  }
}

function getFilledVariantStyle(color: CuloriColor[]): Record<string, string> {
  return {
    '--d-border': 'transparent',
    '--d-bg': formatHex(color[darkBgIndex]) || '#000000',
    '--d-bg-h': formatHex(color[darkBgVariantIndex]) || '#000000',
    '--d-text': 'white',
    '--l-bg': formatHex(color[lightBgIndex]) || '#000000',
    '--l-bg-h': formatHex(color[lightBgVariantIndex]) || '#000000',
    '--l-text': 'white',
    '--l-text-h': 'white',
    '--l-border': 'transparent',
  }
}

function getLightVariantStyle(color: CuloriColor[]): Record<string, string> {
  return {
    '--d-border': 'transparent',
    '--d-bg': formatHex8({ ...color[darkBgIndex], alpha: darkOpacity }) || '#00000000',
    '--d-bg-h': formatHex8({ ...color[darkBgIndex], alpha: darkOpacityVariant }) || '#00000000',
    '--d-text': formatHex(color[darkTextIndex]) || '#000000',
    '--d-text-h': formatHex(color[darkTextIndex]) || '#000000',
    '--l-bg': formatHex8({ ...color[lightBgIndex], alpha: lightOpacity }) || '#00000000',
    '--l-bg-h': formatHex8({ ...color[lightBgIndex], alpha: lightOpacityVariant }) || '#00000000',
    '--l-text': formatHex(color[lightTextIndex]) || '#000000',
    '--l-text-h': formatHex(color[lightTextIndex]) || '#000000',
    '--l-border': 'transparent',
  }
}

function getOutlineVariantStyle(color: CuloriColor[]): Record<string, string> {
  return {
    '--d-bg': 'transparent',
    '--d-bg-h': formatHex8({ ...color[darkBgVariantIndex], alpha: darkOpacity }) || '#00000000',
    '--d-text': formatHex(color[darkTextIndex]) || '#000000',
    '--d-text-h': formatHex(color[darkTextIndex]) || '#000000',
    '--d-border': formatHex(color[darkBorderIndex]) || '#000000',
    '--l-bg': 'transparent',
    '--l-bg-h': formatHex8({ ...color[lightBgVariantIndex], alpha: lightOpacity }) || '#00000000',
    '--l-text': formatHex(color[lightTextIndex]) || '#000000',
    '--l-text-h': formatHex(color[lightTextIndex]) || '#000000',
    '--l-border': formatHex(color[lightBorderIndex]) || '#000000',
  }
}

function getTransparentVariantStyle(color: CuloriColor[]): Record<string, string> {
  return {
    '--d-text': formatHex(color[3]) || '#000000',
    '--d-text-h': formatHex(color[3]) || '#000000',
    '--l-text': formatHex(color[5]) || '#000000',
    '--l-text-h': formatHex(color[5]) || '#000000',
    '--d-bg': 'transparent',
    '--l-bg': 'transparent',
    '--d-border': 'transparent',
    '--l-border': 'transparent',
  }
}

function getSubtleVariantStyle(color: CuloriColor[]): Record<string, string> {
  return {
    '--d-bg': 'transparent',
    '--d-bg-h': formatHex8({ ...color[3], alpha: darkOpacity }) || '#00000000',
    '--d-text': formatHex(color[2]) || '#000000',
    '--d-text-h': formatHex(color[2]) || '#000000',
    '--d-border': 'transparent',
    '--l-bg': 'transparent',
    '--l-bg-h': formatHex8({ ...color[3], alpha: lightOpacity }) || '#00000000',
    '--l-text': formatHex(color[5]) || '#000000',
    '--l-text-h': formatHex(color[5]) || '#000000',
    '--l-border': 'transparent',
  }
}

function getContrastVariantStyle(color: CuloriColor[]): Record<string, string> {
  return {
    '--d-text': formatHex(color[2]) || '#000000',
    '--d-text-h': 'white',
    '--d-bg': 'transparent',
    '--d-bg-h': formatHex(color[5]) || '#000000',
    '--d-border': 'transparent',
    '--l-text': formatHex(color[5]) || '#000000',
    '--l-text-h': 'white',
    '--l-bg': 'transparent',
    '--l-bg-h': formatHex(color[5]) || '#000000',
    '--l-border': 'transparent',
  }
}

function getWhiteVariantStyle(color: CuloriColor[]): Record<string, string> {
  return {
    '--d-bg': 'white',
    '--d-bg-h': 'white',
    '--d-text': formatHex(color[4]) || '#000000',
    '--d-text-h': formatHex(color[4]) || '#000000',
    '--d-border': 'transparent',
    '--l-bg': 'white',
    '--l-bg-h': 'white',
    '--l-text': formatHex(color[5]) || '#000000',
    '--l-text-h': formatHex(color[5]) || '#000000',
    '--l-border': 'transparent',
  }
}

export function useTagCS(variant: MaybeRef<BtnVariant> = 'default', color: MaybeRef<Color> = 'primary', hasInteraction: MaybeRef<boolean> = false): ComputedRef<CS> {
  return computed(() => {
    const colors = useColors(color).value
    const surfaceColorString = getThemeColorString('surface')
    const adaptiveLightnessMap = generateAdaptiveLightnessMap(surfaceColorString, 'surface')
    const surface = generateColorsObjMapOKLCH(surfaceColorString, adaptiveLightnessMap, {
      strategy: 'conservative',
      gamut: 'srgb',
    }).colors
    const interactive = unref(hasInteraction)

    const variantStyles: Record<BtnVariant, () => CS> = {
      default: () => getDefaultTagVariantStyle(surface, interactive),
      filled: () => getFilledTagVariantStyle(colors, interactive),
      light: () => getLightTagVariantStyle(colors, interactive),
      outline: () => getOutlineTagVariantStyle(colors, interactive),
      transparent: () => getTransparentTagVariantStyle(colors, interactive),
      subtle: () => getSubtleTagVariantStyle(colors, interactive),
      contrast: () => getContrastTagVariantStyle(colors, interactive),
      white: () => getWhiteTagVariantStyle(colors, interactive),
    }
    return variantStyles[unref(variant)]()
  })
}

function getDefaultTagVariantStyle(surface: CuloriColor[], hasInteraction: boolean): CS {
  const baseStyle = {
    '--d-bg': formatHex(surface[darkSurfaceBgVariant1Index]) || '#000000',
    '--d-border': formatHex(surface[darkBorderVariantIndex]) || '#000000',
    '--l-bg': formatHex(surface[lightSurfaceBgIndex]) || '#000000',
    '--l-border': formatHex(surface[lightBorderVariantIndex]) || '#000000',
  }

  const baseClass = [
    'dark:bg-[--d-bg]',
    'bg-[--l-bg]',
    'dark:border-[--d-border]',
    'border-[--l-border]',
  ]

  if (hasInteraction) {
    return {
      style: {
        ...baseStyle,
        '--d-bg-h': formatHex(surface[darkSurfaceBgVariant2Index]) || '#000000',
        '--l-bg-h': formatHex(surface[lightSurfaceBgVariantIndex]) || '#000000',
      },
      class: [
        ...baseClass,
        'dark:hover:bg-[--d-bg-h]',
        'hover:bg-[--l-bg-h]',
      ],
    }
  }

  return {
    style: baseStyle,
    class: baseClass,
  }
}

function getFilledTagVariantStyle(color: CuloriColor[], hasInteraction: boolean): CS {
  const baseStyle = {
    '--d-border': 'transparent',
    '--d-bg': formatHex(color[darkBgIndex]) || '#000000',
    '--d-text': 'white',
    '--l-bg': formatHex(color[lightBgIndex]) || '#000000',
    '--l-text': 'white',
    '--l-border': 'transparent',
  }

  const baseClass = [
    'dark:border-[--d-border]',
    'border-[--l-border]',
    'dark:bg-[--d-bg]',
    'bg-[--l-bg]',
    'dark:text-[--d-text]',
    'text-[--l-text]',
  ]

  if (hasInteraction) {
    return {
      style: {
        ...baseStyle,
        '--d-bg-h': formatHex(color[darkBgVariantIndex]) || '#000000',
        '--l-bg-h': formatHex(color[lightBgVariantIndex]) || '#000000',
        '--l-text-h': 'white',
      },
      class: [
        ...baseClass,
        'dark:hover:bg-[--d-bg-h]',
        'hover:bg-[--l-bg-h]',
        'dark:hover:text-[--d-text-h]',
        'hover:text-[--l-text-h]',
      ],
    }
  }

  return {
    style: baseStyle,
    class: baseClass,
  }
}

function getLightTagVariantStyle(color: CuloriColor[], hasInteraction: boolean): CS {
  const baseStyle = {
    '--d-border': 'transparent',
    '--d-bg': formatHex8({ ...color[darkBgIndex], alpha: darkOpacity }) || '#00000000',
    '--d-text': formatHex(color[darkTextIndex]) || '#000000',
    '--l-bg': formatHex8({ ...color[lightBgIndex], alpha: lightOpacity }) || '#00000000',
    '--l-text': formatHex(color[lightTextIndex]) || '#000000',
    '--l-border': 'transparent',
  }

  const baseClass = [
    'dark:border-[--d-border]',
    'border-[--l-border]',
    'dark:bg-[--d-bg]',
    'bg-[--l-bg]',
    'dark:text-[--d-text]',
    'text-[--l-text]',
  ]

  if (hasInteraction) {
    return {
      style: {
        ...baseStyle,
        '--d-bg-h': formatHex8({ ...color[darkBgIndex], alpha: darkOpacityVariant }) || '#00000000',
        '--d-text-h': formatHex(color[darkTextIndex]) || '#000000',
        '--l-bg-h': formatHex8({ ...color[lightBgIndex], alpha: lightOpacityVariant }) || '#00000000',
        '--l-text-h': formatHex(color[lightTextIndex]) || '#000000',
      },
      class: [
        ...baseClass,
        'dark:hover:bg-[--d-bg-h]',
        'hover:bg-[--l-bg-h]',
        'dark:hover:text-[--d-text-h]',
        'hover:text-[--l-text-h]',
      ],
    }
  }

  return {
    style: baseStyle,
    class: baseClass,
  }
}

function getOutlineTagVariantStyle(color: CuloriColor[], hasInteraction: boolean): CS {
  const baseStyle = {
    '--d-bg': 'transparent',
    '--d-text': formatHex(color[darkTextIndex]) || '#000000',
    '--d-border': formatHex(color[darkBorderIndex]) || '#000000',
    '--l-bg': 'transparent',
    '--l-text': formatHex(color[lightTextIndex]) || '#000000',
    '--l-border': formatHex(color[lightBorderIndex]) || '#000000',
  }

  const baseClass = [
    'dark:bg-[--d-bg]',
    'bg-[--l-bg]',
    'dark:text-[--d-text]',
    'text-[--l-text]',
    'dark:border-[--d-border]',
    'border-[--l-border]',
  ]

  if (hasInteraction) {
    return {
      style: {
        ...baseStyle,
        '--d-bg-h': formatHex8({ ...color[darkBgVariantIndex], alpha: darkOpacity }) || '#00000000',
        '--d-text-h': formatHex(color[darkTextIndex]) || '#000000',
        '--l-bg-h': formatHex8({ ...color[lightBgVariantIndex], alpha: lightOpacity }) || '#00000000',
        '--l-text-h': formatHex(color[lightTextIndex]) || '#000000',
      },
      class: [
        ...baseClass,
        'dark:hover:bg-[--d-bg-h]',
        'hover:bg-[--l-bg-h]',
        'dark:hover:text-[--d-text-h]',
        'hover:text-[--l-text-h]',
      ],
    }
  }

  return {
    style: baseStyle,
    class: baseClass,
  }
}

function getTransparentTagVariantStyle(color: CuloriColor[], hasInteraction: boolean): CS {
  const baseStyle = {
    '--d-text': formatHex(color[3]) || '#000000',
    '--l-text': formatHex(color[5]) || '#000000',
    '--d-bg': 'transparent',
    '--l-bg': 'transparent',
    '--d-border': 'transparent',
    '--l-border': 'transparent',
  }

  const baseClass = [
    'dark:text-[--d-text]',
    'text-[--l-text]',
    'dark:bg-[--d-bg]',
    'bg-[--l-bg]',
    'dark:border-[--d-border]',
    'border-[--l-border]',
  ]

  if (hasInteraction) {
    return {
      style: {
        ...baseStyle,
        '--d-text-h': formatHex(color[3]) || '#000000',
        '--l-text-h': formatHex(color[5]) || '#000000',
      },
      class: [
        ...baseClass,
        'dark:hover:text-[--d-text-h]',
        'hover:text-[--l-text-h]',
      ],
    }
  }

  return {
    style: baseStyle,
    class: baseClass,
  }
}

function getSubtleTagVariantStyle(color: CuloriColor[], hasInteraction: boolean): CS {
  const baseStyle = {
    '--d-bg': 'transparent',
    '--d-text': formatHex(color[2]) || '#000000',
    '--d-border': 'transparent',
    '--l-bg': 'transparent',
    '--l-text': formatHex(color[5]) || '#000000',
    '--l-border': 'transparent',
  }

  const baseClass = [
    'dark:bg-[--d-bg]',
    'bg-[--l-bg]',
    'dark:text-[--d-text]',
    'text-[--l-text]',
    'dark:border-[--d-border]',
    'border-[--l-border]',
  ]

  if (hasInteraction) {
    return {
      style: {
        ...baseStyle,
        '--d-bg-h': formatHex8({ ...color[3], alpha: darkOpacity }) || '#00000000',
        '--d-text-h': formatHex(color[2]) || '#000000',
        '--l-bg-h': formatHex8({ ...color[3], alpha: lightOpacity }) || '#00000000',
        '--l-text-h': formatHex(color[5]) || '#000000',
      },
      class: [
        ...baseClass,
        'dark:hover:bg-[--d-bg-h]',
        'hover:bg-[--l-bg-h]',
        'dark:hover:text-[--d-text-h]',
        'hover:text-[--l-text-h]',
      ],
    }
  }

  return {
    style: baseStyle,
    class: baseClass,
  }
}

function getContrastTagVariantStyle(color: CuloriColor[], hasInteraction: boolean): CS {
  const baseStyle = {
    '--d-text': formatHex(color[2]) || '#000000',
    '--d-bg': 'transparent',
    '--d-border': 'transparent',
    '--l-text': formatHex(color[5]) || '#000000',
    '--l-bg': 'transparent',
    '--l-border': 'transparent',
  }

  const baseClass = [
    'dark:text-[--d-text]',
    'text-[--l-text]',
    'dark:bg-[--d-bg]',
    'bg-[--l-bg]',
    'dark:border-[--d-border]',
    'border-[--l-border]',
  ]

  if (hasInteraction) {
    return {
      style: {
        ...baseStyle,
        '--d-text-h': 'white',
        '--d-bg-h': formatHex(color[5]) || '#000000',
        '--l-text-h': 'white',
        '--l-bg-h': formatHex(color[5]) || '#000000',
      },
      class: [
        ...baseClass,
        'dark:hover:text-[--d-text-h]',
        'hover:text-[--l-text-h]',
        'dark:hover:bg-[--d-bg-h]',
        'hover:bg-[--l-bg-h]',
      ],
    }
  }

  return {
    style: baseStyle,
    class: baseClass,
  }
}

function getWhiteTagVariantStyle(color: CuloriColor[], hasInteraction: boolean): CS {
  const baseStyle = {
    '--d-bg': 'white',
    '--d-text': formatHex(color[4]) || '#000000',
    '--d-border': 'transparent',
    '--l-bg': 'white',
    '--l-text': formatHex(color[5]) || '#000000',
    '--l-border': 'transparent',
  }

  const baseClass = [
    'dark:bg-[--d-bg]',
    'bg-[--l-bg]',
    'dark:text-[--d-text]',
    'text-[--l-text]',
    'dark:border-[--d-border]',
    'border-[--l-border]',
  ]

  if (hasInteraction) {
    return {
      style: {
        ...baseStyle,
        '--d-bg-h': 'white',
        '--d-text-h': formatHex(color[4]) || '#000000',
        '--l-bg-h': 'white',
        '--l-text-h': formatHex(color[5]) || '#000000',
      },
      class: [
        ...baseClass,
        'dark:hover:bg-[--d-bg-h]',
        'hover:bg-[--l-bg-h]',
        'dark:hover:text-[--d-text-h]',
        'hover:text-[--l-text-h]',
      ],
    }
  }

  return {
    style: baseStyle,
    class: baseClass,
  }
}

export function useInputColorStyle(color: MaybeRef<string>, variant: MaybeRef<InputVariant> = 'default') {
  return computed(() => {
    const colors = useColors(color).value
    const surfaceColors = useSurfaceColors().value
    switch (unref(variant)) {
      case 'default': {
        return {
          '--d-bg': formatHex(surfaceColors[darkSurfaceBgIndex]) || '#000000',
          '--d-border-f': formatHex(colors[darkBgIndex]) || '#000000',
          '--d-border': formatHex(surfaceColors[darkBorderIndex]) || '#000000',
          '--d-placeholder': formatHex(surfaceColors[darkTextVariantIndex]) || '#000000',
          '--d-text': 'white',

          '--l-bg': formatHex(surfaceColors[lightSurfaceBgIndex]) || '#000000',
          '--l-border-f': formatHex(colors[3]) || '#000000',
          '--l-border': formatHex(surfaceColors[lightBorderIndex]) || '#000000',
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

export interface ThemeColors {
  primary: string
  secondary: string
  tertiary: string
  error: string
  surface: string
}

export interface Theme {
  withBorder: boolean
  rounded: Rounded
  colors: ThemeColors
}
const symbolStyle = Symbol('defaultStyles')

export const defaultThemeData: Theme = {
  withBorder: true,
  rounded: 'md' as Rounded,
  colors: {
    primary: '#0067cc',
    secondary: '#5999A6',
    tertiary: '#F76C22',
    error: '#F95858',
    surface: '#121212',
  },
}
export function useTheme() {
  return inject<Theme>(symbolStyle, defaultThemeData)
}

export function provideTheme(theme: Partial<Theme>) {
  return provide<Theme>(symbolStyle, Object.assign({}, defaultThemeData, theme))
}

export function themeToThemeData(theme: Theme): import('../utils/theme').ThemeData {
  return {
    name: 'default',
    colors: {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      tertiary: theme.colors.tertiary,
      error: theme.colors.error,
      surface: theme.colors.surface,
    },
  }
}
