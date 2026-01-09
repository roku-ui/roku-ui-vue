import { addComponent, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { UserConfig } from 'unocss'
import { rokuPreset } from '@roku-ui/preset'

export interface RokuUiNuxtOptions {
  /**
   * Prefix applied to every auto-registered component.
   * Defaults to `R`.
   */
  prefix?: string
}

const components = [
  'AppShell',
  'AppShellAside',
  'AppShellFooter',
  'AppShellHeader',
  'AppShellMain',
  'AppShellNavbar',
  'AspectRatio',
  'AutoHeightTransition',
  'Avatar',
  'Btn',
  'BtnGroup',
  'Calendar',
  'CalendarInput',
  'ChatContainer',
  'ChatMessage',
  'ChatSystem',
  'Checkbox',
  'Chip',
  'ColorInput',
  'ColorSwatch',
  'Drawer',
  'Dropzone',
  'FullscreenOverlay',
  'Icon',
  'Image',
  'Indicator',
  'Menu',
  'MenuItem',
  'Modal',
  'ModalSystem',
  'Notification',
  'NotificationSystem',
  'NumberField',
  'Overlay',
  'Paper',
  'PinInput',
  'Popover',
  'Progress',
  'Rating',
  'RokuProvider',
  'SchemeSwitch',
  'ScrollArea',
  'Select',
  'SelectArea',
  'Slider',
  'Step',
  'Switch',
  'TabItem',
  'Tabs',
  'Tag',
  'TextField',
  'ThemeProvider',
  'Tooltip',
  'TreeList',
  'VirtualWaterfall',
  'Waterfall',
] as const

export default defineNuxtModule<RokuUiNuxtOptions>({
  meta: {
    name: '@roku-ui/nuxt',
    configKey: 'rokuUi',
  },
  defaults: {
    prefix: 'R',
  },
  setup(options, nuxt) {
    const prefix = options.prefix ?? 'R'
    const { resolve } = createResolver(import.meta.url)

    for (const component of components) {
      addComponent({
        name: `${prefix}${component}`,
        export: component,
        filePath: '@roku-ui/vue',
        global: true,
      })
    }

    const css = nuxt.options.css ?? []
    if (!css.includes('@roku-ui/vue/style.css')) {
      css.push('@roku-ui/vue/style.css')
      nuxt.options.css = css
    }

    const transpile = nuxt.options.build.transpile ?? []
    if (!transpile.includes('@roku-ui/vue')) {
      transpile.push('@roku-ui/vue')
      nuxt.options.build.transpile = transpile
    }

    nuxt.hook('prepare:types', ({ references }) => {
      references.push({
        path: resolve('./module.d.ts'),
      })
    })

    nuxt.hook('unocss:config', (config: UserConfig) => {
      const presets = config.presets || []
      const filteredPresets = presets.filter((preset) => {
        const name = (preset as { name?: string }).name
        return !(name && name.startsWith('preset-wind'))
      })
      config.presets = filteredPresets
      const hasRokuPreset = config.presets.some((preset) => {
        const name = (preset as { name?: string }).name
        return name === '@roku-ui/preset'
      })
      if (!hasRokuPreset) {
        config.presets.push(rokuPreset())
      }
    })
  },
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    rokuUi?: RokuUiNuxtOptions
  }

  interface NuxtOptions {
    rokuUi?: RokuUiNuxtOptions
  }

  interface NuxtHooks {
    'unocss:config': (config: UserConfig) => void
  }
}
