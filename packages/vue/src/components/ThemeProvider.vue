<script setup lang="ts">
import type { ThemeData } from '..'

const props = defineProps<{
  theme?: ThemeData
  scheme?: string
}>()
const currentThemeData = useCurrentThemeData()
const styles = computed(() => useThemeStyles(props.theme ? props.theme : currentThemeData.value))
const scheme = computed(() => props.scheme ? props.scheme : useLocalStorage('scheme', 'light'))
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
