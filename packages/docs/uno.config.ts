import { existsSync } from 'node:fs'
import path from 'node:path'
import { rokuPreset } from '@roku-ui/preset'
import { defineConfig } from 'unocss'

// 在本地开发时，如果 workspace 下存在 preset 源码目录，则优先加入源码扫描，避免必须先 build preset。
const presetSrc = path.resolve(__dirname, '../preset/src')
const presetStyleFile = path.join(presetSrc, 'styles.css')
const presetEntryFile = path.join(presetSrc, 'index.tsx')

export default defineConfig(() => {
  const devPresetPaths = [] as string[]
  if (existsSync(presetSrc)) {
    devPresetPaths.push(presetSrc)
  }
  return {
    presets: [
      rokuPreset(),
    ],
    content: {
      pipeline: {
        include: [/\.(vue|svelte|[jt]sx|vine.ts|mdx?|astro|elm|php|phtml|html|js)($|\?)/],
      },
      filesystem: [
        '**/node_modules/@roku-ui/vue/dist/index.js',
        ...devPresetPaths,
      ],
    },
    // 监听 preset 源码关键入口与样式，变动后强制重新生成 preflights
    configDeps: [presetStyleFile, presetEntryFile],
  }
})
