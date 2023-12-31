<script setup lang="ts">
import { isClient } from '@vueuse/core'
import { darkTheme, lightTheme } from '../utils'
import type { ThemeData } from '../utils'

const props = withDefaults(
  defineProps<{
    is?: string
    theme?: ThemeData
  }>(),
  {
    is: 'div',
    theme() {
      if (typeof window === 'undefined') {
        return darkTheme
      }
      return document.documentElement.dataset.theme === 'dark' ? darkTheme : lightTheme
    },
  },
)

// ------------------------------
// Calculate scrollbar width, and keep it updated
const scrollbarWidth = ref(0)
const currentScrollbar = ref(0)
if (isClient) {
  const resizeObserver = new ResizeObserver(() => {
    const curWidth = window.innerWidth - document.body.clientWidth
    if (curWidth !== 0) {
      scrollbarWidth.value = curWidth
    }
    currentScrollbar.value = curWidth
  })

  resizeObserver.observe(document.body)
}
const paddingRight = computed(() => {
  if (currentScrollbar.value === scrollbarWidth.value) {
    return `0px`
  }
  else {
    return `${scrollbarWidth.value}px`
  }
})
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
