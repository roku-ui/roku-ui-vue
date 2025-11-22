import type { Color as CuloriColor } from 'culori'
import type { ComputedRef, MaybeRef } from 'vue'
import type { CS } from './color-system'
import type { BtnVariant, Color } from '@/types'
import { formatHex } from 'culori'
import { computed, unref } from 'vue'
import { generateAdaptiveLightnessMap, generateColorsObjMapOKLCH } from '@/utils'
import { safeHex, safeHex8 } from './color-helpers'
import { useColors } from './color-system'
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
import { getThemeColorString } from './theme'

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
      inverted: () => getInvertedTagVariantStyle(surface, interactive),
      filled: () => getFilledTagVariantStyle(colors, interactive),
      light: () => getLightTagVariantStyle(colors, interactive),
      outline: () => getOutlineTagVariantStyle(colors, interactive),
      transparent: () => getTransparentTagVariantStyle(colors, interactive),
      subtle: () => getSubtleTagVariantStyle(colors, interactive),
      contrast: () => getContrastTagVariantStyle(colors, interactive),
    }
    return variantStyles[unref(variant)]()
  })
}

function getDefaultTagVariantStyle(surface: CuloriColor[], hasInteraction: boolean): CS {
  const baseStyle = {
    '--d-bg': formatHex(surface[SURFACE_BG.container.dark]) || '#000000',
    '--d-border': formatHex(surface[SURFACE_BORDER.base.dark]) || '#000000',
    '--l-bg': formatHex(surface[SURFACE_BG.container.light]) || '#000000',
    '--l-border': formatHex(surface[SURFACE_BORDER.base.light]) || '#000000',
  }

  const baseClass = [
    'bg-[var(--r-scheme-bg)]',
    'border-[var(--r-scheme-border)]',
  ]

  if (hasInteraction) {
    return {
      style: {
        ...baseStyle,
        '--d-bg-h': formatHex(surface[SURFACE_BG.containerHover.dark]) || '#000000',
        '--l-bg-h': formatHex(surface[SURFACE_BG.containerHover.light]) || '#000000',
      },
      class: [
        ...baseClass,
        'hover:bg-[var(--r-scheme-bg-hover)]',
      ],
    }
  }

  return {
    style: baseStyle,
    class: baseClass,
  }
}

function getInvertedTagVariantStyle(surface: CuloriColor[], hasInteraction: boolean): CS {
  const baseStyle = {
    '--d-bg': formatHex(surface[SURFACE_BG.inverted.dark]) || '#000000',
    '--d-border': formatHex(surface[SURFACE_BORDER.inverted.dark]) || '#000000',
    '--d-text': formatHex(surface[SURFACE_TEXT.inverted.dark]) || '#000000',
    '--l-bg': formatHex(surface[SURFACE_BG.inverted.light]) || '#000000',
    '--l-border': formatHex(surface[SURFACE_BORDER.inverted.light]) || '#000000',
    '--l-text': formatHex(surface[SURFACE_TEXT.inverted.light]) || '#000000',
  }

  const baseClass = [
    'bg-[var(--r-scheme-bg)]',
    'border-[var(--r-scheme-border)]',
    'text-[var(--r-scheme-text)]',
  ]

  if (hasInteraction) {
    return {
      style: {
        ...baseStyle,
        '--d-bg-h': formatHex(surface[SURFACE_BG.container.dark]) || '#000000',
        '--l-bg-h': formatHex(surface[SURFACE_BG.container.light]) || '#000000',
      },
      class: [
        ...baseClass,
        'hover:bg-[var(--r-scheme-bg-hover)]',
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
    '--d-bg': formatHex(color[COLOR_BG.solid.dark]) || '#000000',
    '--d-text': 'white',
    '--l-bg': formatHex(color[COLOR_BG.solid.light]) || '#000000',
    '--l-text': 'white',
    '--l-border': 'transparent',
  }

  const baseClass = [
    'border-[var(--r-scheme-border)]',
    'bg-[var(--r-scheme-bg)]',
    'text-[var(--r-scheme-text)]',
  ]

  if (hasInteraction) {
    return {
      style: {
        ...baseStyle,
        '--d-bg-h': formatHex(color[COLOR_BG.hover.dark]) || '#000000',
        '--l-bg-h': formatHex(color[COLOR_BG.hover.light]) || '#000000',
        '--l-text-h': 'white',
      },
      class: [
        ...baseClass,
        'hover:bg-[var(--r-scheme-bg-hover)]',
        'hover:text-[var(--r-scheme-text-hover)]',
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
    '--d-bg': safeHex8(color[COLOR_BG.solid.dark], OPACITY_SCALE.dark.tint),
    '--d-text': safeHex(color[COLOR_TEXT.solid.dark]),
    '--l-bg': safeHex8(color[COLOR_BG.solid.light], OPACITY_SCALE.light.tint),
    '--l-text': safeHex(color[COLOR_TEXT.solid.light]),
    '--l-border': 'transparent',
  }

  const baseClass = [
    'border-[var(--r-scheme-border)]',
    'bg-[var(--r-scheme-bg)]',
    'text-[var(--r-scheme-text)]',
  ]

  if (hasInteraction) {
    return {
      style: {
        ...baseStyle,
        '--d-bg-h': safeHex8(color[COLOR_BG.solid.dark], OPACITY_SCALE.dark.tintHover),
        '--d-text-h': safeHex(color[COLOR_TEXT.solid.dark]),
        '--l-bg-h': safeHex8(color[COLOR_BG.solid.light], OPACITY_SCALE.light.tintHover),
        '--l-text-h': safeHex(color[COLOR_TEXT.solid.light]),
      },
      class: [
        ...baseClass,
        'hover:bg-[var(--r-scheme-bg-hover)]',
        'hover:text-[var(--r-scheme-text-hover)]',
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
    '--d-text': safeHex(color[COLOR_TEXT.solid.dark]),
    '--d-border': safeHex(color[COLOR_BORDER.solid.dark]),
    '--l-bg': 'transparent',
    '--l-text': safeHex(color[COLOR_TEXT.solid.light]),
    '--l-border': safeHex(color[COLOR_BORDER.solid.light]),
  }

  const baseClass = [
    'bg-[var(--r-scheme-bg)]',
    'text-[var(--r-scheme-text)]',
    'border-[var(--r-scheme-border)]',
  ]

  if (hasInteraction) {
    return {
      style: {
        ...baseStyle,
        '--d-bg-h': safeHex8(color[COLOR_BG.hover.dark], OPACITY_SCALE.dark.tint),
        '--d-text-h': safeHex(color[COLOR_TEXT.solid.dark]),
        '--l-bg-h': safeHex8(color[COLOR_BG.hover.light], OPACITY_SCALE.light.tint),
        '--l-text-h': safeHex(color[COLOR_TEXT.solid.light]),
      },
      class: [
        ...baseClass,
        'hover:bg-[var(--r-scheme-bg-hover)]',
        'hover:text-[var(--r-scheme-text-hover)]',
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
    '--d-text': formatHex(color[COLOR_TEXT.solid.dark]) || '#000000',
    '--l-text': formatHex(color[COLOR_TEXT.solid.light]) || '#000000',
    '--d-bg': 'transparent',
    '--l-bg': 'transparent',
    '--d-border': 'transparent',
    '--l-border': 'transparent',
  }

  const baseClass = [
    'text-[var(--r-scheme-text)]',
    'bg-[var(--r-scheme-bg)]',
    'border-[var(--r-scheme-border)]',
  ]

  if (hasInteraction) {
    return {
      style: {
        ...baseStyle,
        '--d-text-h': formatHex(color[COLOR_TEXT.solid.dark]) || '#000000',
        '--l-text-h': formatHex(color[COLOR_TEXT.hover.light]) || '#000000',
      },
      class: [
        ...baseClass,
        'hover:text-[var(--r-scheme-text-hover)]',
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
    '--d-text': safeHex(color[COLOR_TEXT.solid.dark]),
    '--d-border': 'transparent',
    '--l-bg': 'transparent',
    '--l-text': safeHex(color[COLOR_TEXT.solid.light]),
    '--l-border': 'transparent',
  }

  const baseClass = [
    'bg-[var(--r-scheme-bg)]',
    'text-[var(--r-scheme-text)]',
    'border-[var(--r-scheme-border)]',
  ]

  if (hasInteraction) {
    return {
      style: {
        ...baseStyle,
        '--d-bg-h': safeHex8(color[COLOR_TINT_INDEX], OPACITY_SCALE.dark.tint),
        '--d-text-h': safeHex(color[COLOR_TEXT.solid.dark]),
        '--l-bg-h': safeHex8(color[COLOR_TINT_INDEX], OPACITY_SCALE.light.tint),
        '--l-text-h': safeHex(color[COLOR_TEXT.hover.light]),
      },
      class: [
        ...baseClass,
        'hover:bg-[var(--r-scheme-bg-hover)]',
        'hover:text-[var(--r-scheme-text-hover)]',
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
    '--d-text': safeHex(color[COLOR_TEXT.solid.dark]),
    '--d-bg': 'transparent',
    '--d-border': 'transparent',
    '--l-text': safeHex(color[COLOR_TEXT.solid.light]),
    '--l-bg': 'transparent',
    '--l-border': 'transparent',
  }

  const baseClass = [
    'text-[var(--r-scheme-text)]',
    'bg-[var(--r-scheme-bg)]',
    'border-[var(--r-scheme-border)]',
  ]

  if (hasInteraction) {
    return {
      style: {
        ...baseStyle,
        '--d-text-h': 'white',
        '--d-bg-h': safeHex(color[COLOR_BG.hover.light]),
        '--l-text-h': 'white',
        '--l-bg-h': safeHex(color[COLOR_BG.hover.light]),
      },
      class: [
        ...baseClass,
        'hover:text-[var(--r-scheme-text-hover)]',
        'hover:bg-[var(--r-scheme-bg-hover)]',
      ],
    }
  }

  return {
    style: baseStyle,
    class: baseClass,
  }
}
