<script setup lang="ts">
import { computed } from 'vue'

export interface AppShellNavbarProps {
  padding?: string | number
  bordered?: boolean
  gap?: string | number
}

const props = withDefaults(defineProps<AppShellNavbarProps>(), {
  padding: '16px',
  bordered: true,
  gap: '12px',
})

const normalize = (value: string | number): string => typeof value === 'number' ? `${value}px` : value

const containerStyle = computed(() => ({
  padding: normalize(props.padding),
  gap: normalize(props.gap),
}))
</script>

<template>
  <div
    class="app-shell-navbar flex flex-col h-full min-h-full w-full box-border"
    :class="props.bordered ? 'border-r border-surface' : null"
    :style="containerStyle"
  >
    <slot />
  </div>
</template>
