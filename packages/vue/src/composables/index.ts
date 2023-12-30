export function useCurrentTheme() {
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
