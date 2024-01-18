<script setup lang="ts">
import { isClient } from '@vueuse/core'
import { darkTheme, lightTheme } from '../utils'
import type { ThemeData } from '../utils'

const props = withDefaults(
  defineProps<{
    is?: string | Component
    theme?: ThemeData
  }>(),
  {
    is: 'div',
    theme() {
      if (typeof window === 'undefined') {
        return darkTheme
      }
      return document.documentElement.dataset.scheme === 'dark' ? darkTheme : lightTheme
    },
  },
)

// ------------------------------
// Calculate scrollbar width, and keep it updated
const scrollbarWidth = ref(0)
const currentScrollbar = ref(0)

const scheme = ref<string | undefined>(props.theme.scheme)
if (isClient) {
  const resizeObserver = new ResizeObserver(() => {
    const curWidth = window.innerWidth - document.body.clientWidth
    if (curWidth !== 0) {
      scrollbarWidth.value = curWidth
    }
    currentScrollbar.value = curWidth
  })

  resizeObserver.observe(document.body)
  const observer = new MutationObserver(() => {
    if (scheme.value !== document.documentElement.dataset.scheme) {
      scheme.value = document.documentElement.dataset.scheme
    }
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-scheme'],
  })
}
const paddingRight = computed(() => {
  if (currentScrollbar.value === scrollbarWidth.value) {
    return `0px`
  }
  else {
    return `${scrollbarWidth.value}px`
  }
})

const preferScheme = usePreferredColorScheme()

watchEffect(() => {
  if (scheme.value === 'dark') {
    document.documentElement.dataset.scheme = 'dark'
  }
  else if (scheme.value === 'light') {
    document.documentElement.dataset.scheme = 'light'
  }
  else if (preferScheme.value === 'dark') {
    document.documentElement.dataset.scheme = 'dark'
  }
  else {
    document.documentElement.dataset.scheme = 'light'
  }
  localStorage.setItem('scheme', document.documentElement.dataset.scheme)
})

provide(schemeSymbol, scheme)

// ------------------------------
const styles = useThemeStyles(props.theme)
</script>

<template>
  <component
    :is="is"
    :style="[
      styles,
      { paddingRight },
    ]"
    class="text-surface-on transition-background-color,border-color,color"
  >
    <slot />
  </component>
</template>
