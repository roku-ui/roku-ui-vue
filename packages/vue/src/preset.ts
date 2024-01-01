import { themeColors } from './utils/theme'

const colorKeys = Object.keys(themeColors) as string[]
const colors = colorKeys.reduce<Record<string, any>>((colors, key) => {
  colors[key] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(c => `rgb(var(--r-color-${key}-${c}))`).reduce((pre, cur, i) => {
    pre[i] = cur
    return pre
  }, {} as any)

  if (key === 'surface') {
    ['lowest', 'low', 'base', 'high', 'highest', 'on', 'oninverted', 'onlow', 'onlowinverted', 'border'].forEach((k) => {
      colors[key][k] = `rgb(var(--r-color-${key}-${k}))`
    })
  }
  else {
    ['container', 'containerd', 'containerl', 'on'].forEach((k) => {
      colors[key][k] = `rgb(var(--r-color-${key}-${k}))`
    })
  }
  return colors
}, {})

const shortcuts = colorKeys.filter(d => d !== 'surface').reduce((shortcuts, key) => {
  shortcuts[`container-filled-${key}`] = `bg-${key}-container`
  shortcuts[`btn-filled-${key}`] = `container-filled-${key} enabled:hover:bg-${key}-containerd text-${key}-on`
  shortcuts[`container-light-${key}`] = `bg-${key}-container/10`
  shortcuts[`btn-light-${key}`] = `container-light-${key} hover:bg-${key}-6/25 text-${key}-container`
  shortcuts[`container-outline-${key}`] = `border-${key}-container border text-${key}-container`
  shortcuts[`btn-outline-${key}`] = `container-outline-${key} hover:bg-${key}-container/10 text-${key}-container`
  shortcuts[`container-subtle-${key}`] = `bg-${key}-container/0`
  shortcuts[`btn-subtle-${key}`] = `container-subtle-${key} hover:bg-${key}-container/10 text-${key}-container`
  shortcuts[`container-transparent-${key}`] = `bg-transparent text-${key}-container`
  shortcuts[`btn-transparent-${key}`] = `container-transparent-${key} hover:text-${key}-containerl`
  shortcuts[`container-constrast-${key}`] = `text-${key}-container`
  shortcuts[`btn-constrast-${key}`] = `container-constrast-${key} hover:text-surface-base hover:bg-${key}-container`
  return shortcuts
}, {} as any)

function rokuPreset() {
  return {
    name: 'roku',
    theme: {
      colors: {
        ...colors,
      },
    },
    shortcuts: {
      ...shortcuts,
      'container-default': 'bg-surface-base border-surface-border border text-surface-on transition-background-color,border-color,color',
      'btn-default': 'container-default enabled:hover:bg-surface-high transition-background-color,border-color,color',
    },
    presets: [

    ],
    content: {
      pipeline: {
        include: [
          /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
          /@roku-ui/,
        ],
      },
    },
  }
}
export { rokuPreset }
