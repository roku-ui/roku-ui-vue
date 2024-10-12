import type { ColorsTuple } from '.'

export interface BaseVariant {
  light: string
  base: string
  dark: string
}

export interface SurfaceVariant {
  light: string
  base: string
  dark: string
}

export interface ThemeColorsColors {
  primary: ColorsTuple | string
  secondary: ColorsTuple | string
  tertiary: ColorsTuple | string
  error: ColorsTuple | string
  surface: ColorsTuple | string
}

export interface ThemeData {
  name: string
  colors: ThemeColorsColors
}
