<script setup lang="ts">
import type { Component } from 'vue'

const props = withDefaults(
  defineProps<{
    is?: string | Component
    src?: string
    size?: 'sm' | 'md' | 'lg' | string | number
    style?: any
    class?: any
  }>(),
  {
    size: 'md',
    is: 'img',
  },
)

const sizeStyle = computed(() => {
  switch (props.size) {
    case 'sm':
      return '--size: 1.5rem;'
    case 'md':
      return '--size: 2rem;'
    case 'lg':
      return '--size: 3rem;'
    default:
      if (typeof props.size === 'number' || !Number.isNaN(Number(props.size))) {
        return `--size: ${props.size}rem;`
      }
      return `--size: ${props.size};`
  }
})
const loaded = ref(false)
const img = ref<HTMLImageElement | null>(null)
function onload() {
  loaded.value = true
}
onMounted(() => {
  if (img.value?.complete) {
    onload()
  }
})
</script>

<template>
  <component
    :is="is"
    v-if="src"
    ref="img"
    :style="[style, sizeStyle]"
    placeholder
    :src="src"
    class="h-[var(--size)] w-[var(--size)] rounded-full object-cover"
    :class="[{ hidden: !loaded }, props.class]"
    v-bind="$attrs"
    @load="onload"
  />
  <div
    v-if="!loaded"
    class="h-[var(--size)] w-[var(--size)] animate-pulse border-transparent rounded-full bg-surface-high object-cover"
    :style="[style, sizeStyle]"
  />
</template>
