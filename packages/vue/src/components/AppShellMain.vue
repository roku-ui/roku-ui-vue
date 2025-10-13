<script setup lang="ts">
import { computed } from 'vue'

export interface AppShellMainProps {
  padding?: string | number
  gap?: string | number
  scrollable?: boolean
}

const props = withDefaults(defineProps<AppShellMainProps>(), {
  padding: '24px',
  gap: '16px',
  scrollable: false,
})

const normalize = (value: string | number): string => typeof value === 'number' ? `${value}px` : value

const containerStyle = computed(() => ({
  padding: normalize(props.padding),
  gap: normalize(props.gap),
}))
</script>

<template>
  <div
    class="app-shell-main flex flex-col min-h-full w-full box-border"
    :class="props.scrollable ? 'overflow-y-auto' : null"
    :style="containerStyle"
  >
    <slot />
  </div>
</template>
