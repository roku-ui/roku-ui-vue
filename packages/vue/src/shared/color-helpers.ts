import type { Color as CuloriColor } from 'culori'
import { formatHex, formatHex8 } from 'culori'

/**
 * Safely format a Culori color to hex; returns fallback when color is undefined
 */
export function safeHex(c: CuloriColor | undefined, fallback = '#000000'): string {
  if (!c) {
 return fallback
}
  return formatHex(c) || fallback
}

/**
 * Safely format a Culori color with alpha override to hex8; returns fallback when color is undefined
 */
export function safeHex8(c: CuloriColor | undefined, alpha: number, fallback = '#00000000'): string {
  if (!c) {
 return fallback
}
  return formatHex8({ ...c, alpha }) || fallback
}
