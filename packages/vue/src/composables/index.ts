import type { ThemeData } from './../utils'

export function useTheme() {
  const theme = inject<ThemeData>('theme')
  return theme
}
