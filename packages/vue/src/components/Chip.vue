<script setup lang="ts">
import { useRounded } from '../utils/classGenerator'

const props = withDefaults(
  defineProps<{
    is?: string
    src?: string
    size?: 'sm' | 'md' | 'lg' | string | number
    style?: any
    class?: any
    modelValue?: boolean
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
  }>(),
  {
    size: 'md',
    is: 'img',
    rounded: 'full',
  },
)
const emit = defineEmits(['update:modelValue'])
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
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
  if (value.value) {
    return 'container-filled-primary'
  }
  else {
    return 'container-default'
  }
})
const checkable = computed(() => {
  return value.value !== undefined
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
    @pointerup="$emit('update:modelValue', !modelValue)"
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
useRoundedStyleuseRoundedStyle
