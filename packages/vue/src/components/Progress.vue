<script setup lang="ts">
import type { Color } from '@/types'
import { computed } from 'vue'
import { useContainerFilledCS, useSurfaceCS } from '@/shared'
import { useRounded } from '@/utils/classGenerator'

const props = withDefaults(defineProps<{
  value?: number | string
  max?: number | string
  min?: number | string
  size?: 'sm' | 'md' | 'lg'
  color?: Color
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
    case 'sm': {
      return 'h-0.25'
    }
    case 'md': {
      return 'h-0.5'
    }
    case 'lg': {
      return 'h-1'
    }
    default: {
      return 'h-0.5'
    }
  }
})
const color = computed(() => props.color)
const containerFilledCS = useContainerFilledCS(color)
const surfaceVariantCS = useSurfaceCS('bg', { dark: 7, light: 3 })

const rounded = useRounded(props)
</script>

<template>
  <div
    class="relative w-full self-center overflow-hidden"
    :class="[sizeCls, rounded.class]"
    :style="[rounded.style]"
    v-bind="surfaceVariantCS"
  >
    <div
      v-if="!loading"
      class="h-full"
      v-bind="containerFilledCS"
      :style="[{
        width: `${(Number(value) - Number(min)) / (Number(max) - Number(min)) * 100}%`,
      }]"
    />
    <div
      v-else
      class="loading-progress h-full"
      v-bind="containerFilledCS"
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
