<script setup lang="ts">
import type { Color, ContainerVariant } from '@/types'
import { useContainerCS } from '@/shared'
import { type Component, computed, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    is?: string | Component
    src?: string
    size?: 'sm' | 'md' | 'lg' | string | number
    name?: string
    variant?: ContainerVariant
    color?: Color
  }>(),
  {
    size: 'md',
    is: 'img',
    variant: 'default',
    color: 'default',
  },
)
const name = computed(() => props.name || '')
const sizeStyle = computed(() => {
  switch (props.size) {
    case 'sm':
      return '--size: 3rem; --font-size: 1.25rem;'
    case 'md':
      return '--size: 4rem; --font-size: 2rem;'
    case 'lg':
      return '--size: 6rem; --font-size: 3rem;'
    case 'xl':
      return '--size: 8rem; --font-size: 4rem;'
    default:
      if (typeof props.size === 'number' && !Number.isNaN(Number(props.size))) {
        return `--size: ${props.size}rem; --font-size: ${props.size / 2}rem;`
      }
      return `--size: 4rem;`
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

function getAvatarDisplayString(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
const color = computed(() => props.color)
const containerCS = useContainerCS(props.variant, color)
</script>

<template>
  <component
    :is="is"
    v-if="src"
    ref="img"
    :alt="name"
    :class="[containerCS.class, { hidden: !loaded }]"
    :style="[containerCS.style, sizeStyle]"
    :src="src"
    class="inline-block h-[var(--size)] w-[var(--size)] rounded-full object-cover"
    v-bind="$attrs"
    @load="onload"
  />
  <div
    v-if="!loaded || !src"
    class="inline-block h-[--size] w-[--size] flex items-center justify-center border-4 rounded-full object-cover font-size-[--font-size]"
    :class="containerCS.class"
    :style="[containerCS.style, sizeStyle]"
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
