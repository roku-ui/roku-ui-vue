<script setup lang="ts">
import { computed } from 'vue'

export interface AppShellFooterProps {
  padding?: string | number
  bordered?: boolean
  align?: 'start' | 'center' | 'end' | 'between'
}

const props = withDefaults(defineProps<AppShellFooterProps>(), {
  padding: '16px',
  bordered: true,
  align: 'start',
})

const normalize = (value: string | number): string => typeof value === 'number' ? `${value}px` : value

const containerStyle = computed(() => ({
  padding: normalize(props.padding),
}))

const alignmentClass = computed(() => {
  if (props.align === 'center') {
    return 'justify-center'
  }
  if (props.align === 'end') {
    return 'justify-end'
  }
  if (props.align === 'between') {
    return 'justify-between'
  }
  return 'justify-start'
})
</script>

<template>
  <div
    class="app-shell-footer flex gap-2 h-full w-full items-center box-border"
    :class="[
      props.bordered ? 'border-t border-surface' : null,
      alignmentClass,
    ]"
    :style="containerStyle"
  >
    <slot />
  </div>
</template>
