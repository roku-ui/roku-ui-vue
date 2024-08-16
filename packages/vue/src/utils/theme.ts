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

export const primaryColor = ref('#3F9CDC')
export const secondaryColor = ref('#5999A6')
export const tertiaryColor = ref('#F76C22')
export const errorColor = ref('#F95858')
export const surfaceColor = ref('#121212')

export const defaultTheme = useThemeData('default', {
  primary: primaryColor,
  secondary: secondaryColor,
  tertiary: tertiaryColor,
  error: errorColor,
  surface: surfaceColor,
})
