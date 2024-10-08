import fs from 'node:fs'
import { rokuPreset } from '@roku-ui/preset'
import { defineConfig } from 'unocss'

const file = fs.readFileSync('node_modules/@roku-ui/vue/dist/index.js', 'utf-8')

export default defineConfig({
  presets: [
    rokuPreset(),
  ],
  content: {
    inline: [file],
  },
})
