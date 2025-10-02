import type { Color as CuloriColor } from 'culori'
import type { ComputedRef, MaybeRef } from 'vue'
import type { CS } from './color-system'
import type { BtnVariant, Color } from '@/types'
import { computed, unref } from 'vue'
import { generateAdaptiveLightnessMap, generateColorsObjMapOKLCH } from '@/utils'
import { safeHex, safeHex8 } from './color-helpers'
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
    '--d-bg': safeHex(surface[darkSurfaceBgVariant1Index]),
    '--d-bg-h': safeHex(surface[darkSurfaceBgVariant2Index]),
    '--d-border': safeHex(surface[darkBorderVariantIndex]),
    '--l-bg': safeHex(surface[lightSurfaceBgIndex]),
    '--l-bg-h': safeHex(surface[lightSurfaceBgVariantIndex]),
    '--l-border': safeHex(surface[lightBorderVariantIndex]),
  }
}

function getFilledVariantStyle(color: CuloriColor[]): Record<string, string> {
  return {
    '--d-border': 'transparent',
    '--d-bg': safeHex(color[darkBgIndex]),
    '--d-bg-h': safeHex(color[darkBgVariantIndex]),
    '--d-text': 'white',
    '--l-bg': safeHex(color[lightBgIndex]),
    '--l-bg-h': safeHex(color[lightBgVariantIndex]),
    '--l-text': 'white',
    '--l-text-h': 'white',
    '--l-border': 'transparent',
  }
}

function getLightVariantStyle(color: CuloriColor[]): Record<string, string> {
  return {
    '--d-border': 'transparent',
    '--d-bg': safeHex8(color[darkBgIndex], darkOpacity),
    '--d-bg-h': safeHex8(color[darkBgIndex], darkOpacityVariant),
    '--d-text': safeHex(color[darkTextIndex]),
    '--d-text-h': safeHex(color[darkTextIndex]),
    '--l-bg': safeHex8(color[lightBgIndex], lightOpacity),
    '--l-bg-h': safeHex8(color[lightBgIndex], lightOpacityVariant),
    '--l-text': safeHex(color[lightTextIndex]),
    '--l-text-h': safeHex(color[lightTextIndex]),
    '--l-border': 'transparent',
  }
}

function getOutlineVariantStyle(color: CuloriColor[]): Record<string, string> {
  return {
    '--d-bg': 'transparent',
    '--d-bg-h': safeHex8(color[darkBgVariantIndex], darkOpacity),
    '--d-text': safeHex(color[darkTextIndex]),
    '--d-text-h': safeHex(color[darkTextIndex]),
    '--d-border': safeHex(color[darkBorderIndex]),
    '--l-bg': 'transparent',
    '--l-bg-h': safeHex8(color[lightBgVariantIndex], lightOpacity),
    '--l-text': safeHex(color[lightTextIndex]),
    '--l-text-h': safeHex(color[lightTextIndex]),
    '--l-border': safeHex(color[lightBorderIndex]),
  }
}

function getTransparentVariantStyle(color: CuloriColor[]): Record<string, string> {
  return {
    '--d-text': safeHex(color[3]),
    '--d-text-h': safeHex(color[3]),
    '--l-text': safeHex(color[5]),
    '--l-text-h': safeHex(color[5]),
    '--d-bg': 'transparent',
    '--l-bg': 'transparent',
    '--d-border': 'transparent',
    '--l-border': 'transparent',
  }
}

function getSubtleVariantStyle(color: CuloriColor[]): Record<string, string> {
  return {
    '--d-bg': 'transparent',
    '--d-bg-h': safeHex8(color[3], darkOpacity),
    '--d-text': safeHex(color[2]),
    '--d-text-h': safeHex(color[2]),
    '--d-border': 'transparent',
    '--l-bg': 'transparent',
    '--l-bg-h': safeHex8(color[3], lightOpacity),
    '--l-text': safeHex(color[5]),
    '--l-text-h': safeHex(color[5]),
    '--l-border': 'transparent',
  }
}

function getContrastVariantStyle(color: CuloriColor[]): Record<string, string> {
  return {
    '--d-text': safeHex(color[2]),
    '--d-text-h': 'white',
    '--d-bg': 'transparent',
    '--d-bg-h': safeHex(color[5]),
    '--d-border': 'transparent',
    '--l-text': safeHex(color[5]),
    '--l-text-h': 'white',
    '--l-bg': 'transparent',
    '--l-bg-h': safeHex(color[5]),
    '--l-border': 'transparent',
  }
}

function getWhiteVariantStyle(color: CuloriColor[]): Record<string, string> {
  return {
    '--d-bg': 'white',
    '--d-bg-h': 'white',
    '--d-text': safeHex(color[4]),
    '--d-text-h': safeHex(color[4]),
    '--d-border': 'transparent',
    '--l-bg': 'white',
    '--l-bg-h': 'white',
    '--l-text': safeHex(color[5]),
    '--l-text-h': safeHex(color[5]),
    '--l-border': 'transparent',
  }
}
