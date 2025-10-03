import type { ComputedRef, MaybeRef } from 'vue'
import type { CS } from './color-system'
import type { VariantStyleConfig } from './style-recipes'
import type { BtnVariant, Color } from '@/types'
import { computed, unref } from 'vue'
import { useColors, useSurfaceColors } from './color-system'
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
  lightTextVariantIndex,
} from './constants'
import { buildVariantStyles } from './style-recipes'

const darkContrastTextIndex = 2
const lightSubtleBgIndex = 3
const whiteVariantTextIndex = 4

const buttonVariantConfigs: Record<BtnVariant, VariantStyleConfig> = {
  default: {
    '--d-bg': { source: 'surface', index: darkSurfaceBgVariant1Index },
    '--d-bg-h': { source: 'surface', index: darkSurfaceBgVariant2Index },
    '--d-border': { source: 'surface', index: darkBorderVariantIndex },
    '--l-bg': { source: 'surface', index: lightSurfaceBgIndex },
    '--l-bg-h': { source: 'surface', index: lightSurfaceBgVariantIndex },
    '--l-border': { source: 'surface', index: lightBorderVariantIndex },
  },
  filled: {
    '--d-border': { source: 'literal', value: 'transparent' },
    '--d-bg': { source: 'color', index: darkBgIndex },
    '--d-bg-h': { source: 'color', index: darkBgVariantIndex },
    '--d-text': { source: 'literal', value: 'white' },
    '--l-bg': { source: 'color', index: lightBgIndex },
    '--l-bg-h': { source: 'color', index: lightBgVariantIndex },
    '--l-text': { source: 'literal', value: 'white' },
    '--l-text-h': { source: 'literal', value: 'white' },
    '--l-border': { source: 'literal', value: 'transparent' },
  },
  light: {
    '--d-border': { source: 'literal', value: 'transparent' },
    '--d-bg': { source: 'color', index: darkBgIndex, format: 'hex8', alpha: darkOpacity },
    '--d-bg-h': { source: 'color', index: darkBgIndex, format: 'hex8', alpha: darkOpacityVariant },
    '--d-text': { source: 'color', index: darkTextIndex },
    '--d-text-h': { source: 'color', index: darkTextIndex },
    '--l-bg': { source: 'color', index: lightBgIndex, format: 'hex8', alpha: lightOpacity },
    '--l-bg-h': { source: 'color', index: lightBgIndex, format: 'hex8', alpha: lightOpacityVariant },
    '--l-text': { source: 'color', index: lightTextIndex },
    '--l-text-h': { source: 'color', index: lightTextIndex },
    '--l-border': { source: 'literal', value: 'transparent' },
  },
  outline: {
    '--d-bg': { source: 'literal', value: 'transparent' },
    '--d-bg-h': { source: 'color', index: darkBgVariantIndex, format: 'hex8', alpha: darkOpacity },
    '--d-text': { source: 'color', index: darkTextIndex },
    '--d-text-h': { source: 'color', index: darkTextIndex },
    '--d-border': { source: 'color', index: darkBorderIndex },
    '--l-bg': { source: 'literal', value: 'transparent' },
    '--l-bg-h': { source: 'color', index: lightBgVariantIndex, format: 'hex8', alpha: lightOpacity },
    '--l-text': { source: 'color', index: lightTextIndex },
    '--l-text-h': { source: 'color', index: lightTextIndex },
    '--l-border': { source: 'color', index: lightBorderIndex },
  },
  transparent: {
    '--d-text': { source: 'color', index: darkTextIndex },
    '--d-text-h': { source: 'color', index: darkTextIndex },
    '--l-text': { source: 'color', index: lightTextVariantIndex },
    '--l-text-h': { source: 'color', index: lightTextVariantIndex },
    '--d-bg': { source: 'literal', value: 'transparent' },
    '--l-bg': { source: 'literal', value: 'transparent' },
    '--d-border': { source: 'literal', value: 'transparent' },
    '--l-border': { source: 'literal', value: 'transparent' },
  },
  subtle: {
    '--d-bg': { source: 'literal', value: 'transparent' },
    '--d-bg-h': { source: 'color', index: lightSubtleBgIndex, format: 'hex8', alpha: darkOpacity },
    '--d-text': { source: 'color', index: darkContrastTextIndex },
    '--d-text-h': { source: 'color', index: darkContrastTextIndex },
    '--d-border': { source: 'literal', value: 'transparent' },
    '--l-bg': { source: 'literal', value: 'transparent' },
    '--l-bg-h': { source: 'color', index: lightSubtleBgIndex, format: 'hex8', alpha: lightOpacity },
    '--l-text': { source: 'color', index: lightTextVariantIndex },
    '--l-text-h': { source: 'color', index: lightTextVariantIndex },
    '--l-border': { source: 'literal', value: 'transparent' },
  },
  contrast: {
    '--d-text': { source: 'color', index: darkContrastTextIndex },
    '--d-text-h': { source: 'literal', value: 'white' },
    '--d-bg': { source: 'literal', value: 'transparent' },
    '--d-bg-h': { source: 'color', index: lightBgVariantIndex },
    '--d-border': { source: 'literal', value: 'transparent' },
    '--l-text': { source: 'color', index: lightTextVariantIndex },
    '--l-text-h': { source: 'literal', value: 'white' },
    '--l-bg': { source: 'literal', value: 'transparent' },
    '--l-bg-h': { source: 'color', index: lightBgVariantIndex },
    '--l-border': { source: 'literal', value: 'transparent' },
  },
  white: {
    '--d-bg': { source: 'literal', value: 'white' },
    '--d-bg-h': { source: 'literal', value: 'white' },
    '--d-text': { source: 'color', index: whiteVariantTextIndex },
    '--d-text-h': { source: 'color', index: whiteVariantTextIndex },
    '--d-border': { source: 'literal', value: 'transparent' },
    '--l-bg': { source: 'literal', value: 'white' },
    '--l-bg-h': { source: 'literal', value: 'white' },
    '--l-text': { source: 'color', index: lightTextVariantIndex },
    '--l-text-h': { source: 'color', index: lightTextVariantIndex },
    '--l-border': { source: 'literal', value: 'transparent' },
  },
}

export function useButtonCS(variant: MaybeRef<BtnVariant> = 'default', color: MaybeRef<Color> = 'primary'): ComputedRef<CS> {
  const colorPalette = useColors(color)
  const surfacePalette = useSurfaceColors()
  return computed(() => {
    const variantKey = unref(variant)
    const config = buttonVariantConfigs[variantKey] ?? buttonVariantConfigs.default
    return {
      style: buildVariantStyles(config, {
        color: colorPalette.value,
        surface: surfacePalette.value,
      }),
      class: 'custom-colors',
    }
  })
}
