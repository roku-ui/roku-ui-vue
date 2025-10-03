import type { Color as CuloriColor } from 'culori'
import { safeHex, safeHex8 } from './color-helpers'

export interface PaletteCollection {
  color: CuloriColor[]
  [key: string]: CuloriColor[]
}

interface PaletteTokenConfig {
  palette?: string
  index: number
  format?: 'hex' | 'hex8'
  alpha?: number
  fallback?: string
}

interface LiteralTokenConfig {
  source: 'literal'
  value: string
}

export type VariantTokenConfig = PaletteTokenConfig | LiteralTokenConfig
export type VariantStyleConfig = Record<string, VariantTokenConfig>

export function buildVariantStyles(config: VariantStyleConfig, palettes: PaletteCollection): Record<string, string> {
  const style: Record<string, string> = {}
  for (const [token, entry] of Object.entries(config)) {
    if ('source' in entry) {
      style[token] = entry.value
      continue
    }
    const paletteKey = entry.palette ?? 'color'
    const palette = palettes[paletteKey]
    if (!palette) {
      continue
    }
    const color = palette[entry.index]
    if (entry.format === 'hex8' || entry.alpha !== undefined) {
      const alpha = entry.alpha ?? 1
      const fallback = entry.fallback ?? '#00000000'
      style[token] = safeHex8(color, alpha, fallback)
      continue
    }
    const fallback = entry.fallback ?? '#000000'
    style[token] = safeHex(color, fallback)
  }
  return style
}
