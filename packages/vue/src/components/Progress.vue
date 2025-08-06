<script setup lang="ts">
import type { Color } from '@/types'
import { computed } from 'vue'
import { useContainerFilledCS, useSurfaceCS, useTheme } from '@/shared'
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
  size: undefined,
  color: undefined,
  rounded: 'full',
  loading: false,
})

const theme = useTheme()

// 创建带有 theme 默认值的有效 props
const effectiveProps = computed(() => ({
  ...props,
  size: props.size ?? theme.value.defaultSize,
  color: props.color ?? theme.value.defaultColor,
  rounded: props.rounded === 'full' ? 'full' : props.rounded ?? theme.value.rounded,
}))
const sizeCls = computed(() => {
  switch (effectiveProps.value.size) {
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
const color = computed(() => effectiveProps.value.color)
const containerFilledCS = useContainerFilledCS(color)
const surfaceVariantCS = useSurfaceCS('bg', { dark: 7, light: 3 })

const rounded = useRounded(effectiveProps.value)
</script>

<template>
  <div
    class="w-full self-center relative overflow-hidden"
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
