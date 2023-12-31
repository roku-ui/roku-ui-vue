import { defineConfig, presetIcons, presetTypography, presetUno } from 'unocss'
import { rokuPreset } from './src/preset'

export default defineConfig({
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
  content: {
    pipeline: {
      include: [
        'src/**/*',
      ],
    },
  },
})
