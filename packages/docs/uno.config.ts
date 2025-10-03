import { rokuPreset } from '@roku-ui/preset'
import { defineConfig } from 'unocss'

// 在本地开发时，如果 workspace 下存在 preset 源码目录，则优先加入源码扫描，避免必须先 build preset。

export default defineConfig({
  presets: [
    rokuPreset(),
  ],
  content: {
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx|vine.ts|mdx?|astro|elm|php|phtml|html|js)($|\?)/],
    },
    filesystem: [
      '**/node_modules/@roku-ui/vue/dist/index.js',
    ],
  },
})
