import type { MaybeRef } from 'vue'
import type { CSIndex, CSType } from './color-system'
import type { Color, ContainerVariant } from '@/types'
import { computed, unref } from 'vue'
import { useCS, useMergedCS } from './color-system'
import {
  darkBgIndex,
  darkBorderIndex,
  darkSurfaceBgIndex,
  darkSurfaceBgVariant1Index,
  darkTextIndex,
  lightBgIndex,
  lightBorderIndex,
  lightSurfaceBgIndex,
  lightTextIndex,
} from './constants'

interface ContainerCSRecipeEntry {
  colorSource: 'surface' | 'variant'
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
    if (entry.colorSource === 'variant') {
      if (!variantColor) {
        throw new Error('Container recipe requires a color source')
      }
      return useCS({
        color: variantColor,
        type: entry.type,
        index: entry.index,
        alpha: entry.alpha,
      })
    }
    return useCS({
      color: 'surface',
      type: entry.type,
      index: entry.index,
      alpha: entry.alpha,
    })
  })
  return useMergedCS(csList, recipe.extraClass ?? [])
}

const containerRecipes: Record<'default' | 'filled' | 'light', ContainerCSRecipe> = {
  default: {
    entries: [
      {
        colorSource: 'surface',
        type: 'bg',
        index: { dark: darkSurfaceBgVariant1Index, light: lightSurfaceBgIndex },
      },
      {
        colorSource: 'surface',
        type: 'border',
        index: { dark: darkBorderIndex, light: lightBorderIndex },
      },
    ],
    extraClass: ['border'],
  },
  filled: {
    entries: [
      {
        colorSource: 'variant',
        type: 'bg',
        index: { dark: darkBgIndex, light: lightBgIndex },
      },
      {
        colorSource: 'variant',
        type: 'border',
        index: { dark: darkBgIndex, light: lightBgIndex },
      },
      {
        colorSource: 'variant',
        type: 'text',
        index: 0,
      },
    ],
  },
  light: {
    entries: [
      {
        colorSource: 'variant',
        type: 'bg',
        index: { dark: darkBgIndex, light: lightBgIndex },
        alpha: 0.15,
      },
      {
        colorSource: 'variant',
        type: 'text',
        index: { dark: darkTextIndex, light: lightTextIndex },
      },
      {
        colorSource: 'variant',
        type: 'border',
        index: { dark: darkBgIndex, light: lightBgIndex },
        alpha: 0,
      },
    ],
  },
}

const indicatorRecipe: ContainerCSRecipe = {
  entries: [
    {
      colorSource: 'variant',
      type: 'bg',
      index: { dark: darkBgIndex, light: lightBgIndex },
    },
    {
      colorSource: 'surface',
      type: 'border',
      index: { dark: darkSurfaceBgIndex, light: lightSurfaceBgIndex },
    },
    {
      colorSource: 'variant',
      type: 'text',
      index: 0,
    },
  ],
}

export function useContainerCS(variant: MaybeRef<ContainerVariant>, color: MaybeRef<Color>) {
  const defaultCS = useContainerDefaultCS()
  const filledCS = useContainerFilledCS(color)
  const lightCS = useContainerLightCS(color)
  return computed(() => {
    switch (unref(variant)) {
      case 'filled': {
        return filledCS.value
      }
      case 'light': {
        return lightCS.value
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
      index: { dark: 7, light: 2 },
    })
    const borderCS = useCS({
      color: 'surface',
      type: 'border',
      index: { dark: 6, light: 4 },
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
