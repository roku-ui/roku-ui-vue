<script setup lang="ts">
import type { Component } from 'vue'
import { useCS } from '@/shared'

withDefaults(
  defineProps<{
    color: string
    is?: string | Component
    withBorder?: boolean
  }>(),
  {
    is: 'div',
    withBorder: false,
  },
)
const borderCS = useCS({
  color: 'default',
  type: 'border',
  index: 4,
})
</script>

<template>
  <component
    :is="is"
    class="h-6 w-6 border rounded-full"
    :class="[{
      ['border']: withBorder,
    }]"
    v-bind="borderCS"
    :style="{
      backgroundColor: color,
    }"
  />
</template>
