import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetUno,
} from 'unocss'
import type { ThemeColorsColors } from './src/utils/theme'
import { themeColors } from './src/utils/theme'

const colorKeys = Object.keys(themeColors) as (keyof ThemeColorsColors)[]
const colors = colorKeys.reduce((colors, key) => {
  colors[key] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(c => `rgb(var(--r-color-${key}-${c}))`)
  return colors
}, {})

const shortcuts = colorKeys.filter(d => d !== 'surface').reduce((shortcuts, key) => {
  shortcuts[`container-filled-${key}`] = `bg-${key}-7`
  shortcuts[`btn-filled-${key}`] = `container-filled-${key} enabled:hover:bg-${key}-8 text-${key}-1`
  shortcuts[`container-light-${key}`] = `bg-${key}-6/20`
  shortcuts[`btn-light-${key}`] = `container-light-${key} hover:bg-${key}-6/25 text-${key}-3`
  shortcuts[`container-outline-${key}`] = `border-${key}-6 border text-${key}-6`
  shortcuts[`btn-outline-${key}`] = `container-outline-${key} hover:bg-${key}-6/10 text-${key}-6`
  shortcuts[`container-subtle-${key}`] = `bg-${key}-6/0`
  shortcuts[`btn-subtle-${key}`] = `container-subtle-${key} hover:bg-${key}-6/10 text-${key}-6`
  shortcuts[`container-transparent-${key}`] = `bg-transparent text-${key}-6`
  shortcuts[`btn-transparent-${key}`] = `container-transparent-${key} hover:text-${key}-4`
  shortcuts[`container-constrast-${key}`] = `text-${key}-6`
  shortcuts[`btn-constrast-${key}`] = `container-constrast-${key} hover:text-surface-9 hover:bg-${key}-7`
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
    'container-default': 'bg-surface-8 border-surface-7 border',
    'btn-default': 'container-default text-surface-1 enabled:hover:bg-surface-7',
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
})
