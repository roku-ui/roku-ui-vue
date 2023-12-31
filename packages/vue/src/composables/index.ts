export function useRootTheme() {
  if (typeof window === 'undefined') {
    return ref('dark')
  }
  const theme = ref(document.documentElement.dataset.theme)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        theme.value = document.documentElement.dataset.theme
      }
    })
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
  return theme
}

export function useCurrentThemeScheme() {
  return inject<Ref<string> | null>('currentThemeScheme', null)
}
