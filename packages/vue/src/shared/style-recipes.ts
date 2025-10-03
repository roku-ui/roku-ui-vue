import type { Color as CuloriColor } from 'culori'
import { safeHex, safeHex8 } from './color-helpers'

export type PaletteSource = 'color' | 'surface'

export interface PaletteCollection {
  color: CuloriColor[]
  surface: CuloriColor[]
}

interface PaletteTokenConfig {
  source: PaletteSource
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
    if (entry.source === 'literal') {
      style[token] = entry.value
      continue
    }
    const palette = palettes[entry.source]
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
