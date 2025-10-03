import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { rokuPreset } from '@roku-ui/preset'
import { defineConfig } from 'unocss'

// 绝对路径：指向 preset 源码目录，用于开发时热更新
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const presetSrcRoot = path.resolve(__dirname, '../preset/src')
const presetStyleFile = path.join(presetSrcRoot, 'styles.css')
const presetEntryFile = path.join(presetSrcRoot, 'index.tsx')

export default defineConfig({
  // 这些文件变化时，强制让 UnoCSS 重新计算（重启其内部生成流程）
  configDeps: [presetStyleFile, presetEntryFile],
  content: {
    // 增加 preset 源码到扫描范围，保证内部字符串/规则变化时触发
    filesystem: [
      `${presetSrcRoot}/**/*.ts`,
      `${presetSrcRoot}/**/*.tsx`,
      `${presetSrcRoot}/**/*.css`,
    ],
  },
  presets: [rokuPreset()],
})
