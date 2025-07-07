<script setup lang="ts">
import type { Component } from 'vue'
import type { Color, ContainerVariant, Rounded } from '@/types'
import { computed, onMounted, ref } from 'vue'
import { useContainerCS } from '@/shared'
import { useRounded } from '@/utils'

const props = withDefaults(
  defineProps<{
    is?: string | Component
    src?: string
    size?: 'sm' | 'md' | 'lg' | string | number
    name?: string
    variant?: ContainerVariant
    color?: Color
    rounded?: Rounded
    skeleton?: boolean
  }>(),
  {
    size: 'md',
    is: 'img',
    variant: 'default',
    color: 'default',
    rounded: 'full',
  },
)

const rounded = useRounded(props)
const name = computed(() => props.name || '')
const sizeStyle = computed(() => {
  switch (props.size) {
    case 'xs': {
      return '--size: 2rem; --font-size: 1rem;'
    }
    case 'sm': {
      return '--size: 3rem; --font-size: 1.25rem;'
    }
    case 'md': {
      return '--size: 4rem; --font-size: 2rem;'
    }
    case 'lg': {
      return '--size: 6rem; --font-size: 3rem;'
    }
    case 'xl': {
      return '--size: 8rem; --font-size: 4rem;'
    }
    default: {
      if (typeof props.size === 'number' && !Number.isNaN(Number(props.size))) {
        return `--size: ${props.size}rem; --font-size: ${props.size / 2}rem;`
      }
      return `--size: 4rem;`
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
const color = computed(() => props.color)
const containerCS = useContainerCS(props.variant, color)
</script>

<template>
  <div
    v-if="skeleton"
    class="inline-block min-h-[--size] min-w-[--size] animate-pulse rounded-full bg-surface-variant-1"
    :style="[rounded.style, sizeStyle]"
  />
  <component
    :is="is"
    v-else-if="src && !hasError"
    ref="img"
    :alt="name"
    :class="[rounded.class, containerCS.class, { hidden: !loaded }]"
    :style="[rounded.style, containerCS.style, sizeStyle]"
    :src="src"
    class="inline-block h-[var(--size)] w-[var(--size)] rounded-full object-cover"
    v-bind="$attrs"
    @load="onload"
    @error="onerror"
  />
  <div
    v-else
    class="inline-block h-[--size] w-[--size] flex items-center justify-center border-4 rounded-full object-cover font-size-[--font-size]"
    :class="[rounded.class, containerCS.class]"
    :style="[rounded.style, containerCS.style, sizeStyle]"
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
</template>
