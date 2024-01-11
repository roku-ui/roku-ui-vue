<script setup lang="ts">
import { useRounded } from '../utils/classGenerator'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | string | number
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
    withBorder?: boolean
    is?: string | Component
  }>(),
  {
    size: 'md',
    rounded: 'md',
    withBorder: false,
    is: 'div',
  },
)
const roundedCls = useRounded(props)
</script>

<template>
  <component
    :is="is"
    class="container-low rounded-lg p-4"
    :class="[
      {
        'border-transparent': !withBorder,
      },
      roundedCls.class,
    ]"
    :style="[roundedCls.style]"
  >
    <slot />
  </component>
</template>
