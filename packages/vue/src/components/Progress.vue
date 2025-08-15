<script setup lang="ts">
import type { Color } from '@/types'
import { computed } from 'vue'
import { useContainerFilledCS, useSurfaceCS, useTheme } from '@/shared'
import { useRounded } from '@/utils/classGenerator'

interface ProgressSection {
  value: number | string
  color?: Color
}

const props = withDefaults(defineProps<{
  value?: number | string
  max?: number | string
  min?: number | string
  size?: 'sm' | 'md' | 'lg'
  color?: Color
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
  loading?: boolean
  sections?: ProgressSection[]
}>(), {
  value: 0,
  max: 100,
  min: 0,
  size: undefined,
  color: undefined,
  rounded: 'full',
  loading: false,
  sections: undefined,
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
      return 'h-1'
    }
    case 'md': {
      return 'h-2'
    }
    case 'lg': {
      return 'h-4'
    }
    default: {
      return 'h-2'
    }
  }
})
const color = computed(() => effectiveProps.value.color)
const containerFilledCS = useContainerFilledCS(color)
const surfaceVariantCS = useSurfaceCS('bg', { dark: 7, light: 3 })

const rounded = useRounded(effectiveProps.value)


// 计算堆叠进度条的sections
const normalizedSections = computed(() => {
  if (props.sections) {
    let currentPosition = 0
    const range = Number(props.max) - Number(props.min)
    return props.sections.map((section, index) => {
      const sectionValue = Number(section.value)
      const width = (sectionValue / range) * 100
      const left = currentPosition
      currentPosition += width
      
      const sectionColor = section.color ?? effectiveProps.value.color
      
      return {
        ...section,
        width,
        left,
        color: sectionColor,
        id: `section-${index}`,
      }
    })
  }
  return null
})
</script>

<template>
  <div
    class="w-full self-center relative overflow-hidden"
    :class="[sizeCls, rounded.class]"
    :style="[rounded.style]"
    v-bind="surfaceVariantCS"
  >
    <!-- 堆叠进度条模式 -->
    <template v-if="normalizedSections && !loading">
      <div
        v-for="section in normalizedSections"
        :key="section.id"
        class="h-full absolute"
        :class="[
          `bg-${section.color}-4`,
          `dark:bg-${section.color}-5`
        ]"
        :style="{
          width: `${section.width}%`,
          left: `${section.left}%`,
        }"
      />
    </template>
    
    <!-- 单一进度条模式 -->
    <template v-else>
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
    </template>
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
