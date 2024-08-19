import typescript from '@rollup/plugin-typescript'
import css from 'rollup-plugin-import-css'
import nodeResolve from '@rollup/plugin-node-resolve'

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: 'src/index.tsx',
  output: [
    {
      file: './dist/index.cjs',
      format: 'cjs',
    },
    {
      file: './dist/index.mjs',
      format: 'es',
    },
  ],
  plugins: [
    css(),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
    nodeResolve({
      resolveOnly: [/@unocs+/],
    }),
  ],
}
