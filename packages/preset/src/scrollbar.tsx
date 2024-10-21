import type { Preset } from 'unocss'
import { colorResolver, handler } from '@unocss/preset-mini/utils'

const defaultOption: Required<PresetScrollbarDefaultOption> = {
  scrollbarWidth: '8px',
  scrollbarHeight: '8px',
  scrollbarTrackRadius: '4px',
  scrollbarThumbRadius: '4px',
  scrollbarTrackColor: '#f5f5f5',
  scrollbarThumbColor: '#ddd',
  varPrefix: '',
  prefix: '',
  numberToUnit: value => `${value / 4}rem`,
  noCompatible: true,
}

export interface PresetScrollbarDefaultOption {
  /**
   * default scrollbar width
   * @default '8px'
   */
  scrollbarWidth?: string
  /**
   * default scrollbar height
   * @default '8px'
   */
  scrollbarHeight?: string
  /**
   * default scrollbar track radius
   * @default '4px'
   */
  scrollbarTrackRadius?: string
  /**
   * default scrollbar thumb radius
   * @default '4px'
   */
  scrollbarThumbRadius?: string
  /**
   * default scrollbar track background color
   * @default '#f5f5f5'
   */
  scrollbarTrackColor?: string
  /**
   * default scrollbar thumb background color
   * @default '#ddd'
   */
  scrollbarThumbColor?: string
  /**
   * Apply prefix to all utilities and shortcuts
   */
  prefix?: string | string[]
  /**
   * css variable prefix
   * @default ''
   */
  varPrefix?: string
  /**
   * convert number to unit
   * @default value => `${value / 4}rem`
   * @example
   * numberToUnit: value => `${value / 4}rem`
   * p-4 => padding: 1rem
   * p-4px => padding: 4px
   *
   * @example
   * numberToUnit: value => `${value}rpx`
   * p-4 => padding: 4rpx
   */
  numberToUnit?: (value: number) => string

  /**
   * if false will use scrollbar-color and scrollbar-width, rounded and scrollbar-w, scrollbar-h and scrollbar-radius will not work
   * if true, won't have any effect in Firefox
   *
   * @default true
   */
  noCompatible?: boolean
}

const customRules = {
  'radius': ['track-radius', 'thumb-radius'],
  'w': ['width'],
  'h': ['height'],
  'track-radius': ['track-radius'],
  'thumb-radius': ['thumb-radius'],
}

const numberVarRegex = new RegExp(`^scrollbar-(${Object.keys(customRules).join('|')})-(\\d+)([a-zA-Z]*)$`)

export function presetScrollbar(option?: PresetScrollbarDefaultOption): Preset {
  const config = {
    ...defaultOption,
    ...option,
  }

  function resolveVar(name: string) {
    const prefix = config.varPrefix
    return `--${prefix ? `${prefix}-` : ''}scrollbar-${name}`
  }

  const variantsRE = /^(scrollbar(-track|-thumb)?):.+$/

  return {
    name: 'unocss-preset-scrollbar',
    prefix: config.prefix,
    shortcuts: [
      [
        'scrollbar',
        [
          { overflow: 'auto' },
          'scrollbar-custom-property',
          'scrollbar-width-auto',
          `scrollbar-color-[var(${resolveVar('thumb')})_var(${resolveVar('track')})]`,
          `scrollbar-track:scrollbar-background-color-[var(${resolveVar('track')})]`,
          `scrollbar-thumb:scrollbar-background-color-[var(${resolveVar('thumb')})]`,
          `scrollbar:scrollbar-width-[var(${resolveVar('width')})]`,
          `scrollbar:scrollbar-height-[var(${resolveVar('height')})]`,
        ],
      ],
      [
        'scrollbar-rounded',
        `
          scrollbar-track:scrollbar-border-radius-[var(${resolveVar('track-radius')})]
          scrollbar-thumb:scrollbar-border-radius-[var(${resolveVar('thumb-radius')})]
        `,
      ],
      [
        'scrollbar-thin',
        `
          scrollbar-w-8px
          scrollbar-h-8px
          scrollbar-width-thin
        `,
      ],
      [
        'scrollbar-none',
        `
          scrollbar:hidden
          scrollbar-width-none
        `,
      ],
      [
        'roku-scrollbar',

        `scrollbar
scrollbar-rounded
scrollbar-thin
scrollbar-thumb-color-surface-4
scrollbar-track-color-surface-3
scrollbar-thumb-hover-color-surface-4
dark:scrollbar-thumb-color-surface-7
dark:scrollbar-track-color-surface-8
dark:scrollbar-thumb-hover-color-surface-5
        `,
      ],
    ],
    variants: [
      // ::-webkit-scrollbar-track
      // ::-webkit-scrollbar-thumb
      // ::-webkit-scrollbar
      (matcher) => {
        if (!variantsRE.test(matcher)) {
          return
        }

        const variant = matcher.replace(variantsRE, '$1')

        return {
          matcher: matcher.slice(variant.length + 1),
          selector: (s) => {
            return `${s}::-webkit-${variant}`
          },
        }
      },
    ],
    rules: [
      [
        /^scrollbar-color-(.+)$/,
        ([_, prop]) => {
          if (config.noCompatible) {
            return {}
          }

          // when use scrollbar-color, ::-webkit-scrollbar styling is disabled.
          // https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar
          return {
            'scrollbar-color': handler.bracket.cssvar.auto.fraction.rem(prop),
          }
        },
      ],
      [
        /^scrollbar-width-(auto|thin|none)/,
        ([_, prop]) => {
          const res: Record<string, string> = {}
          if (!config.noCompatible || prop === 'none') {
            res['scrollbar-width'] = prop
          }
          return res
        },
      ],
      [
        /^scrollbar-custom-property$/,
        ([_]) => ({
          [resolveVar('track')]: config.scrollbarTrackColor,
          [resolveVar('thumb')]: config.scrollbarThumbColor,
          [resolveVar('width')]: config.scrollbarWidth,
          [resolveVar('height')]: config.scrollbarHeight,
          [resolveVar('track-radius')]: config.scrollbarTrackRadius,
          [resolveVar('thumb-radius')]: config.scrollbarThumbRadius,
        }),
      ],
      [
        /^scrollbar-thumb-color-(.+)$/,
        colorResolver(resolveVar('thumb'), 'scrollbar-thumb'),
        { autocomplete: 'scrollbar-thumb-color-$colors' },
      ],
      [
        /^scrollbar-track-color-(.+)$/,
        colorResolver(resolveVar('track'), 'scrollbar-track'),
        { autocomplete: 'scrollbar-track-color-$colors' },
      ],
      [
        /^scrollbar-((?:width|height|background-color|border-radius)?)-(\[var.+\])$/,
        (
          [
            _,
            prop,
            value,
          ],
        ) => {
          return {
            [`${prop}`]: handler.bracket(value),
          }
        },
      ],
      [
        numberVarRegex,
        (
          [
            _,
            type,
            value,
            unit,
          ],
        ) => {
          const val = unit ? value + unit : config.numberToUnit(Number.parseInt(value))
          const vars = customRules[type as keyof typeof customRules]
            .map(v => resolveVar(v))
          return vars.reduce((acc: any, v) => {
            acc[v] = val
            return acc
          }, {})
        },
        { autocomplete: `scrollbar-(${Object.keys(customRules).join('|')})-<num>` },
      ],
      [
        /^scrollbar-thumb-hover-color-(.*)$/,
        ([,color]) => {
          return `.scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(var(--r-color-${color}) / 1); }`
        },
      ],
      [
        'hidden',
        { display: 'none' },
      ],
    ],
  }
}
