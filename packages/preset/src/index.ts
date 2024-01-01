import {
  presetIcons,
  presetTypography,
  presetUno,
} from 'unocss'
import type { Preset } from 'unocss'

import reset from '@unocss/reset/tailwind.css'

const colorKeys = ['surface', 'primary', 'secondary', 'tertiary', 'error']
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

const rokuPreset: () => Preset<object> = () => () => {
  return {
    name: 'roku',
    theme: {
      colors: {
        ...colors,
      },
    },

    safelist: ['rounded-[var(--r-rounded)]'],
    shortcuts: {
      ...shortcuts,
      'container-default': 'bg-surface-base border-surface-border border text-surface-on transition-background-color,border-color,color',
      'btn-default': 'container-default enabled:hover:bg-surface-high transition-background-color,border-color,color',
    },
    presets: [
      presetUno({
        dark: {
          dark: '[data-theme="dark"]',
          light: '[data-theme="light"]',
        },
      }),
      presetTypography(),
      presetIcons({
        scale: 1.2,
        extraProperties: {
          'display': 'inline-block',
          'vertical-align': 'middle',
        },
      }),
    ],
    preflights: [
      { getCSS: () => reset },
      {
        getCSS: () => `:root[data-theme="dark"] {
    color-scheme: dark;
}

:root[data-theme="light"] {
    color-scheme: light;
}

[data-theme="dark"] *, [data-theme="dark"]  {
    color-scheme: dark;
    --r-color-surface-on: var(--r-color-surface-3);
    --r-color-surface-oninverted: var(--r-color-surface-8);
    --r-color-surface-onlow: var(--r-color-surface-4);
    --r-color-surface-onlowinverted: var(--r-color-surface-7);

    --r-color-surface-lowest: var(--r-color-surface-9);
    --r-color-surface-low: var(--r-color-surface-9);
    --r-color-surface-base: var(--r-color-surface-8);
    --r-color-surface-high: var(--r-color-surface-7);
    --r-color-surface-highest: var(--r-color-surface-6);
    --r-color-surface-border: var(--r-color-surface-7);

    --r-color-primary-container: var(--r-color-primary-8);
    --r-color-secondary-container: var(--r-color-secondary-8);
    --r-color-tertiary-container: var(--r-color-tertiary-8);
    --r-color-error-container: var(--r-color-error-8);

    --r-color-primary-containerd: var(--r-color-primary-9);
    --r-color-secondary-containerd: var(--r-color-secondary-9);
    --r-color-tertiary-containerd: var(--r-color-tertiary-9);
    --r-color-error-containerd: var(--r-color-error-9);

    --r-color-primary-containerl: var(--r-color-primary-6);
    --r-color-secondary-containerl: var(--r-color-secondary-6);
    --r-color-tertiary-containerl: var(--r-color-tertiary-6);
    --r-color-error-containerl: var(--r-color-error-6);
}

[data-theme="light"] *, [data-theme="light"] {
    color-scheme: light;
    --r-color-surface-on: var(--r-color-surface-7);
    --r-color-surface-oninverted: var(--r-color-surface-2);
    --r-color-surface-onlow: var(--r-color-surface-6);
    --r-color-surface-onlowinverted: var(--r-color-surface-3);

    --r-color-surface-lowest: var(--r-color-surface-3);
    --r-color-surface-low: var(--r-color-surface-2);
    --r-color-surface-base: var(--r-color-surface-1);
    --r-color-surface-high: var(--r-color-surface-0);
    --r-color-surface-highest: var(--r-color-surface-0);
    --r-color-surface-border: var(--r-color-surface-4);

    --r-color-primary-container: var(--r-color-primary-6);
    --r-color-secondary-container: var(--r-color-secondary-6);
    --r-color-tertiary-container: var(--r-color-tertiary-6);
    --r-color-error-container: var(--r-color-error-6);

    --r-color-primary-containerd: var(--r-color-primary-7);
    --r-color-secondary-containerd: var(--r-color-secondary-7);
    --r-color-tertiary-containerd: var(--r-color-tertiary-7);
    --r-color-error-containerd: var(--r-color-error-7);

    --r-color-primary-containerl: var(--r-color-primary-4);
    --r-color-secondary-containerl: var(--r-color-secondary-4);
    --r-color-tertiary-containerl: var(--r-color-tertiary-4);
    --r-color-error-containerl: var(--r-color-error-4);
}

:root * {
    --r-color-primary-on: var(--r-color-primary-0);
    --r-color-primary-oninverted: var(--r-color-primary-10);
    --r-color-primary-onlow: var(--r-color-primary-1);
    --r-color-primary-onlowinverted: var(--r-color-primary-9);

    --r-color-secondary-on: var(--r-color-secondary-0);
    --r-color-secondary-oninverted: var(--r-color-secondary-10);
    --r-color-secondary-onlow: var(--r-color-secondary-1);
    --r-color-secondary-onlowinverted: var(--r-color-secondary-9);

    --r-color-tertiary-on: var(--r-color-tertiary-0);
    --r-color-tertiary-oninverted: var(--r-color-tertiary-10);
    --r-color-tertiary-onlow: var(--r-color-tertiary-1);
    --r-color-tertiary-onlowinverted: var(--r-color-tertiary-9);

    --r-color-error-on: var(--r-color-error-0);
    --r-color-error-oninverted: var(--r-color-error-10);
    --r-color-error-onlow: var(--r-color-error-1);
    --r-color-error-onlowinverted: var(--r-color-error-9);
}

:root {
    color-scheme: light dark;
}`,
      },
    ],
  }
}
export { rokuPreset }
