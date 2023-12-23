import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetUno,
} from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      include: ['**/*.vue', 'node_modules/@roku-ui/vue/dist/*.js'],
    },
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
