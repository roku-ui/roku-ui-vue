import { rokuPreset } from '@roku-ui/preset'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    rokuPreset(),
  ],
  content: {
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx|vine.ts|mdx?|astro|elm|php|phtml|html|js)($|\?)/],
    },
    filesystem: ['**/node_modules/@roku-ui/vue/dist/index.js'],
  },
})
