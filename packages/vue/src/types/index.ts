export type BtnVariant = 'filled' | 'default' | 'light' | 'outline' | 'subtle' | 'transparent' | 'contrast' | 'white'
export type ContainerVariant = 'filled' | 'default' | 'light' | 'outline' | 'white'
export type InputVariant = 'default' | 'filled'
export type CalendarMode = 'single' | 'multiple' | 'range'
export type DefinedColor = 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'info' | 'warning'
export type Color = DefinedColor | string
export type Size = 'sm' | 'md' | 'lg'
export type Rounded = 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
export interface Area {
  left: number
  top: number
  right: number
  bottom: number
}
