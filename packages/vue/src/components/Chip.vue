<script setup lang="ts">
import { useRounded } from '../utils/classGenerator'

const props = withDefaults(
  defineProps<{
    is?: string | Component
    src?: string
    size?: 'sm' | 'md' | 'lg' | string | number
    style?: any
    class?: any
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
  }>(),
  {
    size: 'md',
    is: 'img',
    rounded: 'full',
  },
)
const model = defineModel<boolean>({ default: undefined })
const rounded = useRounded(props)
const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 text-sm h-6'
    case 'md':
      return 'px-6 h-8 text-base'
    case 'lg':
      return 'px-8 h-10 text-lg'
  }
})
const colorCls = computed(() => {
  if (model.value) {
    return 'container-filled-primary border-transparent text-white'
  }
  else {
    return 'container-base'
  }
})
const checkable = computed(() => {
  return model.value !== undefined
})
const checkableCls = computed(() => {
  if (checkable.value) {
    return 'cursor-pointer'
  }
  else {
    return ''
  }
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1"
    :class="[rounded.class, sizeCls, colorCls, checkableCls]"
    :style="[rounded.style]"
    @pointerup="checkable && (model = !model)"
  >
    <slot
      v-if="$slots.leftSection"
      name="leftSection"
    />
    <slot />
    <slot
      v-if="$slots.rightSection"
      name="rightSection"
    />
  </span>
</template>
