export interface BaseVariant {
  light: string
  base: string
  dark: string
}
export interface BaseColorSet {
  container: BaseVariant
  on: BaseVariant
  outline: BaseVariant
}

export interface SurfaceVariant {
  light: string
  base: string
  dark: string
}

export interface SurfaceColorSet {
  container: SurfaceVariant
  on: BaseVariant
  outline: BaseVariant
}

export interface ThemeColorsColors {
  primary: string[]
  secondary: string[]
  tertiary: string[]
  error: string[]
  surface: string[]
}

export interface ThemeData {
  name: string
  theme: 'light' | 'dark'
  colors: ThemeColorsColors
}

export const themeColors: ThemeColorsColors = {
  primary: ['#e1f9ff', '#ccedff', '#9ad7ff', '#64c1ff', '#3baefe', '#20a2fe', '#099cff', '#0088e4', '#0078cd', '#0069b6', '#082f49'],
  secondary: ['#e9fbf0', '#dcf1e3', '#badfc7', '#96cea9', '#77bf90', '#63b580', '#58b077', '#479a64', '#3b8a58', '#2c7749', '#022c22'],
  tertiary: ['#fff7e1', '#ffedcd', '#fcd99e', '#f9c46b', '#f7b23f', '#f6a724', '#f5a113', '#da8c04', '#c37d00', '#aa6a00', '#572508'],
  error: ['#ffeaea', '#fcd5d5', '#f2a8a9', '#ea7a7a', '#e25353', '#de3939', '#dd2b2b', '#c41e1f', '#af171a', '#9a0913', '#450a0a'],
  surface: ['#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040', '#262626', '#171717', '#0a0a0a'],
}
export const darkTheme: ThemeData = {
  name: 'dark',
  theme: 'dark',
  colors: themeColors,
}

export const lightTheme: ThemeData = {
  name: 'light',
  theme: 'light',
  colors: themeColors,
}
