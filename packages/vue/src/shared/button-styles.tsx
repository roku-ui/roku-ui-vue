import type { Color as CuloriColor } from 'culori'
import type { ComputedRef, MaybeRef } from 'vue'
import type { CS } from './color-system'
import type { BtnVariant, Color } from '@/types'
import { formatHex, formatHex8 } from 'culori'
import { computed, unref } from 'vue'
import { generateAdaptiveLightnessMap, generateColorsObjMapOKLCH } from '@/utils'
import { useColors } from './color-system'
import {
  darkBgIndex,
  darkBgVariantIndex,
  darkBorderIndex,
  darkBorderVariantIndex,
  darkOpacity,
  darkOpacityVariant,
  darkSurfaceBgVariant1Index,
  darkSurfaceBgVariant2Index,
  darkTextIndex,
  lightBgIndex,
  lightBgVariantIndex,
  lightBorderIndex,
  lightBorderVariantIndex,
  lightOpacity,
  lightOpacityVariant,
  lightSurfaceBgIndex,
  lightSurfaceBgVariantIndex,
  lightTextIndex,
} from './constants'
import { getThemeColorString } from './theme'

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
