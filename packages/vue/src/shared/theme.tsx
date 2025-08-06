import type { ComputedRef } from 'vue'
import type { Rounded } from '@/types'
import { computed, inject, provide } from 'vue'

export interface ThemeColors {
  primary: string
  secondary: string
  tertiary: string
  error: string
  surface: string
}

export interface ThemeData {
  withBorder: boolean
  rounded: Rounded
  colors: ThemeColors
}

export const defaultThemeData: ThemeData = {
  withBorder: true,
  rounded: 'md' as Rounded,
  colors: {
    primary: '#0067cc',
    secondary: '#5999A6',
    tertiary: '#F76C22',
    error: '#F95858',
    surface: '#121212',
  },
}

export const symbolStyle = Symbol('defaultStyles')

export function useTheme() {
  const computedThemeData = computed(() => {
    return defaultThemeData
  })
  return inject<ComputedRef<ThemeData>>(symbolStyle, computedThemeData)
}

export function provideTheme(theme: ComputedRef<ThemeData>) {
  return provide<ComputedRef<ThemeData>>(symbolStyle, theme)
}

export function getThemeColorString(colorKey: keyof ThemeColors): string {
  const theme = useTheme()
  if (!theme || !theme.value.colors) {
    return defaultThemeData.colors[colorKey]
  }
  return theme.value.colors[colorKey] || defaultThemeData.colors[colorKey]
}
