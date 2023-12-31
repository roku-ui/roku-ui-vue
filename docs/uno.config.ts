import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetUno,
} from 'unocss'
import { rokuPreset } from '@roku-ui/vue'

export default defineConfig({
  content: {
    pipeline: {
      include: ['**/*.vue', 'node_modules/@roku-ui/vue/dist/*.js'],
    },
  },
  presets: [
    rokuPreset,
    presetUno({
      dark: {
        dark: '[data-theme="dark"]',
        light: '[data-theme="light"]',
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
})
