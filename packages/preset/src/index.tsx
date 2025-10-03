import type { Preset } from 'unocss'
import tailwindReset from '@unocss/reset/tailwind.css'
import { presetIcons, presetTypography, presetWind4 } from 'unocss'
// 使用 ?raw 以便在 vite 开发模式下把 CSS 作为纯文本引入（无需 rollup-plugin-import-css）
// 这样 alias 指向源码时修改 styles.css 会立即触发热更新并注入新的 preflight
import baseStyle from './styles.css?raw'

const colorKeys = ['surface', 'primary', 'secondary', 'tertiary', 'info', 'warning', 'error']
const colors: Record<string, Record<number, string>> = {}
for (const key of colorKeys) {
  const obj: Record<number, string> = {}
  for (let c = 0; c <= 10; c++) {
    obj[c] = `rgb(var(--r-color-${key}-${c}))`
  }
  colors[key] = obj
}
const shortcuts = {
      // Legacy component integration shortcuts (keep for backward compatibility)
      'custom-colors': 'border dark:text-[var(--d-text)] text-[var(--l-text)] dark:bg-[var(--d-bg)] bg-[var(--l-bg)] dark:border-[var(--d-border)] border-[var(--l-border)] dark:hover:bg-[var(--d-bg-h)] hover:bg-[var(--l-bg-h)] hover:text-[var(--l-text-h)] dark:hover:text-[var(--d-text-h)] focus-visible:outline-[--l-outline] dark:focus-visible:outline-[--d-outline]',
      'custom-input-colors': 'border bg-[var(--l-bg)] dark:bg-[var(--d-bg)] text-[var(--l-text)] dark:text-[var(--d-text)] placeholder-[var(--l-placeholder)] dark:placeholder-[var(--d-placeholder)] border-[var(--l-border)] dark:border-[var(--d-border)] focus:border-[var(--l-border-f)] dark:focus:border-[var(--d-border-f)]',
    }
function rokuPresetImpl(): Preset {
  // Dynamic rules generator - replaces many static shortcuts
  const dynamicRules: Array<[RegExp, (match: RegExpMatchArray) => Record<string, string>]> = [

    // Standard color backgrounds: bg-{color}
    [/^bg-(primary|secondary|tertiary|success|error|info|warning)$/, ([, color]) => ({
      'background-color': `var(--r-${color}-background-color)`,
    })],

    // Standard color text: text-{color}
    [/^text-(dimmed|muted|default|highlight|inverted)$/, ([, variant]) => ({
      color: `var(--r-text-${variant})`,
    })],

    [/^bg-(base|container|elevated|inverted)$/, ([, variant]) => ({
      'background-color': `var(--r-bg-${variant})`,
    })],

    [/^border-(base|container|elevated|inverted)$/, ([, color]) => ({
      'border-color': `var(--r-border-${color})`,
    })],

    [/^text-(primary|secondary|tertiary|success|error|info|warning)$/, ([, color]) => ({
      color: `var(--r-text-${color})`,
    })],

    // Note: border-{color} handled via shortcuts below to avoid raw declarations
    // Standard color outlines: outline-{color}
    [/^outline-(primary|secondary|tertiary|error|info|warning)$/, ([, color]) => ({
      'outline-color': `var(--r-${color}-background-color)`,
    })],

  ]

  return {
    name: '@roku-ui/preset',
    content: {
      pipeline: {
        include: [/\.js$/],
      },
      filesystem: ['**/node_modules/@roku-ui/vue/dist/index.js'],
    },
    theme: {
      colors: {
        ...colors,
      },
    },
    safelist: ['rounded-[--r-rounded]'],
    rules: [
      // Dynamic rules replace many static shortcuts
      ...dynamicRules,
    ],
    shortcuts,
    presets: [
      presetWind4({
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
