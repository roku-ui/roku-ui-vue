import tinycolor from 'tinycolor2'
import { type ThemeData, darkTheme } from '..'

export function useRootTheme() {
  if (typeof window === 'undefined') {
    return ref('dark')
  }
  const theme = ref(document.documentElement.dataset.scheme)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-scheme') {
        theme.value = document.documentElement.dataset.scheme
      }
    })
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-scheme'],
  })
  return theme
}

export function useCurrentThemeScheme() {
  return inject<Ref<string> | null>('currentThemeScheme', null)
}

export function useCurrentTheme() {
  return inject<Ref<ThemeData>>('currentTheme', ref(darkTheme))
}

export function useThemeStyles(theme: ThemeData, root: boolean = true) {
  const currentTheme = ref(theme)
  const currentThemeScheme = ref<string>(theme.scheme)
  const rootTheme = useRootTheme()
  watchEffect(() => {
    if (rootTheme.value) {
      currentThemeScheme.value = rootTheme.value
    }
  })
  provide('currentTheme', currentTheme)
  provide('currentThemeScheme', currentThemeScheme)

  type KeyOfThemeColors = keyof typeof currentTheme.value.colors
  const colorVars = Object.keys(currentTheme.value.colors).map((key) => {
    const color = key as KeyOfThemeColors
    const colorValue = currentTheme.value.colors[color]
    return colorValue.reduce((acc, cur, idx) => {
      const c = tinycolor(cur).toRgb()
      acc[`--r-color-${color}-${idx}`] = `${c.r} ${c.g} ${c.b}`
      return acc
    }, {} as Record<string, string>)
  }).reduce((acc, cur) => {
    return {
      ...acc,
      ...cur,
    }
  }, {} as Record<string, string>)

  const colorStyles = {
    ...colorVars,
  }
  const themeStyles = {
    'font-family': '\'Roboto\', sans-serif',
    'background-color': 'rgb(var(--r-color-surface-lowest))',
    'color': 'rgb(var(--r-color-surface-on))',
  }

  const schemeStyles = computed(() => {
    if (root) {
      return {}
    }
    const { scheme } = theme
    switch (scheme) {
      case 'dark':
        return {
          'colorScheme': 'dark',
          '--r-color-surface-on': 'var(--r-color-surface-3)',
          '--r-color-surface-oninverted': 'var(--r-color-surface-8)',
          '--r-color-surface-onlow': 'var(--r-color-surface-4)',
          '--r-color-surface-onlowinverted': 'var(--r-color-surface-7)',
          '--r-color-surface-lowest': 'var(--r-color-surface-10)',
          '--r-color-surface-low': 'var(--r-color-surface-9)',
          '--r-color-surface-base': 'var(--r-color-surface-8)',
          '--r-color-surface-high': 'var(--r-color-surface-7)',
          '--r-color-surface-highest': 'var(--r-color-surface-6)',
          '--r-color-surface-border': 'var(--r-color-surface-7)',
          '--r-color-primary-container': 'var(--r-color-primary-8)',
          '--r-color-secondary-container': 'var(--r-color-secondary-8)',
          '--r-color-tertiary-container': 'var(--r-color-tertiary-8)',
          '--r-color-error-container': 'var(--r-color-error-8)',
          '--r-color-primary-containerd': 'var(--r-color-primary-9)',
          '--r-color-secondary-containerd': 'var(--r-color-secondary-9)',
          '--r-color-tertiary-containerd': 'var(--r-color-tertiary-9)',
          '--r-color-error-containerd': 'var(--r-color-error-9)',
          '--r-color-primary-containerl': 'var(--r-color-primary-6)',
          '--r-color-secondary-containerl': 'var(--r-color-secondary-6)',
          '--r-color-tertiary-containerl': 'var(--r-color-tertiary-6)',
          '--r-color-error-containerl': 'var(--r-color-error-6)',
        }
      case 'light':
        return {
          'colorScheme': 'light',
          '--r-color-surface-on': 'var(--r-color-surface-7)',
          '--r-color-surface-oninverted': 'var(--r-color-surface-2)',
          '--r-color-surface-onlow': 'var(--r-color-surface-6)',
          '--r-color-surface-onlowinverted': 'var(--r-color-surface-3)',
          '--r-color-surface-lowest': 'var(--r-color-surface-3)',
          '--r-color-surface-low': 'var(--r-color-surface-2)',
          '--r-color-surface-base': 'var(--r-color-surface-1)',
          '--r-color-surface-high': 'var(--r-color-surface-0)',
          '--r-color-surface-highest': 'var(--r-color-surface-0)',
          '--r-color-surface-border': 'var(--r-color-surface-4)',
          '--r-color-primary-container': 'var(--r-color-primary-6)',
          '--r-color-secondary-container': 'var(--r-color-secondary-6)',
          '--r-color-tertiary-container': 'var(--r-color-tertiary-6)',
          '--r-color-error-container': 'var(--r-color-error-6)',
          '--r-color-primary-containerd': 'var(--r-color-primary-7)',
          '--r-color-secondary-containerd': 'var(--r-color-secondary-7)',
          '--r-color-tertiary-containerd': 'var(--r-color-tertiary-7)',
          '--r-color-error-containerd': 'var(--r-color-error-7)',
          '--r-color-primary-containerl': 'var(--r-color-primary-4)',
          '--r-color-secondary-containerl': 'var(--r-color-secondary-4)',
          '--r-color-tertiary-containerl': 'var(--r-color-tertiary-4)',
          '--r-color-error-containerl': 'var(--r-color-error-4)',
        }
    }
  })
  return {
    ...colorStyles,
    ...themeStyles,
    ...schemeStyles.value,
  }
}

export function useId(props: { id?: string }) {
  const id = ref('')
  onMounted(() => {
    if (props.id) {
      id.value = props.id
    }
    else {
      id.value = `switch-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`
    }
  })
  return id
}
