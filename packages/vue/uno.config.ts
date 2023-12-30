import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetUno,
} from 'unocss'
import type { ThemeColorsColors } from './src/utils/theme'
import { themeColors } from './src/utils/theme'

const safelist = []
const colorKeys = Object.keys(themeColors) as (keyof ThemeColorsColors)[]
const colors = colorKeys.reduce((colors, key) => {
  colors[key] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(c => `rgb(var(--r-color-${key}-${c}))`).reduce((pre, cur, i) => {
    pre[i] = cur
    return pre
  }, {})

  if (key === 'surface') {
    ['lowest', 'low', 'base', 'high', 'highest', 'on', 'oninverted', 'onlow', 'onlowinverted'].forEach((k) => {
      colors[key][k] = `rgb(var(--r-color-${key}-${k}))`
    })
  }
  else {
    ['container', 'containerd', 'containerl', 'on'].forEach((k) => {
      colors[key][k] = `rgb(var(--r-color-${key}-${k}))`
      safelist.push(`bg-${key}-${k}`)
    })
  }
  return colors
}, {})

const shortcuts = colorKeys.filter(d => d !== 'surface').reduce((shortcuts, key) => {
  shortcuts[`container-filled-${key}`] = `bg-${key}-container`
  shortcuts[`btn-filled-${key}`] = `container-filled-${key} enabled:hover:bg-${key}-containerd text-${key}-on`
  shortcuts[`container-light-${key}`] = `bg-${key}-container/10`
  shortcuts[`btn-light-${key}`] = `container-light-${key} hover:bg-${key}-6/25 text-${key}-container`
  shortcuts[`container-outline-${key}`] = `border-${key}-container border text-${key}-container`
  shortcuts[`btn-outline-${key}`] = `container-outline-${key} hover:bg-${key}-container/10 text-${key}-container`
  shortcuts[`container-subtle-${key}`] = `bg-${key}-container/0`
  shortcuts[`btn-subtle-${key}`] = `container-subtle-${key} hover:bg-${key}-container/10 text-${key}-container`
  shortcuts[`container-transparent-${key}`] = `bg-transparent text-${key}-container`
  shortcuts[`btn-transparent-${key}`] = `container-transparent-${key} hover:text-${key}-containerl`
  shortcuts[`container-constrast-${key}`] = `text-${key}-container`
  shortcuts[`btn-constrast-${key}`] = `container-constrast-${key} hover:text-surface-base hover:bg-${key}-container`
  return shortcuts
}, {})

export default defineConfig({
  theme: {
    colors: {
      ...colors,
    },
  },
  shortcuts: {
    ...shortcuts,
    'container-default': 'bg-surface-base border-surface-high border text-surface-on',
    'btn-default': 'container-default enabled:hover:bg-surface-high',
  },
  presets: [
    presetUno(),
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
    pipeline: {
      include: [
        'src/**/*',
      ],
    },
  },
  safelist,
})
