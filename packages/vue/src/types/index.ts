import type { Component } from 'vue'

export type ContainerVariant = 'filled' | 'default' | 'light' | 'outline' | 'inverted'
export type BtnVariant = ContainerVariant | 'subtle' | 'transparent' | 'contrast' | 'tonal'
export type InputVariant = 'default' | 'filled'
export type CalendarMode = 'single' | 'multiple' | 'range'
export type DefinedColor = 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'info' | 'warning'
export type Color = DefinedColor | string
export type Size = 'sm' | 'md' | 'lg'
export type Rounded = 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
export type CornerShape = 'round' | 'angle' | 'scoop' | 'notch' | 'bevel' | 'squircle' | string
export type IconSource = string | Component
export interface Area {
  left: number
  top: number
  right: number
  bottom: number
}

export interface TreeListLeafData {
  icon?: IconSource
  title: string
  value: string
  attrs?: Record<string, any>
  is?: string | Component
}

export interface TreeListHeaderData {
  icon?: IconSource
  title: string
}

export interface TreeListCollapseData {
  title: string
  icon?: IconSource
  value?: string
  children?: TreeListItemData[]
  open?: boolean
}

export type TreeListItemData = TreeListLeafData | TreeListHeaderData | TreeListCollapseData
