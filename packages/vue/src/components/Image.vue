<script setup lang="ts">
import { useRounded } from '@/utils/classGenerator'
import { type Component, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    is?: string | Component
    src?: string
    style?: any
    class?: any
    width?: string | number
    maxWidth?: string | number
    height?: string | number
    maxHeight?: string | number
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
  }>(),
  {
    is: 'img',
    rounded: 'md',
  },
)

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
// get px from string, e.g. '1rem' -> 16

const rounded = useRounded(props)
</script>

<template>
  <div
    :style="{
      height,
      width,
      maxHeight,
      maxWidth,
    }"
  >
    <component
      :is="is"
      v-if="src"
      ref="img"
      :style="[
        style,
        rounded.style,
      ]"
      :src="src"
      class="h-full w-full object-cover"
      :class="[
        props.class,
        rounded.class,
        {
          hidden: !loaded,
        },
      ]"
      v-bind="$attrs"
      @load="onload"
    />
    <div
      v-if="!loaded"
      class="bg-surface-high h-full w-full animate-pulse border-transparent object-cover"
      :class="[
        props.class,
        rounded.class,
      ]"
      :style="[
        style,
        rounded.style,
      ]"
    />
  </div>
</template>
