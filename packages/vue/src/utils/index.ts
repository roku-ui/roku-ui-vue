import tinycolor from 'tinycolor2'

export * from './theme'
export * from './notifications'

const LIGHTNESS_MAP = [0.96, 0.907, 0.805, 0.697, 0.605, 0.547, 0.518, 0.445, 0.395, 0.34, 0.28]

function getClosestLightness(color: string | tinycolor.ColorFormats.PRGB | tinycolor.ColorFormats.RGB | tinycolor.ColorFormats.HSL | tinycolor.ColorFormats.HSV | tinycolor.Instance | undefined) {
  const lightnessGoal = tinycolor(color).toHsl().l
  return LIGHTNESS_MAP.reduce((prev, curr) =>
    Math.abs(curr - lightnessGoal) < Math.abs(prev - lightnessGoal) ? curr : prev,
  )
}

export function generateColorsMap(color: tinycolor.ColorInput | undefined) {
  const baseColor = tinycolor(color)
  const closestLightness = getClosestLightness(baseColor)
  const baseColorIndex = LIGHTNESS_MAP.findIndex(l => l === closestLightness)

  const colors = LIGHTNESS_MAP.map((lightness) => {
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

export function generateColors(color: string | tinycolor.ColorFormats.PRGB | tinycolor.ColorFormats.RGB | tinycolor.ColorFormats.HSL | tinycolor.ColorFormats.HSV | tinycolor.Instance | undefined) {
  return generateColorsMap(color).colors as unknown as ColorsTuple
}
