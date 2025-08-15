import jannchie from '@jannchie/eslint-config'

export default jannchie(
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
  {
    rules: {
      'style/indent-binary-ops': 'off',
      'style/indent': 'off',
    },
  },
)
