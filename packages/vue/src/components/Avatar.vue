<script setup lang="ts">
import type { Component } from 'vue'
import type { Color, ContainerVariant, Rounded } from '@/types'
import { computed, onMounted, ref } from 'vue'
import { useContainerCS } from '@/shared'
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
    class="rounded-full bg-surface-variant-1 min-h-[--size] min-w-[--size] inline-block animate-pulse"
    :style="[rounded.style, sizeStyle]"
  />
  <div
    v-else
    class="h-[--size] w-[--size] inline-block relative"
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
      class="rounded-full h-full w-full inset-0 absolute object-cover"
      v-bind="$attrs"
      @load="onload"
      @error="onerror"
    />
    <div
      v-if="!src || hasError || !loaded"
      class="font-size-[--font-size] border-4 rounded-full flex h-full w-full items-center inset-0 justify-center absolute object-cover"
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
