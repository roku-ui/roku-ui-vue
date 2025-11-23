<script setup lang="ts">
import type { Component } from 'vue'
import type { Color, ContainerVariant, CornerShape, Rounded } from '@/types'
import { computed, onMounted, ref } from 'vue'
import { useComponentDefaults, useContainerCS, useTheme } from '@/shared'
import { useRounded } from '@/utils'

const props = withDefaults(
  defineProps<{
    is?: string | Component
    src?: string | null
    size?: 'sm' | 'md' | 'lg' | string | number
    name?: string
    variant?: ContainerVariant
    color?: Color
    rounded?: Rounded
    cornerShape?: CornerShape
    skeleton?: boolean
  }>(),
  {
    is: 'img',
    variant: 'default',
  },
)

const theme = useTheme()
const componentDefaults = useComponentDefaults('Avatar')

// 创建带有 theme 默认值的有效 props
const effectiveProps = computed(() => ({
  ...props,
  size: props.size ?? componentDefaults?.size ?? theme.value.defaultSize,
  color: props.color ?? componentDefaults?.color ?? 'default',
  rounded: props.rounded ?? componentDefaults?.rounded ?? 'full',
  cornerShape: props.cornerShape ?? componentDefaults?.cornerShape,
}))

const rounded = useRounded(effectiveProps.value)
const name = computed(() => props.name || '')
const sizeStyle = computed(() => {
  switch (effectiveProps.value.size) {
    case 'xs': {
      return '--size: 1.75rem; --font-size: 0.875rem;'
    }
    case 'sm': {
      return '--size: 2.5rem; --font-size: 1.125rem;'
    }
    case 'md': {
      return '--size: 3rem; --font-size: 1.5rem;'
    }
    case 'lg': {
      return '--size: 4.5rem; --font-size: 2.25rem;'
    }
    case 'xl': {
      return '--size: 6rem; --font-size: 3rem;'
    }
    default: {
      if (typeof effectiveProps.value.size === 'number' && !Number.isNaN(Number(effectiveProps.value.size))) {
        return `--size: ${effectiveProps.value.size}rem; --font-size: ${Number(effectiveProps.value.size) / 2}rem;`
      }
      return '--size: 3rem; --font-size: 1.5rem;'
    }
  }
})
const loaded = ref(false)
const hasError = ref(false)
const img = ref<HTMLImageElement | null>(null)
function onload() {
  loaded.value = true
}
function onerror() {
  hasError.value = true
  loaded.value = false
}
onMounted(() => {
  if (img.value?.complete && img.value.naturalWidth !== 0) {
    onload()
  }
  else if (img.value?.complete && img.value.naturalWidth === 0) {
    onerror()
  }
})

function getAvatarDisplayString(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
const color = computed(() => effectiveProps.value.color)
const containerCS = useContainerCS(props.variant, color)
</script>

<template>
  <div
    v-if="skeleton"
    class="bg-container min-h-[--size] min-w-[--size] inline-block animate-pulse"
    :class="rounded.class"
    :style="[rounded.style, sizeStyle]"
  />
  <div
    v-else
    class="min-h-[--size] min-w-[--size] inline-block relative"
    :style="sizeStyle"
  >
    <component
      :is="is"
      v-if="src && !hasError"
      ref="img"
      :alt="name"
      :class="[rounded.class, containerCS.class, { 'opacity-0': !loaded }]"
      :style="[rounded.style, containerCS.style]"
      :src="src"
      class="h-full w-full inset-0 absolute object-cover"
      v-bind="$attrs"
      @load="onload"
      @error="onerror"
    />
    <div
      v-if="!src || hasError || !loaded"
      class="font-size-[--font-size] border-2 flex h-full w-full items-center inset-0 justify-center absolute object-cover"
      :class="[rounded.class, containerCS.class]"
      :style="[rounded.style, containerCS.style]"
      v-bind="$attrs"
    >
      <slot v-if="$slots.default" />
      <template v-else-if="name">
        {{ getAvatarDisplayString(name) }}
      </template>
      <template v-else>
        <i class="i-fluent-person-24-filled" />
      </template>
    </div>
  </div>
</template>
