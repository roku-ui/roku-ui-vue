<script setup lang="ts">
import type { Component } from 'vue'
import { borderCS } from '@/shared'

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
</script>

<template>
  <component
    :is="is"
    class="border rounded-full h-6 w-6"
    :class="[{
      ['border']: withBorder,
    }]"
    v-bind="borderCS"
    :style="{
      backgroundColor: color,
    }"
  />
</template>
