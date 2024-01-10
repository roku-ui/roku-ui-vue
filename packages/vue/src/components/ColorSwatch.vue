<script setup lang="ts">
withDefaults(
  defineProps<{
    color: string
    is?: string
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
    class="h-6 w-6 border rounded-full"
    :class="[{
      ['border border-surface-border-base']: withBorder,
      ['border border-transparent']: !withBorder,
    }]"
    :style="{
      backgroundColor: color,
    }"
  />
</template>
