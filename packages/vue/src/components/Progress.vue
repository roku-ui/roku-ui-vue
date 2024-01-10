<script setup lang="ts">
import { useRounded } from '../utils/classGenerator'

const props = withDefaults(defineProps<{
  value?: number
  max?: number
  min?: number
  size?: 'sm' | 'md' | 'lg'
  color?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
  loading?: boolean
}>(), {
  value: 0,
  max: 100,
  min: 0,
  size: 'md',
  color: 'primary',
  rounded: 'full',
  loading: false,
})
const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-0.25'
    case 'md':
      return 'h-0.5'
    case 'lg':
      return 'h-1'
  }
})

const colorCls = computed(() => {
  switch (props.color) {
    case 'primary':
      return 'bg-primary-container'
    case 'secondary':
      return 'bg-secondary-7'
    case 'tertiary':
      return 'bg-tertiary-7'
    case 'error':
      return 'bg-error-7'
  }
})

const rounded = useRounded(props)
</script>

<template>
  <div
    class="relative w-full self-center overflow-hidden bg-surface-high transition-background-color,border-color,color"
    :class="[sizeCls, rounded.class]"
    :style="[rounded.style]"
  >
    <div
      v-if="!loading"
      class="h-full"
      :class="[colorCls]"
      :style="[{
        width: `${(value - min) / (max - min) * 100}%`,
      }]"
    />
    <div
      v-else
      class="loading-progress h-full"
      :class="[colorCls]"
    />
  </div>
</template>

<style>
.loading-progress {
  animation: loading-progress 1s infinite;
}
@keyframes loading-progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
