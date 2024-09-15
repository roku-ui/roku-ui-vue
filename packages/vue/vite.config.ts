import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import AutoExport from 'unplugin-auto-export/vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    dts(),
    Components({
      dirs: ['./src/components'],
      dts: './src/components.d.ts',
    }),
    AutoImport({
      imports: [
        '@vueuse/core',
      ],
      dirs: [
        './src/composables',
        './src/locale',
      ],
      dts: './src/auto-import.d.ts',
    }),
    AutoExport({
      path: ['./src/components/**/*'],
      extname: 'ts',
    }),
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
    target: 'modules',
  },
})
