import type { MenuData, MenuDividerData, MenuItemData, MenuLabelData } from '@/components/Menu.vue'

export function isDivider(item?: MenuData): item is MenuDividerData {
  return (item as MenuDividerData)?.role === 'divider'
}

export function isLabel(item?: MenuData): item is MenuLabelData {
  return (item as MenuLabelData)?.role === 'label'
}

export function isMenuItem(item?: MenuData): item is MenuItemData {
  if (!item) {
    return false
  }
  return !isDivider(item) && !isLabel(item)
}

export function someHasIcon(data?: MenuData[]): boolean {
  if (data === undefined) {
    return false
  }
  return data.some((d) => {
    if (isMenuItem(d)) {
      return d.icon !== undefined
    }
    return false
  })
}
