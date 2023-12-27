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
  theme: 'light' | 'dark'
  colors: ThemeColorsColors
}

export const themeColors: ThemeColorsColors = {
  primary: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#082f49'],
  secondary: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#059669', '#047857', '#065f46', '#064e3b', '#033d2f'],
  tertiary: ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#572508'],
  error: ['#fff5f5', '#fed7d7', '#feb2b2', '#fc8181', '#f56565', '#e53e3e', '#9b2c2c', '#7c1d1d', '#6b1616', '#581414', '#450a0a'],
  surface: ['#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040', '#262626', '#171717', '#0a0a0a'],
}
export const darkTheme: ThemeData = {
  theme: 'dark',
  colors: themeColors,
}
