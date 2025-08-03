import type { ColorInput } from 'tinycolor2'
import tinycolor from 'tinycolor2'
import { COLOR_LIGHTNESS_MAP } from '..'

// OKLCH color space utilities
interface OKLCHColor {
  l: number // lightness 0-1
  c: number // chroma 0-0.4
  h: number // hue 0-360
  a?: number // alpha 0-1
}

// Convert RGB to OKLCH (simplified implementation)
function rgbToOklch(r: number, g: number, b: number): OKLCHColor {
  // Convert RGB to linear RGB
  const toLinear = (x: number) => x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
  const rLinear = toLinear(r / 255)
  const gLinear = toLinear(g / 255)
  const bLinear = toLinear(b / 255)
  
  // Convert to OKLab
  const l = 0.4122214708 * rLinear + 0.5363325363 * gLinear + 0.0514459929 * bLinear
  const m = 0.2119034982 * rLinear + 0.6806995451 * gLinear + 0.1073969566 * bLinear
  const s = 0.0883024619 * rLinear + 0.2817188376 * gLinear + 0.6299787005 * bLinear
  
  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)
  
  // Convert to OKLCH
  const lightness = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
  const aComp = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
  const bComp = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  
  const chroma = Math.sqrt(aComp * aComp + bComp * bComp)
  const hue = Math.atan2(bComp, aComp) * 180 / Math.PI
  
  return {
    l: lightness,
    c: chroma,
    h: hue < 0 ? hue + 360 : hue
  }
}

// Convert OKLCH to RGB
function oklchToRgb(oklch: OKLCHColor): { r: number, g: number, b: number } {
  const { l, c, h } = oklch
  const hueRad = h * Math.PI / 180
  
  // Convert to OKLab
  const aComp = c * Math.cos(hueRad)
  const bComp = c * Math.sin(hueRad)
  
  const l_ = l + 0.3963377774 * aComp + 0.2158037573 * bComp
  const m_ = l - 0.1055613458 * aComp - 0.0638541728 * bComp
  const s_ = l - 0.0894841775 * aComp - 1.2914855480 * bComp
  
  const l3 = l_ * l_ * l_
  const m3 = m_ * m_ * m_
  const s3 = s_ * s_ * s_
  
  // Convert to linear RGB
  const rLinear = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3
  const gLinear = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3
  const bLinear = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3
  
  // Convert to sRGB
  const fromLinear = (x: number) => x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055
  
  return {
    r: Math.max(0, Math.min(255, Math.round(fromLinear(rLinear) * 255))),
    g: Math.max(0, Math.min(255, Math.round(fromLinear(gLinear) * 255))),
    b: Math.max(0, Math.min(255, Math.round(fromLinear(bLinear) * 255)))
  }
}

export * from './classGenerator'
export * from './notifications'
export * from './symbols'

function getClosestLightness(color: string | tinycolor.ColorFormats.PRGB | tinycolor.ColorFormats.RGB | tinycolor.ColorFormats.HSL | tinycolor.ColorFormats.HSV | tinycolor.Instance | undefined) {
  const lightnessGoal = tinycolor(color).toHsl().l
  let closest = COLOR_LIGHTNESS_MAP[0]
  for (const curr of COLOR_LIGHTNESS_MAP) {
    if (Math.abs(curr - lightnessGoal) < Math.abs(closest - lightnessGoal)) {
      closest = curr
    }
  }
  return closest
}

export function generateColorsMap(color: tinycolor.ColorInput, lightnessMap = COLOR_LIGHTNESS_MAP) {
  const objMap = generateColorsObjMap(color, lightnessMap)
  return { ...objMap, colors: objMap.colors.map(c => c.toHexString()) }
}

// Enhanced OKLCH-based color generation
export function generateColorsObjMapOKLCH(color: tinycolor.ColorInput, lightnessMap = COLOR_LIGHTNESS_MAP) {
  const baseColor = tinycolor(color)
  const rgb = baseColor.toRgb()
  const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b)
  
  const closestLightness = getClosestLightness(baseColor)
  const baseColorIndex = lightnessMap.indexOf(closestLightness)

  const colors = lightnessMap.map((lightness) => {
    // Create new OKLCH color with modified lightness
    const newOklch: OKLCHColor = {
      l: lightness,
      c: oklch.c, // Preserve chroma for consistency
      h: oklch.h  // Preserve hue
    }
    
    // Convert back to RGB and create tinycolor instance
    const newRgb = oklchToRgb(newOklch)
    return tinycolor({ r: newRgb.r, g: newRgb.g, b: newRgb.b })
  })

  return { baseColorIndex, colors: colors.map(c => c) }
}

// Keep existing function for backward compatibility
export function generateColorsObjMap(color: tinycolor.ColorInput, lightnessMap = COLOR_LIGHTNESS_MAP) {
  const baseColor = tinycolor(color)
  const closestLightness = getClosestLightness(baseColor)
  const baseColorIndex = lightnessMap.indexOf(closestLightness)

  const colors = lightnessMap.map((lightness) => {
    const modifiedColor = tinycolor({ h: baseColor.toHsl().h, s: baseColor.toHsl().s, l: lightness })
    const saturationDelta = 0

    // Adjust the lightness for some hues
    if (baseColor.toHsl().h >= 20 && baseColor.toHsl().h <= 200) {
      modifiedColor.darken(2)
    }

    if (saturationDelta >= 0) {
      modifiedColor.saturate(saturationDelta * 100)
    }
    else {
      modifiedColor.desaturate(saturationDelta * -100)
    }
    return modifiedColor
  })

  return { baseColorIndex, colors: colors.map(c => c) }
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
export function generateColorsOKLCH(color: ColorInput, lightnessMap: number[] = COLOR_LIGHTNESS_MAP) {
  const objMap = generateColorsObjMapOKLCH(color, lightnessMap)
  return objMap.colors.map(c => c.toHexString()) as unknown as ColorsTuple
}

// Helper function to generate OKLCH string for CSS
export function generateOKLCHString(color: ColorInput): string {
  const baseColor = tinycolor(color)
  const rgb = baseColor.toRgb()
  const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b)
  
  return `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)})`
}

// Generate editor-friendly color variables with actual color values
export function generateEditorFriendlyColors(color: ColorInput, lightnessMap: number[] = COLOR_LIGHTNESS_MAP) {
  const objMap = generateColorsObjMapOKLCH(color, lightnessMap)
  
  return objMap.colors.map((c, index) => {
    const rgb = c.toRgb()
    const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b)
    const hex = c.toHexString()
    
    return {
      index,
      hex,
      rgb: `${rgb.r} ${rgb.g} ${rgb.b}`,
      oklch: `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)})`,
      lightness: lightnessMap[index]
    }
  })
}

export * from './theme'
