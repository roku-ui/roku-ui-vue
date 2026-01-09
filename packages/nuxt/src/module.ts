import type { UserConfig } from 'unocss'
import { existsSync } from 'node:fs'
import { addComponent, createResolver, defineNuxtModule, logger } from '@nuxt/kit'
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
  async setup(options, nuxt) {
    const prefix = options.prefix ?? 'R'
    const moduleResolver = createResolver(import.meta.url)
    const appResolver = createResolver(nuxt.options.rootDir)

    const resolvePackagePath = async (id: string): Promise<string> => {
      const appPath = await appResolver.resolvePath(id, { fallbackToOriginal: true })
      if (existsSync(appPath)) {
        return appPath
      }

      const modulePath = await moduleResolver.resolvePath(id, { fallbackToOriginal: true })
      if (existsSync(modulePath)) {
        return modulePath
      }

      return id
    }

    const vueEntry = await resolvePackagePath('@roku-ui/vue')
    const cssEntry = await resolvePackagePath('@roku-ui/vue/style.css')

    if (vueEntry === '@roku-ui/vue') {
      logger.warn('[roku-ui] Failed to resolve @roku-ui/vue. Please install @roku-ui/vue.')
    }

    if (cssEntry === '@roku-ui/vue/style.css') {
      logger.warn('[roku-ui] Failed to resolve @roku-ui/vue/style.css. Please install @roku-ui/vue.')
    }

    for (const component of components) {
      addComponent({
        name: `${prefix}${component}`,
        export: component,
        filePath: vueEntry,
        global: true,
      })
    }

    const css = nuxt.options.css ?? []
    const cssToken = '@roku-ui/vue/style.css'
    const cssIndex = css.indexOf(cssToken)
    if (cssIndex === -1) {
      if (!css.includes(cssEntry)) {
        css.push(cssEntry)
      }
    }
    else if (cssEntry !== cssToken) {
      css.splice(cssIndex, 1, cssEntry)
    }
    nuxt.options.css = css

    const transpile = nuxt.options.build.transpile ?? []
    if (!transpile.includes('@roku-ui/vue')) {
      transpile.push('@roku-ui/vue')
      nuxt.options.build.transpile = transpile
    }

    nuxt.hook('prepare:types', ({ references }) => {
      references.push({
        path: moduleResolver.resolve('./module.d.ts'),
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
