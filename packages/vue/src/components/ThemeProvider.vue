<script setup lang="ts">
import type { ThemeData } from '..'

const props = defineProps<{
  theme: ThemeData
}>()
const styles = useThemeStyles(props.theme, false)
</script>

<template>
  <div :style="[styles]">
    <slot />
  </div>
</template>
