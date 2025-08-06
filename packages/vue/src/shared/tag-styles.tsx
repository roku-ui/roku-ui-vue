import type { Color as CuloriColor } from 'culori'
import type { ComputedRef, MaybeRef } from 'vue'
import type { BtnVariant, Color } from '@/types'
import { formatHex, formatHex8 } from 'culori'
import { computed, unref } from 'vue'
import { generateAdaptiveLightnessMap, generateColorsObjMapOKLCH } from '@/utils'
import type { CS } from './color-system'
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