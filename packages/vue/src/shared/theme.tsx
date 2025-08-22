import type { ComputedRef } from 'vue'
import type { Rounded } from '@/types'
import { computed, inject, provide } from 'vue'

export interface ThemeColors {
  primary?: string
  secondary?: string
  tertiary?: string
  error?: string
  surface?: string
}

export interface ComponentDefaults {
  Btn?: {
    size?: 'sm' | 'md' | 'lg'
    variant?: import('@/types').BtnVariant
    color?: string
    rounded?: Rounded
    pressEffect?: 'translate' | 'scale'
  }
  TextField?: {
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
    rounded?: Rounded
  }
  Switch?: {
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
  }
  Select?: {
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
    rounded?: Rounded
  }
  Checkbox?: {
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
    rounded?: Rounded
  }
  Paper?: {
    variant?: import('@/types').ContainerVariant
    color?: string
    rounded?: Rounded
  }
  Progress?: {
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
  }
  Rating?: {
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
  }
  Slider?: {
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
  }
  Avatar?: {
    size?: 'sm' | 'md' | 'lg'
    color?: string
    rounded?: Rounded
  }
  Tag?: {
    size?: 'sm' | 'md' | 'lg'
    variant?: import('@/types').ContainerVariant
    color?: string
    rounded?: Rounded
  }
  Chip?: {
    size?: 'sm' | 'md' | 'lg'
    variant?: import('@/types').ContainerVariant
    color?: string
    rounded?: Rounded
  }
  Modal?: {
    size?: 'sm' | 'md' | 'lg'
    rounded?: Rounded
  }
  Drawer?: {
    size?: 'sm' | 'md' | 'lg'
  }
  Notification?: {
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
    rounded?: Rounded
  }
  ColorInput?: {
    size?: 'sm' | 'md' | 'lg'
    rounded?: Rounded
  }
  CalendarInput?: {
    size?: 'sm' | 'md' | 'lg'
    rounded?: Rounded
  }
  PinInput?: {
    size?: 'sm' | 'md' | 'lg'
    rounded?: Rounded
  }
  Dropzone?: {
    rounded?: Rounded
  }
  Step?: {
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
    direction?: 'horizontal' | 'vertical'
    type?: 'default' | 'navigation' | 'dot' | 'simple'
  }
}

export interface ThemeData {
  withBorder: boolean
  rounded: Rounded
  colors: ThemeColors
  defaultSize: 'sm' | 'md' | 'lg'
  defaultColor: 'primary' | 'secondary' | 'tertiary' | 'error'
  componentDefaults?: ComponentDefaults
}

export const defaultThemeData: ThemeData = {
  withBorder: true,
  rounded: 'md' as Rounded,
  defaultSize: 'md',
  defaultColor: 'primary',
  colors: {
    primary: '#0067cc',
    secondary: '#5999A6',
    tertiary: '#F76C22',
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
  if (!theme || !theme.value.colors) {
    return defaultThemeData.colors[colorKey]!
  }
  return theme.value.colors[colorKey] || defaultThemeData.colors[colorKey]!
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
