import type { ComputedRef } from 'vue'
import type { Color, CornerShape, Rounded, Size } from '@/types'
import { computed, inject, provide } from 'vue'

export type ThemeColorValue = string | readonly [string, ...string[]]

export interface ThemeColors {
  primary?: ThemeColorValue
  secondary?: ThemeColorValue
  tertiary?: ThemeColorValue
  success?: ThemeColorValue
  info?: ThemeColorValue
  warning?: ThemeColorValue
  error?: ThemeColorValue
  surface?: ThemeColorValue
}

export interface ComponentDefaults {
  Btn?: {
    size?: Size
    variant?: import('@/types').BtnVariant
    color?: string
    rounded?: Rounded
    pressEffect?: 'translate' | 'scale'
  }
  Icon?: {
    size?: Size
    variant?: import('@/types').BtnVariant
    color?: Color
    rounded?: Rounded
    outlineColor?: Color
  }
  TextField?: {
    size?: Size
    color?: Color
    rounded?: Rounded
  }
  Switch?: {
    size?: Size
    color?: Color
  }
  Select?: {
    size?: Size
    color?: Color
    rounded?: Rounded
  }
  Checkbox?: {
    size?: Size
    color?: Color
    rounded?: Rounded
  }
  Paper?: {
    variant?: import('@/types').ContainerVariant
    color?: Color
    rounded?: Rounded
  }
  Progress?: {
    size?: Size
    color?: Color
  }
  Rating?: {
    size?: Size
    color?: Color
  }
  Slider?: {
    size?: Size
    color?: Color
  }
  Avatar?: {
    size?: Size
    color?: Color
    rounded?: Rounded
    cornerShape?: CornerShape
  }
  Tag?: {
    size?: Size
    variant?: import('@/types').ContainerVariant
    color?: string
    rounded?: Rounded
  }
  Chip?: {
    size?: Size
    variant?: import('@/types').ContainerVariant
    color?: string
    rounded?: Rounded
  }
  Modal?: {
    size?: Size
    rounded?: Rounded
  }
  Drawer?: {
    size?: Size
  }
  Notification?: {
    color?: Color
    rounded?: Rounded
  }
  ColorInput?: {
    size?: Size
    rounded?: Rounded
  }
  CalendarInput?: {
    size?: Size
    rounded?: Rounded
  }
  PinInput?: {
    size?: Size
    rounded?: Rounded
  }
  Dropzone?: {
    rounded?: Rounded
  }
  Step?: {
    size?: Size
    color?: Color
    direction?: 'horizontal' | 'vertical'
    type?: 'default' | 'navigation' | 'dot' | 'simple'
  }
}

export interface ThemeData {
  withBorder: boolean
  rounded: Rounded
  colors: ThemeColors
  defaultSize: Size
  defaultColor: Color
  componentDefaults?: ComponentDefaults
}

export const defaultThemeData: ThemeData = {
  withBorder: true,
  rounded: 'md' as Rounded,
  defaultSize: 'md',
  defaultColor: 'primary',
  colors: {
    primary: '#2c9be6ff',
    secondary: '#10c3e7ff',
    tertiary: '#e03ba9ff',
    success: '#00dc82',
    info: '#3AAFF5',
    warning: '#F5A623',
    error: '#F95858',
    surface: '#121212',
  },
  componentDefaults: {},
}

export const symbolStyle = Symbol('defaultStyles')

export function useTheme() {
  const computedThemeData = computed(() => {
    return defaultThemeData
  })
  return inject<ComputedRef<ThemeData>>(symbolStyle, computedThemeData)
}

export function provideTheme(theme: ComputedRef<ThemeData>) {
  return provide<ComputedRef<ThemeData>>(symbolStyle, theme)
}

export function getThemeColorString(colorKey: keyof ThemeColors): string {
  const theme = useTheme()
  const fallback = resolveThemeColor(defaultThemeData.colors[colorKey]) || '#000000'
  if (!theme || !theme.value.colors) {
    return fallback
  }
  return resolveThemeColor(theme.value.colors[colorKey]) || fallback
}

function resolveThemeColor(color: ThemeColorValue | undefined): string | undefined {
  if (!color) {
    return undefined
  }
  if (typeof color === 'string') {
    return color
  }
  if (Array.isArray(color) && color.length > 0) {
    const midIndex = Math.floor(color.length / 2)
    return color[midIndex] ?? color[0]
  }
  return undefined
}

export function useComponentDefaults<K extends keyof ComponentDefaults>(componentName: K): ComponentDefaults[K] {
  const theme = useTheme()
  return theme?.value.componentDefaults?.[componentName] || {}
}

export function getComponentDefault<K extends keyof ComponentDefaults>(
  componentName: K,
  propName: string,
  fallback?: any,
): any {
  const theme = useTheme()
  const componentDefaults = theme?.value.componentDefaults?.[componentName] as any
  return componentDefaults?.[propName] ?? fallback
}
