<script setup lang="ts">
import { useRounded } from '../utils/classGenerator'

const props = withDefaults(defineProps<{
  is?: string | Component
  src?: string
  size?: 'sm' | 'md' | 'lg' | string | number
  style?: any
  class?: any
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
}>(), {
  class: '',
  is: 'img',
  rounded: 'md',
})
const rounded = useRounded(props)
const loaded = ref(false)
</script>

<template>
  <component
    :is="is"
    :style="[style, rounded.style]"
    placeholder
    :src="src"
    class="object-cover"
    :class="[{ hidden: !loaded }, props.class, rounded.class]"
    @load="loaded = true"
  />
</template>
