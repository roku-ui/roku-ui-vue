export const SURFACE_BG = {
  base: { dark: 9, light: 0 },
  container: { dark: 8, light: 0 },
  containerHover: { dark: 7, light: 1 },
  inverted: { dark: 1, light: 9 },
} as const

export const SURFACE_BORDER = {
  base: { dark: 7, light: 3 },
  subtle: { dark: 6, light: 4 },
  inverted: { dark: 2, light: 7 },
} as const

export const SURFACE_TEXT = {
  muted: { dark: 6, light: 5 },
  inverted: { dark: SURFACE_BG.base.dark, light: SURFACE_BG.base.light },
} as const

export const COLOR_BG = {
  solid: { dark: 7, light: 6 },
  hover: { dark: 6, light: 5 },
} as const

export const COLOR_BORDER = {
  solid: { dark: 7, light: 3 },
} as const

export const COLOR_TEXT = {
  solid: { dark: 4, light: 6 },
  hover: { dark: 2, light: 5 },
} as const

export const COLOR_TINT_INDEX = 3

export const OPACITY_SCALE = {
  dark: { tint: 0.15, tintHover: 0.3 },
  light: { tint: 0.1, tintHover: 0.15 },
} as const
