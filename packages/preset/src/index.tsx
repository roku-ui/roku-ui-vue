import fs from 'node:fs'
import type { Preset } from 'unocss'
import { presetIcons, presetTypography, presetUno } from 'unocss'

import tailwindReset from '@unocss/reset/tailwind.css'
import baseStyle from './styles.css'

const colorKeys = ['surface', 'primary', 'secondary', 'tertiary', 'error']
const colors = colorKeys.reduce<Record<string, any>>((colors, key) => {
  colors[key] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(c => `rgb(var(--r-color-${key}-${c}))`).reduce((pre, cur, i) => {
    pre[i] = cur
    return pre
  }, {} as any)

  if (key === 'surface') {
    ['lowest', 'low', 'base', 'high', 'highest', 'on', 'border'].forEach((k) => {
      if (k === 'border') {
        colors[key][k] = {
          base: `rgb(var(--r-color-${key}-${k}-base))`,
          low: `rgb(var(--r-color-${key}-${k}-low))`,
          high: `rgb(var(--r-color-${key}-${k}-high))`,
        }
      }
      else if (k === 'on') {
        colors[key][k] = {
          DEFAULT: `rgb(var(--r-color-${key}-${k}))`,
          low: `rgb(var(--r-color-${key}-${k}-low))`,
          container: {
            DEFAULT: `rgb(var(--r-color-${key}-${k}-container))`,
            low: `rgb(var(--r-color-${key}-${k}-container-low))`,
          },
        }
      }
      else if (k === 'border') {
        colors[key][k] = {
          DEFAULT: `rgb(var(--r-color-${key}-${k}-base))`,
          base: `rgb(var(--r-color-${key}-${k}-base))`,
          low: `rgb(var(--r-color-${key}-${k}-low))`,
          high: `rgb(var(--r-color-${key}-${k}-high))`,
        }
      }
      else {
        colors[key][k] = `rgb(var(--r-color-${key}-${k}))`
      }
    })
  }
  else {
    ['container', 'containerd', 'containerl', 'on', 'border'].forEach((k) => {
      colors[key][k] = `rgb(var(--r-color-${key}-${k}))`
      if (k === 'on') {
        colors[key][k] = {
          DEFAULT: `rgb(var(--r-color-${key}-${k}))`,
          low: `rgb(var(--r-color-${key}-${k}-low))`,
          container: {
            DEFAULT: `rgb(var(--r-color-${key}-${k}-container))`,
            low: `rgb(var(--r-color-${key}-${k}-container-low))`,
          },
        }
      }
    })
  }
  return colors
}, {})

const shortcuts = colorKeys.filter(d => d !== 'surface').reduce((shortcuts, color) => {
  shortcuts[`container-filled-${color}`] = `bg-${color}-container border-${color}-container border`
  shortcuts[`container-light-${color}`] = `bg-${color}-container/10 border-${color}-container border-transparent`
  shortcuts[`container-outline-${color}`] = `border-${color}-container border text-${color}-container`
  shortcuts[`container-subtle-${color}`] = `bg-${color}-container/0 border-${color}-container border-transparent`
  shortcuts[`container-transparent-${color}`] = `bg-transparent text-${color}-container border-transparent border-${color}-container`
  shortcuts[`container-contrast-${color}`] = `text-${color}-container border-${color}-container border-transparent`
  shortcuts[`btn-filled-${color}`] = `container-filled-${color} enabled:hover:bg-${color}-containerd enabled:hover:border-${color}-containerd text-${color}-on-container focus-visible:outline-2 outline-offset-2 focus-visible:outline-${color}-container outline-none`
  shortcuts[`btn-light-${color}`] = `container-light-${color} enabled:hover:bg-${color}-6/25 text-${color}-container focus-visible:outline-2 outline-offset-2 focus-visible:outline-${color}-container outline-none`
  shortcuts[`btn-outline-${color}`] = `container-outline-${color} enabled:hover:bg-${color}-container/10 text-${color}-container focus-visible:outline-2 outline-offset-2 focus-visible:outline-${color}-container outline-none`
  shortcuts[`btn-subtle-${color}`] = `container-subtle-${color} enabled:hover:bg-${color}-container/10 text-${color}-container focus-visible:outline-2 outline-offset-2 focus-visible:outline-${color}-container outline-none`
  shortcuts[`btn-transparent-${color}`] = `container-transparent-${color} hover:text-${color}-containerl focus-visible:outline-2 outline-offset-2 focus-visible:outline-${color}-container outline-none`
  shortcuts[`btn-contrast-${color}`] = `container-contrast-${color} hover:text-surface-base enabled:hover:bg-${color}-container focus-visible:outline-2 outline-offset-2 focus-visible:outline-${color}-container outline-none`
  return shortcuts
}, {} as any)

const themeShortCuts = {
  'surface-base': 'light:bg-[var(--l-surface-base)] dark:bg-[var(--d-surface-base)] dark:border-[var(--d-surface-border)] light:border-[var(--l-surface-border)]',
  'surface-lowest': 'light:bg-[var(--l-surface-lowest)] dark:bg-[var(--d-surface-lowest)] dark:border-[var(--d-surface-border)] light:border-[var(--l-surface-border)]',
  'surface-low': 'light:bg-[var(--l-surface-low)] dark:bg-[var(--d-surface-low)] dark:border-[var(--d-surface-border)] light:border-[var(--l-surface-border)]',
  'surface-high': 'light:bg-[var(--l-surface-high)] dark:bg-[var(--d-surface-high)] dark:border-[var(--d-surface-border)] light:border-[var(--l-surface-border)]',
  'surface-highest': 'light:bg-[var(--l-surface-highest)] dark:bg-[var(--d-surface-highest)] dark:border-[var(--d-surface-border)] light:border-[var(--l-surface-border)]',
  'surface-outline': 'light:border-[var(--l-surface-border)] dark:border-[var(--d-surface-border)] dark:text-[var(--d-surface-border)] light:text-[var(--l-surface-border)]',
}

interface PresetOptions {
  icon?: any
}
const rokuPreset: (options?: PresetOptions) => Preset<object> = (options = {}) => () => {
  let file = ''
  try {
    file = fs.readFileSync('node_modules/@roku-ui/vue/dist/index.js', 'utf-8')
  }
  catch {}
  return {
    name: 'roku',
    theme: {
      colors: {
        ...colors,
      },
    },
    safelist: ['rounded-[var(--r-rounded)]'],
    shortcuts: {
      ...shortcuts,
      ...themeShortCuts,
      'container-low': 'bg-surface-low border-surface-border-low border text-surface-on',
      'container-base': 'bg-surface-base border-surface-border-base border text-surface-on',
      'container-high': 'bg-surface-high border-surface-border-high border text-surface-on',
      'btn-default': 'container-base enabled:hover:bg-surface-border-base focus-visible:outline-2 outline-offset-2 focus-visible:outline-surface-border-base outline-none',
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
        ...options?.icon,
      }),
    ],
    content: {
      inline: [file],
    },
    preflights: [
      { getCSS: () => tailwindReset },
      {
        getCSS: () => baseStyle,
      },
    ],
  }
}
export { rokuPreset }
