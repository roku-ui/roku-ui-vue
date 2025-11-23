import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import AutoExport from 'unplugin-auto-export/vite'
import { defineConfig, type UserConfig } from 'vite'
import dts from 'vite-plugin-dts'
import roku from './src/vite/index'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// https://vitejs.dev/config/
// 为了在开发时修改 preset 后立即生效，我们在 dev 模式下把
// @roku-ui/preset 指向其源码目录 (packages/preset/src)，避免每次手动 build。
// 生产构建 (vite build) 仍使用打包后的 dist，确保发布行为不变。
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve' || mode === 'development'
  const libConfig: UserConfig = {
    plugins: [
      vue(),
      vueJsx(),
      UnoCSS(),
      // Generate type declarations for library consumers
      dts({
        entryRoot: 'src',
        include: ['src'],
        cleanVueFileName: true,
        copyDtsFiles: false,
        staticImport: true,
        outDir: 'dist',
        insertTypesEntry: true,
      }),
      dts({ tsconfigPath: './tsconfig.app.json' }),
      AutoExport({
        path: ['./src/components/**/*'],
        extname: 'ts',
      }),
      roku(),
    ],
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'roku-ui',
        formats: ['es', 'umd'],
        fileName: (format) => format === 'umd' ? 'index.umd.cjs' : 'index.js',
      },
      rollupOptions: {
        external: ['vue', '@vueuse/core', '@vueuse/shared'],
        output: {
          globals: {
            vue: 'Vue',
            '@vueuse/core': '__vueuse_core',
            '@vueuse/shared': '__vueuse_shared',
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'style.css'
            }

            return assetInfo.name ?? '[name][extname]'
          },
        },
      },
      target: 'esnext',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        // 仅在开发模式下覆盖到源码，避免发布时缺 dist 导致报错
        ...(isDev
          ? {
              '@roku-ui/preset': path.resolve(__dirname, '../preset/src'),
            }
          : {}),
      },
    },
  }

  return libConfig
})
