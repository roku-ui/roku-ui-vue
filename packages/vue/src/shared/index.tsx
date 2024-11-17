import type { BtnVariant, Color, ContainerVariant, InputVariant } from '@/types'
import type { ComputedRef, MaybeRef } from 'vue'
import { generateColorsObjMap } from '@/utils'
import tinycolor from 'tinycolor2'
import { computed, ref, unref } from 'vue'

import { COLOR_LIGHTNESS_MAP, SURFACE_LIGHTNESS_MAP } from '..'

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

export const primaryColor = ref('#0067cc')
export const secondaryColor = ref('#5999A6')
export const tertiaryColor = ref('#F76C22')
export const errorColor = ref('#F95858')
export const surfaceColor = ref('#121212')

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
  return generateColorsObjMap(unref(primaryColor), COLOR_LIGHTNESS_MAP).colors
})

export const secondaryColors = computed(() => {
  return generateColorsObjMap(unref(secondaryColor), COLOR_LIGHTNESS_MAP).colors
})

export const tertiaryColors = computed(() => {
  return generateColorsObjMap(unref(tertiaryColor), COLOR_LIGHTNESS_MAP).colors
})

export const errorColors = computed(() => {
  return generateColorsObjMap(unref(errorColor), COLOR_LIGHTNESS_MAP).colors
})

export const surfaceColors = computed(() => {
  return generateColorsObjMap(unref(surfaceColor), SURFACE_LIGHTNESS_MAP).colors
})

export const defaultTheme = useThemeData('default', {
  primary: primaryColor,
  secondary: secondaryColor,
  tertiary: tertiaryColor,
  error: errorColor,
  surface: surfaceColor,
})

export function useContainerCS(variant: MaybeRef<ContainerVariant>, color: MaybeRef<Color>) {
  return computed(() => {
    switch (unref(variant)) {
      case 'filled':
        return useContainerFilledCS(color).value
      case 'light':
        return useContainerLightCS(color).value
      default:
        return useContainerDefaultCS().value
    }
  })
}

function useTinycolor(color: MaybeRef<Color>) {
  return computed(() => {
    const colorValue = unref(color)
    switch (colorValue) {
      case 'surface':
        return tinycolor(unref(surfaceColor))
      case 'primary':
        return tinycolor(unref(primaryColor))
      case 'secondary':
        return tinycolor(unref(secondaryColor))
      case 'tertiary':
        return tinycolor(unref(tertiaryColor))
      case 'error':
        return tinycolor(unref(errorColor))
      default:
        return tinycolor(colorValue)
    }
  })
}

const colorStyleCache = new Map<string, tinycolor.Instance[]>()
export function useColors(color: MaybeRef<Color>, lightnessMap = COLOR_LIGHTNESS_MAP) {
  return computed(() => {
    const colorObj = useTinycolor(color).value
    const colorHex = colorObj.toHexString()
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
  return computed(() => generateColorsObjMap(unref(surfaceColor), SURFACE_LIGHTNESS_MAP).colors)
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
  return computed(() => ({
    style: cs.reduce((prev, curr) => ({ ...prev, ...curr.value.style }), {}),
    class: cs.reduce<string[]>((prev, curr) => [...prev, ...curr.value.class], []),
  }))
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

export function getCSInner(colors: tinycolor.Instance[], type: CSType, darkIndex: number, lightIndex: number, alpha = 1.0): CS {
  switch (type) {
    case 'outline':
      return {
        style: {
          [`--d-outline`]: colors[darkIndex].clone().setAlpha(alpha).toHex8String(),
          [`--l-outline`]: colors[lightIndex].clone().setAlpha(alpha).toHex8String(),
        },
        class: [
          `dark:focus-visible:outline-[--d-outline]`,
          `focus-visible:outline-[--l-outline]`,
        ],
      }
    case 'bg':
      return {
        style: {
          [`--d-bg`]: colors[darkIndex].clone().setAlpha(alpha).toHex8String(),
          [`--l-bg`]: colors[lightIndex].clone().setAlpha(alpha).toHex8String(),
        },
        class: [
          `dark:bg-[--d-bg]`,
          `bg-[--l-bg]`,
        ],
      }
    case 'border':
      return {
        style: {
          [`--d-border`]: colors[darkIndex].clone().setAlpha(alpha).toHex8String(),
          [`--l-border`]: colors[lightIndex].clone().setAlpha(alpha).toHex8String(),
        },
        class: [
          `dark:border-[--d-border]`,
          `border-[--l-border]`,
        ],
      }
    case 'text':
      return {
        style: {
          [`--d-text`]: colors[darkIndex].clone().setAlpha(alpha).toHex8String(),
          [`--l-text`]: colors[lightIndex].clone().setAlpha(alpha).toHex8String(),
        },
        class: [
          `dark:text-[--d-text]`,
          `text-[--l-text]`,
        ],
      }
    case 'placeholder':
      return {
        style: {
          [`--d-placeholder`]: colors[darkIndex].clone().setAlpha(alpha).toHex8String(),
          [`--l-placeholder`]: colors[lightIndex].clone().setAlpha(alpha).toHex8String(),
        },
        class: [
          'dark:placeholder-[--d-placeholder]',
          'placeholder-[--l-placeholder]',
        ],
      }
    case 'hover:bg':
      return {
        style: {
          [`--d-bg-h`]: colors[darkIndex].clone().setAlpha(alpha).toHexString(),
          [`--l-bg-h`]: colors[lightIndex].clone().setAlpha(alpha).toHexString(),
        },
        class: [
          `dark:hover:bg-[--d-bg-h]`,
          `hover:bg-[--l-bg-h]`,
        ],
      }
    case 'hover:border':
      return {
        style: {
          [`--d-border-h`]: colors[darkIndex].clone().setAlpha(alpha).toHexString(),
          [`--l-border-h`]: colors[lightIndex].clone().setAlpha(alpha).toHexString(),
        },
        class: [
          'dark:hover:border-[--d-border-h]',
          'hover:border-[--l-border-h]',
        ],
      }
    case 'hover:text':
      return {
        style: {
          [`--d-text-h`]: colors[darkIndex].clone().setAlpha(alpha).toHexString(),
          [`--l-text-h`]: colors[lightIndex].clone().setAlpha(alpha).toHexString(),
        },
        class: [
          'dark:hover:text-[--d-text-h]',
          'hover:text-[--l-text-h]',
        ],
      }
  }
}

export function useCS(cs: CSOptions) {
  if (cs.color === 'surface') {
    return useSurfaceCS(cs.type, cs.index)
  }
  return useColorCS(cs.color, cs.type, cs.index, cs.alpha)
}

export function useColorCS(color: MaybeRef<Color>, type: CSType, index: CSIndex, alpha = 1.0) {
  return computed(() => {
    const colors = useColors(color)
    if (typeof index === 'number') {
      return getCSInner(unref(colors), type, index, index, alpha)
    }
    return getCSInner(unref(colors), type, index.dark, index.light, alpha)
  })
}

export function useSurfaceCS(type: CSType, index: CSIndex, alpha = 1.0) {
  return computed(() => {
    const { colors } = generateColorsObjMap(unref(surfaceColor), SURFACE_LIGHTNESS_MAP)
    if (typeof index === 'number') {
      return getCSInner(colors, type, index, index, alpha)
    }
    return getCSInner(colors, type, index.dark, index.light, alpha)
  })
}

export function useButtonCS(variant: MaybeRef<BtnVariant> = 'default', color: MaybeRef<Color> = 'primary'): ComputedRef<CS> {
  return computed(() => {
    const colors = useColors(color).value
    const surface = generateColorsObjMap(unref(surfaceColor), SURFACE_LIGHTNESS_MAP).colors
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

function getDefaultVariantStyle(surface: tinycolor.Instance[]): Record<string, string> {
  return {
    '--d-bg': surface[darkSurfaceBgVariant1Index].toHexString(),
    '--d-bg-h': surface[darkSurfaceBgVariant2Index].toHexString(),
    '--d-border': surface[darkBorderVariantIndex].toHexString(),
    '--l-bg': surface[lightSurfaceBgIndex].toHexString(),
    '--l-bg-h': surface[lightSurfaceBgVariantIndex].toHexString(),
    '--l-border': surface[lightBorderVariantIndex].toHexString(),
  }
}

function getFilledVariantStyle(color: tinycolor.Instance[]): Record<string, string> {
  return {
    '--d-border': 'transparent',
    '--d-bg': color[darkBgIndex].toHexString(),
    '--d-bg-h': color[darkBgVariantIndex].toHexString(),
    '--d-text': 'white',
    '--l-bg': color[lightBgIndex].toHexString(),
    '--l-bg-h': color[lightBgVariantIndex].toHexString(),
    '--l-text': 'white',
    '--l-text-h': 'white',
    '--l-border': 'transparent',
  }
}

function getLightVariantStyle(color: tinycolor.Instance[]): Record<string, string> {
  return {
    '--d-border': 'transparent',
    '--d-bg': color[darkBgIndex].clone().setAlpha(darkOpacity).toHex8String(),
    '--d-bg-h': color[darkBgIndex].clone().setAlpha(darkOpacityVariant).toHex8String(),
    '--d-text': color[darkTextIndex].toHexString(),
    '--d-text-h': color[darkTextIndex].toHexString(),
    '--l-bg': color[lightBgIndex].clone().setAlpha(lightOpacity).toHex8String(),
    '--l-bg-h': color[lightBgIndex].clone().setAlpha(lightOpacityVariant).toHex8String(),
    '--l-text': color[lightTextIndex].toHexString(),
    '--l-text-h': color[lightTextIndex].toHexString(),
    '--l-border': 'transparent',
  }
}

function getOutlineVariantStyle(color: tinycolor.Instance[]): Record<string, string> {
  return {
    '--d-bg': 'transparent',
    '--d-bg-h': color[darkBgVariantIndex].clone().setAlpha(darkOpacity).toHex8String(),
    '--d-text': color[darkTextIndex].toHexString(),
    '--d-text-h': color[darkTextIndex].toHexString(),
    '--d-border': color[darkBorderIndex].toHexString(),
    '--l-bg': 'transparent',
    '--l-bg-h': color[lightBgVariantIndex].clone().setAlpha(lightOpacity).toHex8String(),
    '--l-text': color[lightTextIndex].toHexString(),
    '--l-text-h': color[lightTextIndex].toHexString(),
    '--l-border': color[lightBorderIndex].toHexString(),
  }
}

function getTransparentVariantStyle(color: tinycolor.Instance[]): Record<string, string> {
  return {
    '--d-text': color[3].toHexString(),
    '--d-text-h': color[3].toHexString(),
    '--l-text': color[5].toHexString(),
    '--l-text-h': color[5].toHexString(),
    '--d-bg': 'transparent',
    '--l-bg': 'transparent',
    '--d-border': 'transparent',
    '--l-border': 'transparent',
  }
}

function getSubtleVariantStyle(color: tinycolor.Instance[]): Record<string, string> {
  return {
    '--d-bg': 'transparent',
    '--d-bg-h': color[3].clone().setAlpha(darkOpacity).toHex8String(),
    '--d-text': color[2].toHexString(),
    '--d-text-h': color[2].toHexString(),
    '--d-border': 'transparent',
    '--l-bg': 'transparent',
    '--l-bg-h': color[3].clone().setAlpha(lightOpacity).toHex8String(),
    '--l-text': color[5].toHexString(),
    '--l-text-h': color[5].toHexString(),
    '--l-border': 'transparent',
  }
}

function getContrastVariantStyle(color: tinycolor.Instance[]): Record<string, string> {
  return {
    '--d-text': color[2].toHexString(),
    '--d-text-h': 'white',
    '--d-bg': 'transparent',
    '--d-bg-h': color[5].toHexString(),
    '--d-border': 'transparent',
    '--l-text': color[5].toHexString(),
    '--l-text-h': 'white',
    '--l-bg': 'transparent',
    '--l-bg-h': color[5].toHexString(),
    '--l-border': 'transparent',
  }
}

function getWhiteVariantStyle(color: tinycolor.Instance[]): Record<string, string> {
  return {
    '--d-bg': 'white',
    '--d-bg-h': 'white',
    '--d-text': color[4].toHexString(),
    '--d-text-h': color[4].toHexString(),
    '--d-border': 'transparent',
    '--l-bg': 'white',
    '--l-bg-h': 'white',
    '--l-text': color[5].toHexString(),
    '--l-text-h': color[5].toHexString(),
    '--l-border': 'transparent',
  }
}

export function useInputColorStyle(color: MaybeRef<string>, variant: MaybeRef<InputVariant> = 'default') {
  return computed(() => {
    const colors = useColors(color).value
    const surfaceColors = useSurfaceColors().value
    switch (unref(variant)) {
      case 'default':
        return {
          '--d-bg': surfaceColors[darkSurfaceBgIndex].toHexString(),
          '--d-border-f': colors[darkBgIndex].toHexString(),
          '--d-border': surfaceColors[darkBorderIndex].toHexString(),
          '--d-placeholder': surfaceColors[darkTextVariantIndex].toHexString(),
          '--d-text': 'white',

          '--l-bg': surfaceColors[lightSurfaceBgIndex].toHexString(),
          '--l-border-f': colors[3].toHexString(),
          '--l-border': surfaceColors[lightBorderIndex].toHexString(),
          '--l-placeholder': surfaceColors[lightTextVariantIndex].toHexString(),
          '--l-text': 'black',
        }
      case 'filled':
        return {
          '--d-bg': colors[5].toHexString(),
          '--d-bg-h': colors[6].toHexString(),
          '--d-border': 'transparent',
          '--l-bg': colors[5].toHexString(),
          '--l-bg-h': colors[6].toHexString(),
          '--l-border': 'transparent',

        }
    }
  })
}
