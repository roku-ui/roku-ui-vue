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

export const themeColors: ThemeColorsColors = {
  primary: ['#e5f7ff', '#d3ebfa', '#a9d4f1', '#7cbde9', '#57a9e0', '#3f9cdc', '#3096dc', '#1f82c4', '#0f73b0', '#00649c', '#082f49'],
  secondary: ['#e9fbf0', '#dcf1e3', '#badfc7', '#96cea9', '#77bf90', '#63b580', '#58b077', '#479a64', '#3b8a58', '#2c7749', '#022c22'],
  tertiary: ['#fff7e1', '#ffedcd', '#fcd99e', '#f9c46b', '#f7b23f', '#f6a724', '#f5a113', '#da8c04', '#c37d00', '#aa6a00', '#572508'],
  error: ['#ffeaea', '#fcd5d5', '#f2a8a9', '#ea7a7a', '#e25353', '#de3939', '#dd2b2b', '#c41e1f', '#af171a', '#9a0913', '#450a0a'],
  surface: ['#fefefe', '#fafafa', '#f2f2f2', '#e8e8e8', '#c6c6c6', '#737373', '#525252', '#343434', '#262626', '#171717', '#121212'],
}
const primary = ref('#3F9CDC')
const secondary = ref('#5999A6')
const tertiary = ref('#F76C22')
const error = ref('#F95858')
const surface = ref('#121212')

export const defaultTheme = useThemeData('default', {
  primary,
  secondary,
  tertiary,
  error,
  surface,
})
