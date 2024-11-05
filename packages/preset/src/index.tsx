import type { Preset } from 'unocss'
import fs from 'node:fs'
import tailwindReset from '@unocss/reset/tailwind.css'

import { presetIcons, presetTypography, presetUno } from 'unocss'
import baseStyle from './styles.css'

const colorKeys = ['surface', 'primary', 'secondary', 'tertiary', 'error']
const colors = colorKeys.reduce<Record<string, any>>((colors, key) => {
  colors[key] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(c => `rgb(var(--r-color-${key}-${c}))`).reduce((pre, cur, i) => {
    pre[i] = cur
    return pre
  }, {} as any)
  return colors
}, {})

const rokuPreset: () => Preset<object> = () => () => {
  let file = ''
  try {
    file = fs.readFileSync('node_modules/@roku-ui/vue/dist/index.js', 'utf-8')
  }
  catch {}
  const option: Preset = {
    name: 'roku',
    theme: {
      colors: {
        ...colors,
      },
    },
    safelist: ['rounded-[--r-rounded]'],
    shortcuts: {
      'custom-colors': 'border dark:text-[var(--d-text)] text-[var(--l-text)] dark:bg-[var(--d-bg)] bg-[var(--l-bg)] dark:border-[var(--d-border)] border-[var(--l-border)] dark:hover:bg-[var(--d-bg-h)] hover:bg-[var(--l-bg-h)] hover:text-[var(--l-text-h)] dark:hover:text-[var(--d-text-h)]',
      'custom-input-colors': 'border bg-[var(--l-bg)] dark:bg-[var(--d-bg)] text-[var(--l-text)] dark:text-[var(--d-text)] placeholder-[var(--l-placeholder)] dark:placeholder-[var(--d-placeholder)] border-[var(--l-border)] dark:border-[var(--d-border)] focus:border-[var(--l-border-f)] dark:focus:border-[var(--d-border-f)]',
      'bg-surface': 'bg-[--r-surface-background-color]',
      'bg-surface-base': 'bg-[--r-surface-background-base-color]',
      'bg-surface-variant': 'bg-[--r-surface-background-variant-color]',
      'border-surface': 'border-[--r-surface-border-color]',
      'text-surface': 'text-[--r-surface-text-color]',
      'text-surface-dimmed': 'text-[--r-surface-text-dimmed-color]',
      'bg-primary': 'bg-[--r-primary-background-color]',
      'bg-secondary': 'bg-[--r-secondary-background-color]',
      'bg-tertiary': 'bg-[--r-tertiary-background-color]',
      'bg-error': 'bg-[--r-error-background-color]',
      'text-priamry': 'text-[--r-primary-text-color]',
      'text-secondary': 'text-[--r-secondary-text-color]',
      'text-tertiary': 'text-[--r-tertiary-text-color]',
      'text-error': 'text-[--r-error-text-color]',
    },
    presets: [
      presetUno({
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
  return option
}
export { rokuPreset }
