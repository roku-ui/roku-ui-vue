import antfu, { GLOB_SRC, GLOB_VUE } from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    css: true,
    typescript: true,
    unocss: true,
    formatters: {
      html: true,
      markdown: true,
    },
  },
  [
    {
      files: [GLOB_VUE],
      name: 'jannchie:vue',
      rules: {
        'vue/max-attributes-per-line': ['error', {
          multiline: {
            max: 1,
          },
        }],
      },
    },
    {
      files: [GLOB_SRC, GLOB_VUE],
      name: 'jannchie:src',
      rules: {
        'curly': ['error', 'multi-line'],
        'import/no-mutable-exports': 'off',
        'style/brace-style': ['error', 'stroustrup', { allowSingleLine: false }],
      },
    },
  ],
)
