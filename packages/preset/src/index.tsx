import type { Preset } from 'unocss'
import tailwindReset from '@unocss/reset/tailwind.css'
import { presetIcons, presetTypography, presetWind4 } from 'unocss'
import baseStyle from './styles.css'

const colorKeys = ['surface', 'primary', 'secondary', 'tertiary', 'info', 'warning', 'error']
const colors: Record<string, Record<number, string>> = {}
for (const key of colorKeys) {
  const obj: Record<number, string> = {}
  for (let c = 0; c <= 10; c++) {
    obj[c] = `rgb(var(--r-color-${key}-${c}))`
  }
  colors[key] = obj
}
const shortcuts = {
  // Legacy component integration shortcuts (keep for backward compatibility)
  'custom-colors': 'border text-[var(--r-scheme-text)] bg-[var(--r-scheme-bg)] border-[var(--r-scheme-border)] hover:bg-[var(--r-scheme-bg-hover)] hover:text-[var(--r-scheme-text-hover)] focus-visible:outline-[var(--r-scheme-outline)]',
  'custom-input-colors': 'border bg-[var(--r-scheme-bg)] text-[var(--r-scheme-text)] placeholder-[var(--r-scheme-placeholder)] border-[var(--r-scheme-border)] focus:border-[var(--r-scheme-border-focus)] hover:bg-[var(--r-scheme-bg-hover)]',
}
function rokuPresetImpl(): Preset {
  // Dynamic rules generator - replaces many static shortcuts
  const dynamicRules: Array<[RegExp, (match: RegExpMatchArray) => Record<string, string>]> = [

    // Standard color backgrounds: bg-{color}
    [/^bg-(primary|secondary|tertiary|success|error|info|warning)$/, ([, color]) => ({
      'background-color': `rgb(var(--r-bg-${color}) / var(--un-bg-opacity, 1))`,
    })],

    // Standard color text: text-{color}
    [/^text-(dimmed|muted|default|highlight|inverted)$/, ([, variant]) => ({
      color: `rgb(var(--r-text-${variant}) / var(--un-text-opacity, 1))`,
    })],

    [/^bg-(base|container|elevated|inverted)$/, ([, variant]) => ({
      'background-color': `rgb(var(--r-bg-${variant}) / var(--un-bg-opacity, 1))`,
    })],

    [/^border-(base|container|elevated|inverted)$/, ([, color]) => ({
      'border-color': `rgb(var(--r-border-${color}) / var(--un-border-opacity, 1))`,
    })],

    [/^text-(primary|secondary|tertiary|success|error|info|warning)$/, ([, color]) => ({
      color: `rgb(var(--r-text-${color}) / var(--un-text-opacity, 1))`,
    })],

    // Note: border-{color} handled via shortcuts below to avoid raw declarations
    // Standard color outlines: outline-{color}
    [/^outline-(primary|secondary|tertiary|error|info|warning)$/, ([, color]) => ({
      'outline-color': `rgb(var(--r-bg-${color}) / var(--un-outline-opacity, 1))`,
    })],

  ]

  return {
    name: '@roku-ui/preset',
    content: {
      pipeline: {
        include: [/\.js$/],
      },
      filesystem: ['**/node_modules/@roku-ui/vue/dist/index.js'],
    },
    theme: {
      colors: {
        ...colors,
      },
    },
    safelist: ['rounded-[--r-rounded]'],
    rules: [
      // Dynamic rules replace many static shortcuts
      ...dynamicRules,
    ],
    shortcuts,
    presets: [
      presetWind4({
        dark: {
          dark: '[data-scheme="dark"]',
          light: '[data-scheme="light"]',
        },
      }),
      presetTypography(),
      presetIcons({
        scale: 1.2,
        extraProperties: {
          'display': 'inline-block',
          'vertical-align': 'middle',
        },
      }),
    ],
    preflights: [
      { getCSS: () => tailwindReset as string },
      {
        getCSS: () => baseStyle as string,
      },
    ],
  }
}

const rokuPreset = (): Preset => rokuPresetImpl()
export { rokuPreset }
