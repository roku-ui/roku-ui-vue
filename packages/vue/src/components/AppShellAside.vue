<script setup lang="ts">
import { computed } from 'vue'

export interface AppShellAsideProps {
  padding?: string | number
  bordered?: boolean
  gap?: string | number
}

const props = withDefaults(defineProps<AppShellAsideProps>(), {
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
    class="app-shell-aside flex flex-col h-full min-h-full w-full box-border"
    :class="props.bordered ? 'border-l border-surface' : null"
    :style="containerStyle"
  >
    <slot />
  </div>
</template>
