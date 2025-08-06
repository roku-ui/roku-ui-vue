import type { MaybeRef } from 'vue'
import type { Color, ContainerVariant } from '@/types'
import { computed, unref } from 'vue'
import { useCS, useMergedCS } from './color-system'
import {
  darkBorderIndex,
  darkSurfaceBgIndex,
  lightBorderIndex,
  lightSurfaceBgIndex,
} from './constants'

export function useContainerCS(variant: MaybeRef<ContainerVariant>, color: MaybeRef<Color>) {
  return computed(() => {
    switch (unref(variant)) {
      case 'filled': {
        return useContainerFilledCS(color).value
      }
      case 'light': {
        return useContainerLightCS(color).value
      }
      default: {
        return useContainerDefaultCS().value
      }
    }
  })
}

export function useContainerDefaultCS() {
  return computed(() => {
    const bgCS = useCS({
      color: 'surface',
      type: 'bg',
      index: { dark: darkSurfaceBgIndex, light: lightSurfaceBgIndex },
    })
    const borderCS = useCS({
      color: 'surface',
      type: 'border',
      index: { dark: darkBorderIndex, light: lightBorderIndex },
    })
    const cs = useMergedCS(bgCS, borderCS)
    cs.value.class = [...cs.value.class, 'border']
    return cs.value
  })
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
    return useMergedCS(bgCS, borderCS).value
  })
}

export function useIndicatorFilledCS(color: MaybeRef<Color>) {
  return computed(() => {
    const bgCS = useCS({
      color,
      type: 'bg',
      index: { dark: 5, light: 4 },
    })
    const borderCS = useCS({
      color: 'surface',
      type: 'border',
      index: { dark: darkSurfaceBgIndex, light: lightSurfaceBgIndex },
    })
    const textCS = useCS({
      color,
      type: 'text',
      index: 0,
    })
    return useMergedCS(bgCS, borderCS, textCS).value
  })
}

export function useContainerFilledCS(color: MaybeRef<Color>) {
  return computed(() => {
    const bgCS = useCS({
      color,
      type: 'bg',
      index: { dark: 5, light: 4 },
    })
    const borderCS = useCS({
      color,
      type: 'border',
      index: { dark: 5, light: 4 },
    })
    const textCS = useCS({
      color,
      type: 'text',
      index: 0,
    })
    return useMergedCS(bgCS, borderCS, textCS).value
  })
}

export function useContainerLightCS(color: MaybeRef<Color>) {
  return computed(() => {
    const bgCS = useCS({
      color,
      type: 'bg',
      index: { dark: 5, light: 4 },
      alpha: 0.15,
    })
    const textCS = useCS({
      color,
      type: 'text',
      index: { dark: 3, light: 6 },
    })
    const borderCS = useCS({
      color,
      type: 'border',
      index: { dark: 5, light: 4 },
      alpha: 0,
    })
    return useMergedCS(bgCS, textCS, borderCS).value
  })
}
