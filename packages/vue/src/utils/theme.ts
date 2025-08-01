import type { ColorsTuple } from '.'

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
