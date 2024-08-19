import { defineConfig } from 'unocss'
import { rokuPreset } from '@roku-ui/preset'

export default defineConfig({
  presets: [
    rokuPreset({}),
  ],
  shortcuts: {
    'theme-default': [
      'border dark:bg-[var(--d-surface-high)] light:bg-[var(--l-surface-high)] dark:border-[var(--d-surface-border)] light:border-[var(--l-surface-border)]',
    ],
    'theme-filled': [
      'border',
      'border-transparent',
      'dark:bg-[var(--d-fill)]',
      'dark:text-[var(--d-on-fill)]',
      'light:bg-[var(--l-fill)]',
      'light:text-[var(--l-on-fill)]',
    ],
    'theme-filled-hoverable': [
      'theme-filled',
      'hover:dark:bg-[var(--d-fill-h)]',
      'hover:light:bg-[var(--l-fill-h)]',
    ],
    'theme-outline': [
      'border',
      'dark:border-[var(--d-text)]',
      'dark:text-[var(--d-text)]',
      'light:border-[var(--l-text)]',
      'light:text-[var(--l-text)]',
    ],
    'theme-outline-hoverable': [
      'theme-outline',
      'hover:dark:bg-[var(--d-fill-t)]',
      'hover:light:bg-[var(--l-fill-t)]',
    ],
    'theme-light': [
      'border',
      'border-transparent',
      'dark:bg-[var(--d-fill-t)]',
      'dark:text-[var(--d-text)]',
      'light:bg-[var(--l-fill-t)]',
      'light:text-[var(--l-text)]',
    ],
    'theme-light-hoverable': [
      'theme-light',
      'hover:dark:bg-[var(--d-fill-t-h)]',
      'hover:light:bg-[var(--l-fill-t-h)]',
    ],
    'theme-transparent': [
      'border',
      'border-transparent',
      'bg-transparent',
      'dark:text-[var(--d-text)]',
      'light:text-[var(--l-text)]',
    ],
    'theme-subtle': [
      'theme-transparent',
      'hover:dark:bg-[var(--d-fill-t)]',
      'hover:light:bg-[var(--l-fill-t)]',
    ],
    'theme-contrast': [
      'theme-transparent',
      'hover:dark:bg-[var(--d-fill)]',
      'hover:light:bg-[var(--l-fill)]',
      'hover:dark:text-[var(--d-on-fill)]',
      'hover:light:text-[var(--l-on-fill)]',
    ],
    'theme-white': [
      'border',
      'border-transparent',
      'bg-white',
      'dark:text-[var(--d-text)]',
      'light:text-[var(--l-text)]',
    ],
  },
})
