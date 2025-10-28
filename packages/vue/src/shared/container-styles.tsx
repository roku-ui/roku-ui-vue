import type { MaybeRef } from 'vue'
import type { CSIndex, CSType } from './color-system'
import type { Color, ContainerVariant } from '@/types'
import { computed, unref } from 'vue'
import { useCS, useMergedCS } from './color-system'
import {
  COLOR_BG,
  COLOR_TEXT,
  OPACITY_SCALE,
  SURFACE_BG,
  SURFACE_BORDER,
  SURFACE_TEXT,
} from './constants'

interface ContainerCSRecipeEntry {
  color?: 'surface'
  type: CSType
  index: CSIndex
  alpha?: number
}

interface ContainerCSRecipe {
  entries: ContainerCSRecipeEntry[]
  extraClass?: string[]
}

function resolveContainerRecipe(recipe: ContainerCSRecipe, variantColor?: MaybeRef<Color>) {
  const csList = recipe.entries.map((entry) => {
    if (entry.color === 'surface') {
      return useCS({
        color: 'surface',
        type: entry.type,
        index: entry.index,
        alpha: entry.alpha,
      })
    }
    if (!variantColor) {
      throw new Error('Container recipe requires a color source')
    }
    return useCS({
      color: variantColor,
      type: entry.type,
      index: entry.index,
      alpha: entry.alpha,
    })
  })
  return useMergedCS(csList, recipe.extraClass ?? [])
}

const containerRecipes: Record<ContainerVariant, ContainerCSRecipe> = {
  default: {
    entries: [
      {
        color: 'surface',
        type: 'bg',
        index: { dark: SURFACE_BG.container.dark, light: SURFACE_BG.container.light },
      },
      {
        color: 'surface',
        type: 'border',
        index: { dark: SURFACE_BORDER.base.dark, light: SURFACE_BORDER.base.light },
      },
    ],
    extraClass: ['border'],
  },
  filled: {
    entries: [
      {
        type: 'bg',
        index: { dark: COLOR_BG.solid.dark, light: COLOR_BG.solid.light },
      },
      {
        type: 'border',
        index: { dark: COLOR_BG.solid.dark, light: COLOR_BG.solid.light },
      },
      {
        type: 'text',
        index: 0,
      },
    ],
  },
  light: {
    entries: [
      {
        type: 'bg',
        index: { dark: COLOR_BG.solid.dark, light: COLOR_BG.solid.light },
        alpha: OPACITY_SCALE.dark.tint,
      },
      {
        type: 'text',
        index: { dark: COLOR_TEXT.solid.dark, light: COLOR_TEXT.solid.light },
      },
      {
        type: 'border',
        index: { dark: COLOR_BG.solid.dark, light: COLOR_BG.solid.light },
        alpha: 0,
      },
    ],
  },
  outline: {
    entries: [
      {
        type: 'bg',
        index: { dark: COLOR_BG.solid.dark, light: COLOR_BG.solid.light },
        alpha: 0,
      },
      {
        type: 'border',
        index: { dark: COLOR_BG.solid.dark, light: COLOR_BG.solid.light },
      },
      {
        type: 'text',
        index: { dark: COLOR_TEXT.solid.dark, light: COLOR_TEXT.solid.light },
      },
    ],
    extraClass: ['border'],
  },
  inverted: {
    entries: [
      {
        color: 'surface',
        type: 'bg',
        index: { dark: SURFACE_BG.inverted.dark, light: SURFACE_BG.inverted.light },
      },
      {
        color: 'surface',
        type: 'border',
        index: { dark: SURFACE_BORDER.inverted.dark, light: SURFACE_BORDER.inverted.light },
      },
      {
        color: 'surface',
        type: 'text',
        index: { dark: SURFACE_TEXT.inverted.dark, light: SURFACE_TEXT.inverted.light },
      },
    ],
    extraClass: ['border'],
  },
}

const indicatorRecipe: ContainerCSRecipe = {
  entries: [
    {
      type: 'bg',
      index: { dark: COLOR_BG.solid.dark, light: COLOR_BG.solid.light },
    },
    {
      color: 'surface',
      type: 'border',
      index: { dark: SURFACE_BG.base.dark, light: SURFACE_BG.base.light },
    },
    {
      type: 'text',
      index: 0,
    },
  ],
}

export function useContainerCS(variant: MaybeRef<ContainerVariant>, color: MaybeRef<Color>) {
  const defaultCS = useContainerDefaultCS()
  const filledCS = useContainerFilledCS(color)
  const lightCS = useContainerLightCS(color)
  const outlineCS = useContainerOutlineCS(color)
  const invertedCS = useContainerInvertedCS()
  return computed(() => {
    switch (unref(variant)) {
      case 'filled': {
        return filledCS.value
      }
      case 'light': {
        return lightCS.value
      }
      case 'outline': {
        return outlineCS.value
      }
      case 'inverted': {
        return invertedCS.value
      }
      default: {
        return defaultCS.value
      }
    }
  })
}

export function useContainerDefaultCS() {
  return resolveContainerRecipe(containerRecipes.default)
}

export function useContainerDefaultVariantCS() {
  return computed(() => {
    const bgCS = useCS({
      color: 'surface',
      type: 'bg',
      index: { dark: SURFACE_BG.containerHover.dark, light: SURFACE_BG.containerHover.light },
    })
    const borderCS = useCS({
      color: 'surface',
      type: 'border',
      index: { dark: SURFACE_BORDER.subtle.dark, light: SURFACE_BORDER.subtle.light },
    })
    return useMergedCS([bgCS, borderCS]).value
  })
}

export function useIndicatorFilledCS(color: MaybeRef<Color>) {
  return resolveContainerRecipe(indicatorRecipe, color)
}

export function useContainerFilledCS(color: MaybeRef<Color>) {
  return resolveContainerRecipe(containerRecipes.filled, color)
}

export function useContainerLightCS(color: MaybeRef<Color>) {
  return resolveContainerRecipe(containerRecipes.light, color)
}

export function useContainerOutlineCS(color: MaybeRef<Color>) {
  return resolveContainerRecipe(containerRecipes.outline, color)
}

export function useContainerInvertedCS() {
  return resolveContainerRecipe(containerRecipes.inverted)
}
