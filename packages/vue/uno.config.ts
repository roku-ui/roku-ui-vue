import type {
  CSSObject,
} from 'unocss'
import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetUno,
} from 'unocss'

const themeVariants = [
  'primary',
  'secondary',
  'tertiary',
  'error',
]

const themeColorVariants = [
  'base',
  'variant',
]
const themePositionVariants = [
  'on',
  'outline',
  'container',
]

const rules: [string, CSSObject][] = themeVariants.flatMap((themeVariant) => {
  return themePositionVariants.flatMap((themePositionVariant) => {
    return themeColorVariants.map((themeColorVariant) => {
      function getType(v: string) {
        switch (v) {
          case 'on':
            return 'color'
          case 'outline':
            return 'border-color'
          case 'container':
            return 'background-color'
        }
      }
      return [
        `${themeVariant}-${themePositionVariant}-${themeColorVariant}`,
        {
          [getType(themePositionVariant)]: `var(--r-color-${themeVariant}-${themePositionVariant}-${themeColorVariant})`,
        },
      ] as [string, CSSObject]
    })
  })
})

export default defineConfig({
  shortcuts: {
    'container-priamry-focus': 'cursor-pointer focus:primary-outline-base',
    'container-secondary-focus': 'cursor-pointer focus:secondary-outline-base',
    'container-tertiary-focus': 'cursor-pointer focus:tertiary-outline-base',
    'container-error-focus': 'cursor-pointer focus:error-outline-base',
    'container-default': 'surface-outline-base surface-container-base surface-on-base border',
    'container-primary': 'primary-outline-base primary-container-base primary-on-base hover:primary-container-variant',
    'container-secondary': 'secondary-outline-base secondary-container-base secondary-on-base hover:secondary-container-variant',
    'container-tertiary': 'tertiary-outline-base tertiary-container-base tertiary-on-base hover:tertiary-container-variant',
    'container-error': 'error-outline-base error-container-base error-on-base hover:error-container-variant',
  },
  rules: [
    ...rules,
    [
      /^surface-container-(low|base|high)$/,
      ([_, v]) => {
        return {
          'background-color': `var(--r-color-surface-container-${v})`,
        }
      },
    ],
    [
      /^surface-on-(base|variant)$/,
      ([_, v]) => {
        return {
          color: `var(--r-color-surface-on-${v})`,
        }
      },
    ],
    [
      /^surface-outline-(base|variant)$/,
      ([_, v]) => {
        return {
          'border-color': `var(--r-color-surface-outline-${v})`,
        }
      },
    ],
  ],
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
