import type { Color as CuloriColor } from 'culori'
import { formatCss, formatHex, hsl, oklch, rgb } from 'culori'
import { COLOR_LIGHTNESS_MAP } from '..'

// Type alias for better compatibility
type ColorInput = string | CuloriColor

export * from './classGenerator'
export * from './notifications'
export * from './symbols'

function getClosestLightness(color: ColorInput) {
  const hslColor = hsl(color)
  if (!hslColor) {
    return COLOR_LIGHTNESS_MAP[0]
  }

  const lightnessGoal = hslColor.l
  let closest = COLOR_LIGHTNESS_MAP[0]
  for (const curr of COLOR_LIGHTNESS_MAP) {
    if (Math.abs(curr - lightnessGoal) < Math.abs(closest - lightnessGoal)) {
      closest = curr
    }
  }
  return closest
}

export function generateColorsMap(color: ColorInput, lightnessMap = COLOR_LIGHTNESS_MAP) {
  const objMap = generateColorsObjMap(color, lightnessMap)
  return { ...objMap, colors: objMap.colors.map(c => formatHex(c) || '#000000') }
}

// Advanced color generation strategy options
export interface ColorGenerationOptions {
  strategy?: 'conservative' | 'balanced' | 'vibrant'
  contrastTarget?: 'AA' | 'AAA' | 'none'
  gamut?: 'srgb' | 'p3' | 'rec2020'
  customChromaCurve?: (lightness: number) => number
}

// Enhanced OKLCH-based color generation with advanced algorithms
export function generateColorsObjMapOKLCH(
  color: ColorInput,
  lightnessMap = COLOR_LIGHTNESS_MAP,
  options: ColorGenerationOptions = {},
) {
  const { strategy = 'balanced', gamut = 'srgb' } = options

  const baseOklch = oklch(color)
  if (!baseOklch) {
    return { baseColorIndex: 0, colors: [] }
  }

  const closestLightness = getClosestLightness(color)
  const baseColorIndex = lightnessMap.indexOf(closestLightness)

  const colors = lightnessMap.map((lightness) => {
    const adjustedChroma = calculateOptimalChroma(
      baseOklch.c || 0,
      lightness,
      baseOklch.h || 0,
      strategy,
      options.customChromaCurve,
    )

    // Create new OKLCH color with optimized values
    const newOklch = {
      mode: 'oklch' as const,
      l: lightness,
      c: Math.max(0, adjustedChroma),
      h: baseOklch.h,
      alpha: baseOklch.alpha,
    }

    // Apply gamut constraints if needed
    return applyGamutConstraints(newOklch, gamut)
  })

  return { baseColorIndex, colors }
}

// Calculate optimal chroma using scientific perceptual curves
function calculateOptimalChroma(
  baseChroma: number,
  lightness: number,
  hue: number,
  strategy: 'conservative' | 'balanced' | 'vibrant',
  customCurve?: (lightness: number) => number,
): number {
  if (customCurve) {
    return baseChroma * customCurve(lightness)
  }

  // Use perceptually uniform chroma curve based on human vision research
  const chromaMultiplier = getPerceptualChromaMultiplier(lightness, strategy)

  // Apply hue-specific adjustments (some hues appear more saturated than others)
  const hueAdjustment = getHueSpecificChromaAdjustment(hue)

  return baseChroma * chromaMultiplier * hueAdjustment
}

// Scientific chroma curve based on human visual perception
function getPerceptualChromaMultiplier(lightness: number, strategy: 'conservative' | 'balanced' | 'vibrant'): number {
  // Base curve using a modified sine wave that follows human perception
  // Peak chroma perception occurs around L=0.6-0.7
  const baseCurve = Math.sin(lightness * Math.PI) * 0.7 + 0.3

  switch (strategy) {
    case 'conservative': {
      // More muted colors, reduce chroma in extreme ranges
      return baseCurve * (0.6 + 0.4 * baseCurve)
    }

    case 'vibrant': {
      // More saturated colors, boost chroma in mid-range
      return Math.min(1.2, baseCurve * (1.1 + 0.3 * Math.sin(lightness * Math.PI * 2)))
    }

    case 'balanced': {
      // Balanced approach with smooth transitions
      return baseCurve * (0.8 + 0.3 * (1 - Math.abs(lightness - 0.6) * 2))
    }

    default: {
      // Default to balanced strategy
      return baseCurve * (0.8 + 0.3 * (1 - Math.abs(lightness - 0.6) * 2))
    }
  }
}

// Adjust chroma based on hue characteristics
function getHueSpecificChromaAdjustment(hue: number): number {
  if (hue === undefined) {
 return 1
}

  // Some hues (like yellow) appear more saturated than others (like blue/purple)
  // This adjustment compensates for perceptual differences
  const hueRad = (hue * Math.PI) / 180

  // Yellow (60°) and red (0°/360°) appear more saturated
  // Blue (240°) and purple (270°) appear less saturated
  const yellowBoost = Math.cos(hueRad - Math.PI / 3) * 0.1 + 1 // Peak at 60°
  const redBoost = Math.cos(hueRad) * 0.05 + 1 // Peak at 0°/360°
  const blueReduction = Math.cos(hueRad - 4 * Math.PI / 3) * -0.1 + 1 // Dip at 240°

  return Math.max(0.7, Math.min(1.3, yellowBoost * redBoost * blueReduction))
}

// Enhanced gamut validation and color correction
export interface GamutInfo {
  name: 'srgb' | 'p3' | 'rec2020'
  rgbLimits: { min: number, max: number }
  description: string
}

export const GAMUT_DEFINITIONS: Record<string, GamutInfo> = {
  srgb: {
    name: 'srgb',
    rgbLimits: { min: 0, max: 1 },
    description: 'Standard RGB color space (most displays)',
  },
  p3: {
    name: 'p3',
    rgbLimits: { min: 0, max: 1 },
    description: 'Display P3 color space (modern displays)',
  },
  rec2020: {
    name: 'rec2020',
    rgbLimits: { min: 0, max: 1 },
    description: 'Rec. 2020 color space (HDR displays)',
  },
}

// Check if a color is within the specified gamut
export function isColorInGamut(color: any, gamut: 'srgb' | 'p3' | 'rec2020'): boolean {
  const rgbColor = rgb(color)
  if (!rgbColor || !('r' in rgbColor)) {
 return false
}

  const { r, g, b } = rgbColor
  const { min, max } = GAMUT_DEFINITIONS[gamut].rgbLimits

  return r >= min && r <= max && g >= min && g <= max && b >= min && b <= max
}

// Get the maximum chroma for a given lightness and hue within a gamut
function getMaxChromaForGamut(
  lightness: number,
  hue: number,
  gamut: 'srgb' | 'p3' | 'rec2020',
): number {
  let maxChroma = 0

  // Binary search for maximum chroma
  let low = 0
  let high = 0.4 // Maximum reasonable chroma
  let iterations = 0

  while (high - low > 0.001 && iterations < 50) {
    const midChroma = (low + high) / 2
    const testColor = {
      mode: 'oklch' as const,
      l: lightness,
      c: midChroma,
      h: hue,
    }

    if (isColorInGamut(testColor, gamut)) {
      low = midChroma
      maxChroma = midChroma
    }
 else {
      high = midChroma
    }

    iterations++
  }

  return maxChroma
}

// Apply gamut constraints to prevent out-of-gamut colors
function applyGamutConstraints(oklchColor: any, gamut: 'srgb' | 'p3' | 'rec2020'): any {
  if (isColorInGamut(oklchColor, gamut)) {
    return oklchColor // Color is already within gamut
  }

  // Find the maximum chroma for this lightness and hue
  const maxChroma = getMaxChromaForGamut(
    oklchColor.l || 0,
    oklchColor.h || 0,
    gamut,
  )

  // Clamp chroma to the maximum allowed
  return {
    ...oklchColor,
    c: Math.min(oklchColor.c || 0, maxChroma),
  }
}

// Validate and provide information about color gamut coverage
export function analyzeColorGamut(colors: any[]): {
  srgbCoverage: number
  p3Coverage: number
  rec2020Coverage: number
  outOfGamutColors: { index: number, gamuts: string[] }[]
} {
  const results = {
    srgbCoverage: 0,
    p3Coverage: 0,
    rec2020Coverage: 0,
    outOfGamutColors: [] as { index: number, gamuts: string[] }[],
  }

  for (const [index, color] of colors.entries()) {
    const inSrgb = isColorInGamut(color, 'srgb')
    const inP3 = isColorInGamut(color, 'p3')
    const inRec2020 = isColorInGamut(color, 'rec2020')

    if (inSrgb) {
 results.srgbCoverage++
}
    if (inP3) {
 results.p3Coverage++
}
    if (inRec2020) {
 results.rec2020Coverage++
}

    const outOfGamuts: string[] = []
    if (!inSrgb) {
 outOfGamuts.push('srgb')
}
    if (!inP3) {
 outOfGamuts.push('p3')
}
    if (!inRec2020) {
 outOfGamuts.push('rec2020')
}

    if (outOfGamuts.length > 0) {
      results.outOfGamutColors.push({ index, gamuts: outOfGamuts })
    }
  }

  // Convert to percentages
  const total = colors.length
  results.srgbCoverage = (results.srgbCoverage / total) * 100
  results.p3Coverage = (results.p3Coverage / total) * 100
  results.rec2020Coverage = (results.rec2020Coverage / total) * 100

  return results
}

// Convert to linear RGB (moved to outer scope for performance)
function linearize(c: number): number {
  const normalized = c
  return normalized <= 0.039_28 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
}

// WCAG contrast ratio calculation using relative luminance
function getRelativeLuminance(color: any): number {
  const rgbColor = rgb(color)
  if (!rgbColor || !('r' in rgbColor)) {
 return 0
}

  const { r, g, b } = rgbColor

  const rLinear = linearize(r)
  const gLinear = linearize(g)
  const bLinear = linearize(b)

  // Calculate relative luminance using WCAG formula
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
}

function calculateContrastRatio(color1: any, color2: any): number {
  const lum1 = getRelativeLuminance(color1)
  const lum2 = getRelativeLuminance(color2)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

// Enhanced color generation with contrast awareness
export function generateContrastAwareColors(
  color: ColorInput,
  backgroundLightness = 0.95, // Default to light background
  options: ColorGenerationOptions = {},
): ColorsTuple {
  const { contrastTarget = 'AA' } = options
  const minContrast = contrastTarget === 'AAA' ? 7 : (contrastTarget === 'AA' ? 4.5 : 0)

  if (contrastTarget === 'none') {
    return generateColorsOKLCH(color, COLOR_LIGHTNESS_MAP, options)
  }

  const baseOklch = oklch(color)
  if (!baseOklch) {
    return generateColorsOKLCH(color, COLOR_LIGHTNESS_MAP, options)
  }

  // Create background color for contrast calculation
  const backgroundColor = {
    mode: 'oklch' as const,
    l: backgroundLightness,
    c: 0, // Gray background for neutral contrast testing
    h: 0,
  }

  const adjustedLightnessMap = COLOR_LIGHTNESS_MAP.map((lightness) => {
    const testColor = {
      mode: 'oklch' as const,
      l: lightness,
      c: baseOklch.c || 0,
      h: baseOklch.h,
      alpha: baseOklch.alpha,
    }

    const contrast = calculateContrastRatio(testColor, backgroundColor)

    // If contrast is insufficient, adjust lightness
    if (contrast < minContrast) {
      // Determine if we should make it lighter or darker
      const shouldDarken = backgroundLightness > 0.5

      let adjustedLightness = lightness
      let iterations = 0
      const maxIterations = 20

      while (iterations < maxIterations) {
        const adjustedColor = {
          ...testColor,
          l: adjustedLightness,
        }

        const newContrast = calculateContrastRatio(adjustedColor, backgroundColor)

        if (newContrast >= minContrast) {
          break
        }

        // Adjust lightness towards better contrast
        adjustedLightness = shouldDarken
          ? Math.max(0, adjustedLightness - 0.05)
          : Math.min(1, adjustedLightness + 0.05)

        iterations++
      }

      return Math.max(0, Math.min(1, adjustedLightness))
    }

    return lightness
  })

  return generateColorsOKLCH(color, adjustedLightnessMap, options)
}

// Adaptive lightness mapping based on color characteristics
export function generateAdaptiveLightnessMap(
  color: ColorInput,
  purpose: 'primary' | 'secondary' | 'surface' | 'accent' = 'primary',
): number[] {
  const baseOklch = oklch(color)
  if (!baseOklch) {
    return COLOR_LIGHTNESS_MAP
  }

  const { c: baseChroma, h: baseHue } = baseOklch

  switch (purpose) {
    case 'surface': {
      // Surface colors need more gradual transitions for better hierarchy
      return [
        0.98,
        0.95,
        0.92,
        0.88,
        0.82,
        0.7,
        0.55,
        0.4,
        0.25,
        0.15,
        0.08,
      ]
    }

    case 'accent': {
      // Accent colors can be more vibrant with sharper transitions
      const boost = Math.min(0.15, (baseChroma || 0) * 0.3)
      return COLOR_LIGHTNESS_MAP.map((l) => {
        // Boost mid-range lightness for more pop
        if (l >= 0.3 && l <= 0.7) {
          return Math.min(0.95, l + boost)
        }
        return l
      })
    }

    case 'secondary': {
      // Secondary colors should be more muted
      const reduction = Math.min(0.1, (baseChroma || 0) * 0.2)
      return COLOR_LIGHTNESS_MAP.map((l) => {
        // Slightly reduce extreme values
        if (l > 0.8) {
 return Math.max(0.75, l - reduction)
}
        if (l < 0.2) {
 return Math.min(0.25, l + reduction)
}
        return l
      })
    }

    case 'primary': {
      // Primary colors get hue-specific adjustments
      if (baseHue === undefined) {
 return COLOR_LIGHTNESS_MAP
}

      // Yellow hues (45-75°) need darker variants to maintain readability
      if (baseHue >= 45 && baseHue <= 75) {
        return COLOR_LIGHTNESS_MAP.map((l) => {
          if (l > 0.6) {
 return Math.max(0.5, l - 0.1)
}
          return l
        })
      }

      // Blue hues (200-260°) can handle lighter variants better
      if (baseHue >= 200 && baseHue <= 260) {
        return COLOR_LIGHTNESS_MAP.map((l) => {
          if (l < 0.4) {
 return Math.min(0.5, l + 0.1)
}
          return l
        })
      }

      return COLOR_LIGHTNESS_MAP
    }

    default: {
      return COLOR_LIGHTNESS_MAP
    }
  }
}

// Enhanced color generation with adaptive lightness mapping
export function generateAdaptiveColors(
  color: ColorInput,
  purpose: 'primary' | 'secondary' | 'surface' | 'accent' = 'primary',
  options: ColorGenerationOptions = {},
): ColorsTuple {
  const adaptiveLightnessMap = generateAdaptiveLightnessMap(color, purpose)
  return generateColorsOKLCH(color, adaptiveLightnessMap, options)
}

// Comprehensive color palette generation with full control
export interface AdvancedColorOptions extends ColorGenerationOptions {
  purpose?: 'primary' | 'secondary' | 'surface' | 'accent'
  backgroundLightness?: number
  enableAnalysis?: boolean
  outputFormat?: 'hex' | 'oklch' | 'rgb' | 'hsl' | 'all'
}

export interface ColorPaletteResult {
  colors: ColorsTuple
  baseColorIndex: number
  metadata: {
    strategy: string
    purpose: string
    gamut: string
    contrastTarget: string
    gamutAnalysis?: ReturnType<typeof analyzeColorGamut>
  }
  alternatives?: {
    conservative: ColorsTuple
    balanced: ColorsTuple
    vibrant: ColorsTuple
  }
}

// Master function for advanced color palette generation
export function generateAdvancedColorPalette(
  color: ColorInput,
  options: AdvancedColorOptions = {},
): ColorPaletteResult {
  const {
    purpose = 'primary',
    backgroundLightness = 0.95,
    enableAnalysis = true,
    strategy = 'balanced',
    contrastTarget = 'AA',
    gamut = 'srgb',
    outputFormat: _outputFormat = 'hex',
  } = options

  // Generate the primary palette
  let colors: ColorsTuple
  let objMap: { baseColorIndex: number, colors: any[] }

  if (contrastTarget === 'none') {
    colors = generateAdaptiveColors(color, purpose, options)
    objMap = generateColorsObjMapOKLCH(color, generateAdaptiveLightnessMap(color, purpose), options)
  }
 else {
    colors = generateContrastAwareColors(color, backgroundLightness, options)
    objMap = generateColorsObjMapOKLCH(color, COLOR_LIGHTNESS_MAP, options)
  }

  const result: ColorPaletteResult = {
    colors,
    baseColorIndex: objMap.baseColorIndex,
    metadata: {
      strategy,
      purpose,
      gamut,
      contrastTarget,
    },
  }

  // Add gamut analysis if requested
  if (enableAnalysis) {
    result.metadata.gamutAnalysis = analyzeColorGamut(objMap.colors)
  }

  // Generate alternative strategies if requested
  if (strategy === 'balanced') {
    result.alternatives = {
      conservative: generateAdaptiveColors(color, purpose, { ...options, strategy: 'conservative' }),
      balanced: colors,
      vibrant: generateAdaptiveColors(color, purpose, { ...options, strategy: 'vibrant' }),
    }
  }

  return result
}

// Utility function for quick color palette generation with sensible defaults
export function createColorPalette(
  color: string,
  type: 'primary' | 'secondary' | 'accent' | 'surface' = 'primary',
): ColorsTuple {
  return generateAdvancedColorPalette(color, {
    purpose: type,
    strategy: 'balanced',
    contrastTarget: 'AA',
    gamut: 'srgb',
  }).colors
}

// Export enhanced version of existing functions with new options
export function generateColorsEnhanced(
  color: ColorInput,
  options: AdvancedColorOptions = {},
): ColorsTuple {
  return generateAdvancedColorPalette(color, options).colors
}

// Performance optimization with caching
const colorCache = new Map<string, any>()
const MAX_CACHE_SIZE = 100

function getCacheKey(color: ColorInput, options: any): string {
  const colorStr = typeof color === 'string' ? color : JSON.stringify(color)
  const optionsStr = JSON.stringify(options)
  return `${colorStr}:${optionsStr}`
}

function getCachedResult<T>(key: string, generator: () => T): T {
  if (colorCache.has(key)) {
    return colorCache.get(key)
  }

  const result = generator()

  // Implement LRU cache by removing oldest entries
  if (colorCache.size >= MAX_CACHE_SIZE) {
    const firstKey = colorCache.keys().next().value
    if (firstKey) {
      colorCache.delete(firstKey)
    }
  }

  colorCache.set(key, result)
  return result
}

// Cached version of generateColorsObjMapOKLCH
export function generateColorsObjMapOKLCHCached(
  color: ColorInput,
  lightnessMap = COLOR_LIGHTNESS_MAP,
  options: ColorGenerationOptions = {},
): { baseColorIndex: number, colors: any[] } {
  const cacheKey = getCacheKey(color, { lightnessMap, ...options })

  return getCachedResult(cacheKey, () =>
    generateColorsObjMapOKLCH(color, lightnessMap, options))
}

// Cached version of generateAdvancedColorPalette
export function generateAdvancedColorPaletteCached(
  color: ColorInput,
  options: AdvancedColorOptions = {},
): ColorPaletteResult {
  const cacheKey = getCacheKey(color, options)

  return getCachedResult(cacheKey, () =>
    generateAdvancedColorPalette(color, options))
}

// Performance utilities
export const ColorPalettePerformance = {
  // Clear the cache
  clearCache: () => colorCache.clear(),

  // Get cache statistics
  getCacheStats: () => ({
    size: colorCache.size,
    maxSize: MAX_CACHE_SIZE,
    hitRate: 0, // TODO: Implement hit rate tracking
  }),

  // Precompute common color palettes
  precomputePalettes: (colors: string[]) => {
    const commonOptions = [
      { purpose: 'primary', strategy: 'balanced' },
      { purpose: 'secondary', strategy: 'conservative' },
      { purpose: 'accent', strategy: 'vibrant' },
      { purpose: 'surface', strategy: 'balanced' },
    ] as AdvancedColorOptions[]

    for (const color of colors) {
      for (const options of commonOptions) {
        generateAdvancedColorPaletteCached(color, options)
      }
    }
  },
}

// Keep existing function for backward compatibility
export function generateColorsObjMap(color: ColorInput, lightnessMap = COLOR_LIGHTNESS_MAP) {
  const baseHsl = hsl(color)
  if (!baseHsl) {
    return { baseColorIndex: 0, colors: [] }
  }

  const closestLightness = getClosestLightness(color)
  const baseColorIndex = lightnessMap.indexOf(closestLightness)

  const colors = lightnessMap.map((lightness) => {
    let modifiedColor = {
      mode: 'hsl' as const,
      h: baseHsl.h,
      s: baseHsl.s,
      l: lightness,
      alpha: baseHsl.alpha,
    }

    // Adjust the lightness for some hues (keeping legacy behavior)
    if (baseHsl.h !== undefined && baseHsl.h >= 20 && baseHsl.h <= 200) {
      modifiedColor = {
        ...modifiedColor,
        l: Math.max(0, lightness - 0.02), // darken by 2%
      }
    }

    return modifiedColor
  })

  return { baseColorIndex, colors }
}
export type ColorsTuple = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  ...string[],
]

export function generateColors(color: ColorInput, lightnessMap: number[] = COLOR_LIGHTNESS_MAP) {
  return generateColorsMap(color, lightnessMap).colors as unknown as ColorsTuple
}

// OKLCH version for better color accuracy
export function generateColorsOKLCH(
  color: ColorInput,
  lightnessMap: number[] = COLOR_LIGHTNESS_MAP,
  options?: ColorGenerationOptions,
) {
  const objMap = generateColorsObjMapOKLCH(color, lightnessMap, options)
  return objMap.colors.map(c => formatHex(c) || '#000000') as unknown as ColorsTuple
}

// Helper function to generate OKLCH string for CSS
export function generateOKLCHString(color: ColorInput): string {
  const oklchColor = oklch(color)
  if (!oklchColor) {
    return 'oklch(0 0 0)'
  }

  return formatCss(oklchColor) || 'oklch(0 0 0)'
}

// Generate editor-friendly color variables with actual color values
export function generateEditorFriendlyColors(color: ColorInput, lightnessMap: number[] = COLOR_LIGHTNESS_MAP) {
  const objMap = generateColorsObjMapOKLCH(color, lightnessMap)

  return objMap.colors.map((c, index) => {
    const rgbColor = rgb(c)
    const hex = formatHex(c) || '#000000'
    const oklchString = formatCss(c) || 'oklch(0 0 0)'

    return {
      index,
      hex,
      rgb: (rgbColor && 'r' in rgbColor && 'g' in rgbColor && 'b' in rgbColor)
        ? `${Math.round((rgbColor as any).r * 255)} ${Math.round((rgbColor as any).g * 255)} ${Math.round((rgbColor as any).b * 255)}`
        : '0 0 0',
      oklch: oklchString,
      lightness: lightnessMap[index],
    }
  })
}
