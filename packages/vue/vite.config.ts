import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import AutoExport from 'unplugin-auto-export/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import roku from './src/vite/index'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS(),
    dts(),
    AutoExport({
      path: ['./src/components/**/*'],
      extname: 'ts',
    }),
    roku(),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'roku-ui',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
