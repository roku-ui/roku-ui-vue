<script setup lang="ts">
import { type ThemeData, darkTheme } from '../utils'

const props = withDefaults(
  defineProps<{
    is?: string
    theme?: ThemeData
  }>(),
  {
    is: 'div',
    theme() {
      return darkTheme
    },
  },
)

provide('theme', props.theme)
</script>

<template>
  <component
    :is="is"
    :style="{
      '--r-color-surface-container-low': props.theme.surface.container.low,
      '--r-color-surface-container-base': props.theme.surface.container.base,
      '--r-color-surface-container-high': props.theme.surface.container.high,
      '--r-color-surface-on-base': props.theme.surface.on.base,
      '--r-color-surface-on-variant': props.theme.surface.on.variant,
      '--r-color-surface-outline-base': props.theme.surface.outline.base,
      '--r-color-surface-outline-variant': props.theme.surface.outline.variant,
      '--r-color-primary-container-base': props.theme.primary.container.base,
      '--r-color-primary-container-variant': props.theme.primary.container.variant,
      '--r-color-primary-on-base': props.theme.primary.on.base,
      '--r-color-primary-on-variant': props.theme.primary.on.variant,
      '--r-color-primary-outline-base': props.theme.primary.outline.base,
      '--r-color-primary-outline-variant': props.theme.primary.outline.variant,
      '--r-color-secondary-container-base': props.theme.secondary.container.base,
      '--r-color-secondary-container-variant': props.theme.secondary.container.variant,
      '--r-color-secondary-on-base': props.theme.secondary.on.base,
      '--r-color-secondary-on-variant': props.theme.secondary.on.variant,
      '--r-color-secondary-outline-base': props.theme.secondary.outline.base,
      '--r-color-secondary-outline-variant': props.theme.secondary.outline.variant,
      '--r-color-error-container-base': props.theme.error.container.base,
      '--r-color-error-container-variant': props.theme.error.container.variant,
      '--r-color-error-on-base': props.theme.error.on.base,
      '--r-color-error-on-variant': props.theme.error.on.variant,
      '--r-color-error-outline-base': props.theme.error.outline.base,
      '--r-color-error-outline-variant': props.theme.error.outline.variant,
    }"
  >
    <slot />
  </component>
</template>
