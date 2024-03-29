<script setup lang="ts">
import { useRounded } from '../utils/classGenerator'

const props = withDefaults(defineProps<{
  value?: number | string
  max?: number | string
  min?: number | string
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
      return 'bg-primary-containerl'
    case 'secondary':
      return 'bg-secondary-containerl'
    case 'tertiary':
      return 'bg-tertiary-containerl'
    case 'error':
      return 'bg-error-containerl'
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
        width: `${(Number(value) - Number(min)) / (Number(max) - Number(min)) * 100}%`,
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
