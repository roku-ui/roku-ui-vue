<script setup lang="ts">
import type { ThemeData } from '@/shared'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import { useThemeStyles } from '@/composables'
import { useTheme } from '@/shared'

const props = defineProps<{
  theme?: ThemeData
  scheme?: string
}>()
const currentTheme = useTheme()
const styles = computed(() => useThemeStyles(props.theme || currentTheme.value))
const localStorageScheme = useLocalStorage('scheme', 'light')
const scheme = computed(() => props.scheme || localStorageScheme.value)
</script>

<template>
  <div
    :style="[styles]"
    :data-scheme="scheme"
    data-theme="default"
  >
    <slot />
  </div>
</template>
