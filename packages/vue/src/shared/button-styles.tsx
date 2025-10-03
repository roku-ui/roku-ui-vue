import type { ComputedRef, MaybeRef } from 'vue'
import type { CS } from './color-system'
import type { VariantStyleConfig } from './style-recipes'
import type { BtnVariant, Color } from '@/types'
import { computed, unref } from 'vue'
import { useColors, useSurfaceColors } from './color-system'
import {
  COLOR_BG,
  COLOR_BORDER,
  COLOR_TEXT,
  COLOR_TINT_INDEX,
  OPACITY_SCALE,
  SURFACE_BG,
  SURFACE_BORDER,
  SURFACE_TEXT,
} from './constants'
import { buildVariantStyles } from './style-recipes'

const buttonVariantConfigs: Record<BtnVariant, VariantStyleConfig> = {
  default: {
    '--d-bg': { palette: 'surface', index: SURFACE_BG.container.dark },
    '--d-bg-h': { palette: 'surface', index: SURFACE_BG.containerHover.dark },
    '--d-border': { palette: 'surface', index: SURFACE_BORDER.base.dark },
    '--l-bg': { palette: 'surface', index: SURFACE_BG.container.light },
    '--l-bg-h': { palette: 'surface', index: SURFACE_BG.containerHover.light },
    '--l-border': { palette: 'surface', index: SURFACE_BORDER.base.light },
  },
  inverted: {
    '--d-bg': { palette: 'surface', index: SURFACE_BG.inverted.dark },
    '--d-bg-h': { palette: 'surface', index: SURFACE_BG.container.dark },
    '--d-text': { palette: 'surface', index: SURFACE_TEXT.inverted.dark },
    '--d-text-h': { palette: 'surface', index: SURFACE_TEXT.inverted.dark },
    '--d-border': { palette: 'surface', index: SURFACE_BORDER.inverted.dark },
    '--l-bg': { palette: 'surface', index: SURFACE_BG.inverted.light },
    '--l-bg-h': { palette: 'surface', index: SURFACE_BG.container.light },
    '--l-text': { palette: 'surface', index: SURFACE_TEXT.inverted.light },
    '--l-text-h': { palette: 'surface', index: SURFACE_TEXT.inverted.light },
    '--l-border': { palette: 'surface', index: SURFACE_BORDER.inverted.light },
  },
  filled: {
    '--d-border': { source: 'literal', value: 'transparent' },
    '--d-bg': { index: COLOR_BG.solid.dark },
    '--d-bg-h': { index: COLOR_BG.hover.dark },
    '--d-text': { source: 'literal', value: 'white' },
    '--l-bg': { index: COLOR_BG.solid.light },
    '--l-bg-h': { index: COLOR_BG.hover.light },
    '--l-text': { source: 'literal', value: 'white' },
    '--l-text-h': { source: 'literal', value: 'white' },
    '--l-border': { source: 'literal', value: 'transparent' },
  },
  light: {
    '--d-border': { source: 'literal', value: 'transparent' },
    '--d-bg': { index: COLOR_BG.solid.dark, format: 'hex8', alpha: OPACITY_SCALE.dark.tint },
    '--d-bg-h': { index: COLOR_BG.solid.dark, format: 'hex8', alpha: OPACITY_SCALE.dark.tintHover },
    '--d-text': { index: COLOR_TEXT.solid.dark },
    '--d-text-h': { index: COLOR_TEXT.solid.dark },
    '--l-bg': { index: COLOR_BG.solid.light, format: 'hex8', alpha: OPACITY_SCALE.light.tint },
    '--l-bg-h': { index: COLOR_BG.solid.light, format: 'hex8', alpha: OPACITY_SCALE.light.tintHover },
    '--l-text': { index: COLOR_TEXT.solid.light },
    '--l-text-h': { index: COLOR_TEXT.solid.light },
    '--l-border': { source: 'literal', value: 'transparent' },
  },
  outline: {
    '--d-bg': { source: 'literal', value: 'transparent' },
    '--d-bg-h': { index: COLOR_BG.hover.dark, format: 'hex8', alpha: OPACITY_SCALE.dark.tint },
    '--d-text': { index: COLOR_TEXT.solid.dark },
    '--d-text-h': { index: COLOR_TEXT.solid.dark },
    '--d-border': { index: COLOR_BORDER.solid.dark },
    '--l-bg': { source: 'literal', value: 'transparent' },
    '--l-bg-h': { index: COLOR_BG.hover.light, format: 'hex8', alpha: OPACITY_SCALE.light.tint },
    '--l-text': { index: COLOR_TEXT.solid.light },
    '--l-text-h': { index: COLOR_TEXT.solid.light },
    '--l-border': { index: COLOR_BORDER.solid.light },
  },
  transparent: {
    '--d-text': { index: COLOR_TEXT.solid.dark },
    '--d-text-h': { index: COLOR_TEXT.hover.dark },
    '--l-text': { index: COLOR_TEXT.solid.light },
    '--l-text-h': { index: COLOR_TEXT.hover.light },
    '--d-bg': { source: 'literal', value: 'transparent' },
    '--l-bg': { source: 'literal', value: 'transparent' },
    '--d-border': { source: 'literal', value: 'transparent' },
    '--l-border': { source: 'literal', value: 'transparent' },
  },
  subtle: {
    '--d-bg': { source: 'literal', value: 'transparent' },
    '--d-bg-h': { index: COLOR_TINT_INDEX, format: 'hex8', alpha: OPACITY_SCALE.dark.tint },
    '--d-text': { index: COLOR_TEXT.solid.dark },
    '--d-text-h': { index: COLOR_TEXT.solid.dark },
    '--d-border': { source: 'literal', value: 'transparent' },
    '--l-bg': { source: 'literal', value: 'transparent' },
    '--l-bg-h': { index: COLOR_TINT_INDEX, format: 'hex8', alpha: OPACITY_SCALE.light.tint },
    '--l-text': { index: COLOR_TEXT.solid.light },
    '--l-text-h': { index: COLOR_TEXT.hover.light },
    '--l-border': { source: 'literal', value: 'transparent' },
  },
  contrast: {
    '--d-text': { index: COLOR_TEXT.solid.dark },
    '--d-text-h': { source: 'literal', value: 'white' },
    '--d-bg': { source: 'literal', value: 'transparent' },
    '--d-bg-h': { index: COLOR_BG.hover.light },
    '--d-border': { source: 'literal', value: 'transparent' },
    '--l-text': { index: COLOR_TEXT.solid.light },
    '--l-text-h': { source: 'literal', value: 'white' },
    '--l-bg': { source: 'literal', value: 'transparent' },
    '--l-bg-h': { index: COLOR_BG.hover.light },
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
