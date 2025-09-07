import type { Preset } from 'unocss'
import fs from 'node:fs'
import tailwindReset from '@unocss/reset/tailwind.css'

import { presetIcons, presetTypography, presetWind4 } from 'unocss'
import baseStyle from './styles.css'

const colorKeys = ['surface', 'primary', 'secondary', 'tertiary', 'error']
const colors: Record<string, Record<number, string>> = {}
for (const key of colorKeys) {
  const obj: Record<number, string> = {}
  for (let c = 0; c <= 10; c++) {
    obj[c] = `rgb(var(--r-color-${key}-${c}))`
  }
  colors[key] = obj
}

function rokuPresetImpl(): Preset {
  let file = ''
  try {
    file = fs.readFileSync('node_modules/@roku-ui/vue/dist/index.js', 'utf8')
  }
  catch {}

  // Dynamic rules generator - replaces many static shortcuts
  const dynamicRules: Array<[RegExp, (match: RegExpMatchArray) => Record<string, string>]> = [
    // Color-mix transparency: bg-{color}-mix-{percentage}
    [/^bg-([a-z]+)-mix-(\d+)$/, ([, color, percentage]) => ({
      'background-color': `color-mix(in oklch, var(--r-${color}-background-color) ${percentage}%, transparent)`,
    })],
    // Color-mix transparency: text-{color}-mix-{percentage}
    [/^text-([a-z]+)-mix-(\d+)$/, ([, color, percentage]) => ({
      color: `color-mix(in oklch, var(--r-${color}-text-color) ${percentage}%, transparent)`,
    })],
    // Color-mix transparency: border-{color}-mix-{percentage}
    [/^border-([a-z]+)-mix-(\d+)$/, ([, color, percentage]) => ({
      'border-color': `color-mix(in oklch, var(--r-${color}-background-color) ${percentage}%, transparent)`,
    })],

    // Standard color backgrounds: bg-{color}
    [/^bg-(secondary|tertiary|error)$/, ([, color]) => ({
      'background-color': `var(--r-${color}-background-color)`,
    })],
    // Standard color text: text-{color}
    [/^text-(secondary|tertiary|error)$/, ([, color]) => ({
      color: `var(--r-${color}-text-color)`,
    })],
    // Note: border-{color} handled via shortcuts below to avoid raw declarations
    // Standard color outlines: outline-{color}
    [/^outline-(primary|secondary|tertiary|error)$/, ([, color]) => ({
      'outline-color': `var(--r-${color}-background-color)`,
    })],

    // Surface variants: bg-surface-variant-{number}
    [/^bg-surface-variant-([12])$/, ([, variant]) => ({
      'background-color': `var(--r-surface-background-variant-${variant}-color)`,
    })],
    // Surface border variants: border-surface-variant
    [/^border-surface-variant$/, () => ({
      'border-color': 'var(--r-surface-border-variant-color)',
    })],
  ]

  return {
    name: 'roku',
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
    shortcuts: {
      // Legacy component integration shortcuts (keep for backward compatibility)
      'custom-colors': 'border dark:text-[var(--d-text)] text-[var(--l-text)] dark:bg-[var(--d-bg)] bg-[var(--l-bg)] dark:border-[var(--d-border)] border-[var(--l-border)] dark:hover:bg-[var(--d-bg-h)] hover:bg-[var(--l-bg-h)] hover:text-[var(--l-text-h)] dark:hover:text-[var(--d-text-h)] focus-visible:outline-[--l-outline] dark:focus-visible:outline-[--d-outline]',
      'custom-input-colors': 'border bg-[var(--l-bg)] dark:bg-[var(--d-bg)] text-[var(--l-text)] dark:text-[var(--d-text)] placeholder-[var(--l-placeholder)] dark:placeholder-[var(--d-placeholder)] border-[var(--l-border)] dark:border-[var(--d-border)] focus:border-[var(--l-border-f)] dark:focus:border-[var(--d-border-f)]',

      // Essential semantic color shortcuts
      'bg-surface': 'bg-[--r-surface-background-color]',
      'bg-surface-base': 'bg-[--r-surface-background-base-color]',
      'text-surface': 'text-[--r-surface-text-color]',
      'text-surface-dimmed': 'text-[--r-surface-text-dimmed-color]',
      'border-surface': 'border-[--r-surface-border-color]',

      // Core color shortcuts (most commonly used)
      'bg-primary': 'bg-[--r-primary-background-color]',
      'text-primary': 'text-[--r-primary-text-color]',

      // Background shortcuts for other semantic colors
      'bg-secondary': 'bg-[--r-secondary-background-color]',
      'bg-tertiary': 'bg-[--r-tertiary-background-color]',
      'bg-error': 'bg-[--r-error-background-color]',

      // Text shortcuts for other semantic colors
      'text-secondary': 'text-[--r-secondary-text-color]',
      'text-tertiary': 'text-[--r-tertiary-text-color]',
      'text-error': 'text-[--r-error-text-color]',

      // Border color shortcuts using arbitrary values
      'border-primary': 'border-[--r-primary-background-color]',
      'border-secondary': 'border-[--r-secondary-background-color]',
      'border-tertiary': 'border-[--r-tertiary-background-color]',
      'border-error': 'border-[--r-error-background-color]',

      // Outline color shortcuts
      'outline-primary': 'outline-[--r-primary-background-color]',
      'outline-secondary': 'outline-[--r-secondary-background-color]',
      'outline-tertiary': 'outline-[--r-tertiary-background-color]',
      'outline-error': 'outline-[--r-error-background-color]',

      // Note: Other color combinations (bg-secondary, text-tertiary, etc.) are handled by dynamic rules
      // Note: Color-mix transparency (bg-primary-mix-30, etc.) is handled by dynamic rules
    },
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
    content: {
      inline: [file],
    },
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
