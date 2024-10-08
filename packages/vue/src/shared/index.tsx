import type { BtnVariant, InputVariant } from '../types'
import { generateColorsObjMap } from '@/utils'
import tinycolor from 'tinycolor2'
import { computed, type MaybeRef, ref, unref } from 'vue'
import { COLOR_LIGHTNESS_MAP, SURFACE_LIGHTNESS_MAP } from '..'

export const primaryColor = ref('#3F9CDC')
export const secondaryColor = ref('#5999A6')
export const tertiaryColor = ref('#F76C22')
export const errorColor = ref('#F95858')
export const surfaceColor = ref('#121212')

export const defaultTheme = useThemeData('default', {
  primary: primaryColor,
  secondary: secondaryColor,
  tertiary: tertiaryColor,
  error: errorColor,
  surface: surfaceColor,
})

const colorStyleCache = new Map<string, tinycolor.Instance[]>()
export function useColorsObjs(color: MaybeRef<string>) {
  return computed(() => {
    const colorStr = unref(color)
    if (colorStyleCache.has(colorStr)) {
      return colorStyleCache.get(colorStr)!
    }
    function generateColorObj() {
      switch (colorStr) {
        case 'default':
          return generateColorsObjMap(unref(surfaceColor), COLOR_LIGHTNESS_MAP).colors
        case 'primary':
          return generateColorsObjMap(unref(primaryColor), COLOR_LIGHTNESS_MAP).colors
        case 'secondary':
          return generateColorsObjMap(unref(secondaryColor), COLOR_LIGHTNESS_MAP).colors
        case 'tertiary':
          return generateColorsObjMap(unref(tertiaryColor), COLOR_LIGHTNESS_MAP).colors
        case 'error':
          return generateColorsObjMap(unref(errorColor), COLOR_LIGHTNESS_MAP).colors
      }
      const colorObj = tinycolor(colorStr)
      return generateColorsObjMap(colorObj.toHexString(), COLOR_LIGHTNESS_MAP).colors
    }
    const resp = generateColorObj()
    colorStyleCache.set(colorStr, resp)
    return resp
  })
}

export function useSurfaceColors() {
  return computed(() => generateColorsObjMap(unref(surfaceColor), SURFACE_LIGHTNESS_MAP).colors)
}

// type ColorKey = ''

// export function useColorClassAndStyle(color: MaybeRef<string>, keys: ColorKey[]) {
//   return computed(() => {
//     const className = []
//     const style = []
//     for (const key of keys) {
//     }
//     return { class: className, style }
//   })
// }

const darkDefaultFillIndex = 8
const darkDefaultFillVariantIndex = 7

const darkDefaultBorderIndex = 7

const darkFillIndex = 5
const darkFillVariantIndex = 6

const darkTextIndex = 2

const darkBorderIndex = 3

const darkOpacity = 0.25
const darkOpacityVariant = 0.3

const lightDefaultFillIndex = 1
const lightDefaultFillVariantIndex = 2

const lightDefaultBorderIndex = 4

const lightFillIndex = 5
const lightFillVariantIndex = 6

const lightTextIndex = 6
const lightTextVariantIndex = 7

const lightBorderIndex = 4

const lightOpacity = 0.08
const lightOpacityVariant = 0.15

export function useColorStyleByColorsAndBtnVariant(colorInstances: MaybeRef<tinycolor.Instance[]>, variant: MaybeRef<BtnVariant>) {
  return computed(() => {
    const color = unref(colorInstances)
    const surface = generateColorsObjMap(unref(surfaceColor), SURFACE_LIGHTNESS_MAP).colors

    const variantStyles: Record<BtnVariant, () => Record<string, string>> = {
      default: () => getDefaultVariantStyle(surface),
      filled: () => getFilledVariantStyle(color),
      light: () => getLightVariantStyle(color),
      outline: () => getOutlineVariantStyle(color),
      transparent: () => getTransparentVariantStyle(color),
      subtle: () => getSubtleVariantStyle(color),
      contrast: () => getContrastVariantStyle(color),
      white: () => getWhiteVariantStyle(color),
    }
    return variantStyles[unref(variant)]?.() ?? {}
  })
}

function getDefaultVariantStyle(surface: tinycolor.Instance[]): Record<string, string> {
  return {
    '--d-fill': surface[darkDefaultFillIndex].toHexString(),
    '--d-fill-h': surface[darkDefaultFillVariantIndex].toHexString(),
    '--d-border': surface[darkDefaultBorderIndex].toHexString(),
    '--l-fill': surface[lightDefaultFillIndex].toHexString(),
    '--l-fill-h': surface[lightDefaultFillVariantIndex].toHexString(),
    '--l-border': surface[lightDefaultBorderIndex].toHexString(),
  }
}

function getFilledVariantStyle(color: tinycolor.Instance[]): Record<string, string> {
  return {
    '--d-border': 'transparent',
    '--d-fill': color[darkFillIndex].toHexString(),
    '--d-fill-h': color[darkFillVariantIndex].toHexString(),
    '--d-text': 'white',
    '--l-fill': color[lightFillIndex].toHexString(),
    '--l-fill-h': color[lightFillVariantIndex].toHexString(),
    '--l-text': 'white',
    '--l-text-h': 'white',
    '--l-border': 'transparent',
  }
}

function getLightVariantStyle(color: tinycolor.Instance[]): Record<string, string> {
  return {
    '--d-border': 'transparent',
    '--d-fill': color[darkFillIndex].setAlpha(darkOpacity).toHex8String(),
    '--d-fill-h': color[darkFillIndex].setAlpha(darkOpacityVariant).toHex8String(),
    '--d-text': color[darkTextIndex].toHexString(),
    '--d-text-h': color[darkTextIndex].toHexString(),
    '--l-fill': color[lightFillIndex].setAlpha(lightOpacity).toHex8String(),
    '--l-fill-h': color[lightFillIndex].setAlpha(lightOpacityVariant).toHex8String(),
    '--l-text': color[lightTextIndex].toHexString(),
    '--l-text-h': color[lightTextIndex].toHexString(),
    '--l-border': 'transparent',
  }
}

function getOutlineVariantStyle(color: tinycolor.Instance[]): Record<string, string> {
  return {
    '--d-fill': 'transparent',
    '--d-fill-h': color[darkFillVariantIndex].setAlpha(darkOpacity).toHex8String(),
    '--d-text': color[darkTextIndex].toHexString(),
    '--d-text-h': color[darkTextIndex].toHexString(),
    '--d-border': color[darkBorderIndex].toHexString(),
    '--l-fill': 'transparent',
    '--l-fill-h': color[lightFillVariantIndex].setAlpha(lightOpacity).toHex8String(),
    '--l-text': color[lightTextIndex].toHexString(),
    '--l-text-h': color[lightTextIndex].toHexString(),
    '--l-border': color[lightBorderIndex].toHexString(),
  }
}

function getTransparentVariantStyle(color: tinycolor.Instance[]): Record<string, string> {
  return {
    '--d-text': color[3].toHexString(),
    '--d-text-h': color[3].toHexString(),
    '--l-text': color[lightTextVariantIndex].toHexString(),
    '--l-text-h': color[lightTextVariantIndex].toHexString(),
    '--d-fill': 'transparent',
    '--l-fill': 'transparent',
    '--d-border': 'transparent',
    '--l-border': 'transparent',
  }
}

function getSubtleVariantStyle(color: tinycolor.Instance[]): Record<string, string> {
  return {
    '--d-fill': 'transparent',
    '--d-fill-h': color[3].setAlpha(darkOpacity).toHex8String(),
    '--d-text': color[2].toHexString(),
    '--d-text-h': color[2].toHexString(),
    '--d-border': 'transparent',
    '--l-fill': 'transparent',
    '--l-fill-h': color[3].setAlpha(lightOpacity).toHex8String(),
    '--l-text': color[6].toHexString(),
    '--l-text-h': color[6].toHexString(),
    '--l-border': 'transparent',
  }
}

function getContrastVariantStyle(color: tinycolor.Instance[]): Record<string, string> {
  return {
    '--d-text': color[2].toHexString(),
    '--d-text-h': 'white',
    '--d-fill': 'transparent',
    '--d-fill-h': color[5].toHexString(),
    '--d-border': 'transparent',
    '--l-text': color[6].toHexString(),
    '--l-text-h': 'white',
    '--l-fill': 'transparent',
    '--l-fill-h': color[5].toHexString(),
    '--l-border': 'transparent',
  }
}

function getWhiteVariantStyle(color: tinycolor.Instance[]): Record<string, string> {
  return {
    '--d-fill': 'white',
    '--d-fill-h': 'white',
    '--d-text': color[6].toHexString(),
    '--d-text-h': color[6].toHexString(),
    '--d-border': 'transparent',
    '--l-fill': 'white',
    '--l-fill-h': 'white',
    '--l-text': color[6].toHexString(),
    '--l-text-h': color[6].toHexString(),
    '--l-border': 'transparent',
  }
}

export function useBtnColorStyle(color: MaybeRef<string>, variant: MaybeRef<BtnVariant> = 'default') {
  const colors = useColorsObjs(color)
  return useColorStyleByColorsAndBtnVariant(colors, variant)
}

export function useInputColorStyle(color: MaybeRef<string>, variant: MaybeRef<InputVariant> = 'default') {
  const colors = useColorsObjs(color).value
  const surfaceColors = useSurfaceColors().value
  switch (unref(variant)) {
    case 'default':
      return {
        '--d-fill': surfaceColors[8].toHexString(),
        '--d-border-f': colors[5].toHexString(),
        '--d-border': surfaceColors[7].toHexString(),
        '--d-placeholder': surfaceColors[5].toHexString(),
        '--d-text': 'white',

        '--l-fill': surfaceColors[1].toHexString(),
        '--l-border-f': colors[4].toHexString(),
        '--l-border': surfaceColors[4].toHexString(),
        '--l-placeholder': surfaceColors[5].toHexString(),
        '--l-text': 'black',
      }
    case 'filled':
      return {
        '--d-fill': colors[5].toHexString(),
        '--d-fill-h': colors[6].toHexString(),
        '--d-border': 'transparent',
        '--l-fill': colors[5].toHexString(),
        '--l-fill-h': colors[6].toHexString(),
        '--l-border': 'transparent',

      }
  }
}

export function useColorStyleWithKey(color: MaybeRef<string>, keys: any[]) {
  const colorStyle = useBtnColorStyle(color)
  return computed(() => {
    return keys.reduce((prev, curr) => {
      for (const v of ['l', 'd']) {
        const key = `--${v}-${curr}`
        prev[key] = colorStyle.value[key as keyof typeof colorStyle.value]
      }
      return prev
    }, {})
  })
}
