import type { Preset } from 'unocss'
import fs from 'node:fs'
import tailwindReset from '@unocss/reset/tailwind.css'

import { presetIcons, presetTypography, presetWind3 } from 'unocss'
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
  return {
    name: 'roku',
    theme: {
      colors: {
        ...colors,
      },
    },
    safelist: ['rounded-[--r-rounded]'],
    shortcuts: {
      'custom-colors': 'border dark:text-[var(--d-text)] text-[var(--l-text)] dark:bg-[var(--d-bg)] bg-[var(--l-bg)] dark:border-[var(--d-border)] border-[var(--l-border)] dark:hover:bg-[var(--d-bg-h)] hover:bg-[var(--l-bg-h)] hover:text-[var(--l-text-h)] dark:hover:text-[var(--d-text-h)] focus-visible:outline-[--l-outline] dark:focus-visible:outline-[--d-outline]',
      'custom-input-colors': 'border bg-[var(--l-bg)] dark:bg-[var(--d-bg)] text-[var(--l-text)] dark:text-[var(--d-text)] placeholder-[var(--l-placeholder)] dark:placeholder-[var(--d-placeholder)] border-[var(--l-border)] dark:border-[var(--d-border)] focus:border-[var(--l-border-f)] dark:focus:border-[var(--d-border-f)]',
      'bg-surface': 'bg-[--r-surface-background-color]',
      'bg-surface-base': 'bg-[--r-surface-background-base-color]',
      'bg-surface-variant-1': 'bg-[--r-surface-background-variant-1-color]',
      'bg-surface-variant-2': 'bg-[--r-surface-background-variant-2-color]',
      'border-surface': 'border-[--r-surface-border-color]',
      'border-surface-variant': 'border-[--r-surface-border-variant-color]',
      'text-surface': 'text-[--r-surface-text-color]',
      'text-surface-dimmed': 'text-[--r-surface-text-dimmed-color]',
      'bg-primary': 'bg-[--r-primary-background-color]',
      'bg-secondary': 'bg-[--r-secondary-background-color]',
      'bg-tertiary': 'bg-[--r-tertiary-background-color]',
      'bg-error': 'bg-[--r-error-background-color]',
      'text-primary': 'text-[--r-primary-text-color]',
      'text-secondary': 'text-[--r-secondary-text-color]',
      'text-tertiary': 'text-[--r-tertiary-text-color]',
      'text-error': 'text-[--r-error-text-color]',
      'border-primary': 'border-[--r-primary-background-color]',
      'border-secondary': 'border-[--r-secondary-background-color]',
      'border-tertiary': 'border-[--r-tertiary-background-color]',
      'border-error': 'border-[--r-error-background-color]',
      'outline-primary': 'outline-[--r-primary-background-color]',
      'outline-secondary': 'outline-[--r-secondary-background-color]',
      'outline-tertiary': 'outline-[--r-tertiary-background-color]',
      'outline-error': 'outline-[--r-error-background-color]',
    },
    presets: [
      presetWind3({
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
