import { type MaybeRef, unref } from 'vue'
import tinycolor from 'tinycolor2'
import { generateColorsObjMap } from '../utils'
import type { Variant } from '../types'
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
function useColorsObjs(color: MaybeRef<string>) {
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

export function useColorStyleByColorsAndVariant(colorInstances: MaybeRef<tinycolor.Instance[]>, variant: MaybeRef<Variant> | undefined = undefined) {
  return computed(() => {
    const color = unref(colorInstances)
    const surface = generateColorsObjMap(unref(surfaceColor), SURFACE_LIGHTNESS_MAP).colors

    const lSurfaceHigh = surface[0].toHexString()
    const lSurfaceBorder = surface[3].toHexString()

    const dSurfaceHigh = surface[8].toHexString()
    const dSurfaceBorder = surface[7].toHexString()

    const dFill = color[5].toHexString()
    const dFillH = color[6].toHexString()
    const dOnFill = tinycolor.mostReadable(color[5].toHexString(), [color[0], color[10]], { includeFallbackColors: true }).toHexString()
    const lFill = color[5].toHexString()
    const lFillH = color[6].toHexString()
    const lOnFill = tinycolor.mostReadable(color[5].toHexString(), [color[0], color[10]], { includeFallbackColors: true }).toHex8String()

    const dText = color[3].toHexString()
    const dTextH = color[4].toHexString()
    const lText = color[5].toHexString()
    const lTextH = color[6].toHexString()
    const lFillT = color[6].setAlpha(0.08).toHex8String()
    const lFillTH = color[6].setAlpha(0.1).toHex8String()
    const lFillOp50 = color[6].setAlpha(0.5).toHex8String()
    const lFillOp75 = color[6].setAlpha(0.75).toHex8String()
    const dFillT = color[4].setAlpha(0.2).toHex8String()
    const dFillTH = color[4].setAlpha(0.3).toHex8String()
    const dFillOp50 = color[4].setAlpha(0.5).toHex8String()
    const dFillOp75 = color[4].setAlpha(0.75).toHex8String()
    if (!variant) {
      return {
        '--d-text': dText,
        '--d-text-h': dTextH,
        '--d-fill': dFill,
        '--d-fill-t': dFillT,
        '--d-fill-h': dFillH,
        '--d-on-fill': dOnFill,
        '--d-border': dSurfaceBorder,
        '--d-border-h': surface[7].toHexString(),
        '--d-fill-t-h': dFillTH,
        '--d-fill-50': dFillOp50,
        '--d-fill-75': dFillOp75,
        '--l-text': lText,
        '--l-text-h': lTextH,
        '--l-fill': lFill,
        '--l-fill-t': lFillT,
        '--l-fill-h': lFillH,
        '--l-on-fill': lOnFill,
        '--l-border': lSurfaceBorder,
        '--l-border-h': surface[3].toHexString(),
        '--l-fill-t-h': lFillTH,
        '--l-fill-50': lFillOp50,
        '--l-fill-75': lFillOp75,
      }
    }
    switch (unref(variant)) {
      case 'default':
        return {
          '--d-surface-high': dSurfaceHigh,
          '--d-surface-border': dSurfaceBorder,
          '--l-surface-high': lSurfaceHigh,
          '--l-surface-border': lSurfaceBorder,
        }
      case 'filled':
        return {
          '--d-fill': dFill,
          '--l-fill': lFill,
          '--d-on-fill': dOnFill,
          '--l-on-fill': lOnFill,
          '--l-fill-h': lFillH,
          '--d-fill-h': dFillH,
        }
      case 'outline':
        return {
          '--d-text': dText,
          '--d-text-h': dTextH,
          '--d-fill-t': dFillT,
          '--l-text': lText,
          '--l-text-h': lTextH,
          '--l-fill-t': lFillT,
        }
      case 'light':
        return {
          '--d-fill-t': dFillT,
          '--d-fill-t-h': dFillTH,
          '--d-text': dText,
          '--l-fill-t': lFillT,
          '--l-fill-t-h': lFillTH,
          '--l-text': lText,
        }
      case 'subtle':
        return {
          '--d-text': dText,
          '--d-fill-t': dFillT,
          '--l-text': lText,
          '--l-fill-t': lFillT,
        }
      case 'transparent':
        return {
          '--d-text': dText,
          '--l-text': lText,
        }
      case 'contrast':
        return {
          '--d-text': dText,
          '--l-text': lText,
          '--d-fill': dFill,
          '--l-fill': lFill,
          '--d-on-fill': dOnFill,
          '--l-on-fill': lOnFill,
        }
      case 'white':
        return {
          '--d-text': dFill,
          '--l-text': lFill,
        }
    }
    return {}
  })
}

export function useColorStyle(color: MaybeRef<string>, variant: MaybeRef<Variant> | undefined = undefined) {
  const colors = useColorsObjs(color)
  return useColorStyleByColorsAndVariant(colors, variant)
}

export function useColorStyleWithKey(color: MaybeRef<string>, keys: any[]) {
  const colorStyle = useColorStyle(color)
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

export function useColorClass(variant: MaybeRef<Variant>) {
  return computed(() => {
    switch (unref(variant)) {
      case 'default':
        return 'theme-default'
      case 'filled':
        return 'theme-filled'
      case 'outline':
        return 'theme-outline'
      case 'light':
        return 'theme-light'
      case 'transparent':
        return 'theme-transparent'
      case 'subtle':
        return 'theme-subtle'
      case 'contrast':
        return 'theme-contrast'
      case 'white':
        return 'theme-white'
      default:
        return []
    }
  })
}
