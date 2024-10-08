<script setup lang="ts">
import type { ThemeData } from '..'
import { computed } from 'vue'

const props = defineProps<{
  theme?: ThemeData
  scheme?: string
}>()
const currentThemeData = useCurrentThemeData()
const styles = computed(() => useThemeStyles(props.theme ? props.theme : currentThemeData.value))
const localStorageScheme = useLocalStorage('scheme', 'light')
const scheme = computed(() => props.scheme ? props.scheme : localStorageScheme.value)
</script>

<template>
  <div
    :style="[styles]"
    :data-scheme="scheme"
    :data-theme="currentThemeData.name"
  >
    <slot />
  </div>
</template>
