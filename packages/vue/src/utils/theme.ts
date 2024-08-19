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
  primary: ColorsTuple
  secondary: ColorsTuple
  tertiary: ColorsTuple
  error: ColorsTuple
  surface: ColorsTuple
}

export interface ThemeData {
  name: string
  colors: ThemeColorsColors
}
