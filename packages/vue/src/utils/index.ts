import tinycolor from 'tinycolor2'

export * from './theme'
export * from './notifications'

const LIGHTNESS_MAP = [0.98, 0.96, 0.9, 0.8, 0.6, 0.55, 0.5, 0.3, 0.28, 0.2, 0.08]

function getClosestLightness(color: string | tinycolor.ColorFormats.PRGB | tinycolor.ColorFormats.RGB | tinycolor.ColorFormats.HSL | tinycolor.ColorFormats.HSV | tinycolor.Instance | undefined) {
  const lightnessGoal = tinycolor(color).toHsl().l
  return LIGHTNESS_MAP.reduce((prev, curr) =>
    Math.abs(curr - lightnessGoal) < Math.abs(prev - lightnessGoal) ? curr : prev,
  )
}

export function generateColorsMap(color: tinycolor.ColorInput | undefined, lightnessMap = LIGHTNESS_MAP) {
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

  return { baseColorIndex, colors: colors.map(c => c.toHexString()) }
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

export function generateColors(color: string | tinycolor.ColorFormats.PRGB | tinycolor.ColorFormats.RGB | tinycolor.ColorFormats.HSL | tinycolor.ColorFormats.HSV | tinycolor.Instance | undefined, lightnessMap: number[] = LIGHTNESS_MAP) {
  return generateColorsMap(color, lightnessMap).colors as unknown as ColorsTuple
}

export * from './symbols'
