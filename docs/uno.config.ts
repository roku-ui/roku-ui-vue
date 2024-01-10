import fs from 'node:fs'
import { defineConfig } from 'unocss'
import { rokuPreset } from '@roku-ui/preset'

const file = fs.readFileSync('node_modules/@roku-ui/vue/dist/index.js', 'utf-8')

export default defineConfig({
  presets: [
    rokuPreset(),
  ],
  content: {
    inline: [file],
  },
})
