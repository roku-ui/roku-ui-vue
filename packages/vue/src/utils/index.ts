import type { ColorInput } from 'tinycolor2'
import tinycolor from 'tinycolor2'
import { COLOR_LIGHTNESS_MAP } from '..'

export * from './theme'
export * from './notifications'
export * from './classGenerator'

function getClosestLightness(color: string | tinycolor.ColorFormats.PRGB | tinycolor.ColorFormats.RGB | tinycolor.ColorFormats.HSL | tinycolor.ColorFormats.HSV | tinycolor.Instance | undefined) {
  const lightnessGoal = tinycolor(color).toHsl().l
  return COLOR_LIGHTNESS_MAP.reduce((prev, curr) =>
    Math.abs(curr - lightnessGoal) < Math.abs(prev - lightnessGoal) ? curr : prev,
  )
}

export function generateColorsMap(color: tinycolor.ColorInput, lightnessMap = COLOR_LIGHTNESS_MAP) {
  const objMap = generateColorsObjMap(color, lightnessMap)
  return { ...objMap, colors: objMap.colors.map(c => c.toHexString()) }
}

export function generateColorsObjMap(color: tinycolor.ColorInput, lightnessMap = COLOR_LIGHTNESS_MAP) {
  const baseColor = tinycolor(color)
  const closestLightness = getClosestLightness(baseColor)
  const baseColorIndex = lightnessMap.findIndex(l => l === closestLightness)

  const colors = lightnessMap.map((lightness) => {
    const modifiedColor = tinycolor({ h: baseColor.toHsl().h, s: baseColor.toHsl().s, l: lightness })
    const saturationDelta = 0
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

export * from './symbols'
