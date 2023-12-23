export interface BaseVariant {
  base: string
  variant: string
}
export interface BaseColorSet {
  container: BaseVariant
  on: BaseVariant
  outline: BaseVariant
}

export interface SurfaceVariant {
  low: string
  base: string
  high: string
}

export interface SurfaceColorSet {
  container: SurfaceVariant
  on: BaseVariant
  outline: BaseVariant
}

export interface ThemeData {
  primary: BaseColorSet
  secondary: BaseColorSet
  tertiary: BaseColorSet
  error: BaseColorSet
  surface: SurfaceColorSet
}

export const darkTheme: ThemeData = {
  primary: {
    container: {
      base: '#0284c7',
      variant: '#0369a1',
    },
    on: {
      base: '#f0f9ff',
      variant: '#bae6fd',
    },
    outline: {
      base: '#0369a1',
      variant: '#0284c7',
    },
  },
  secondary: { // green
    container: {
      base: '#059669', // 600
      variant: '#047857', // 800
    },
    on: {
      base: '#f0fdf4', // 50
      variant: '#c6f6d5', // 100
    },
    outline: {
      base: '#047857', // 800
      variant: '#065f46', // 900
    },
  },
  tertiary: { // yellow
    container: {
      base: '#d97706', // 600
      variant: '#9c4221', // 800
    },
    on: {
      base: '#fffbeb', // 50
      variant: '#fcd9bd', // 100
    },
    outline: {
      base: '#9c4221', // 800
      variant: '#7b341e', // 900
    },
  },
  error: {
    container: {
      base: '#9b2c2c', // 600
      variant: '#7c1d1d', // 800
    },
    on: {
      base: '#fff5f5', // 50
      variant: '#fed7d7', // 100
    },
    outline: {
      base: '#7c1d1d', // 800
      variant: '#6b1616', // 900
    },
  },
  surface: {
    container: {
      low: '#09090b',
      base: '#18181b',
      high: '#27272a',
    },
    on: {
      base: '#e4e4e7',
      variant: '#a1a1aa',
    },
    outline: {
      base: '#3f3f46',
      variant: '#52525b',
    },
  },
}
