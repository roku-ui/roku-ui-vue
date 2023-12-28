<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    is?: string
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
</script>

<template>
  <component
    :is="is"
    v-if="src"
    :style="[style, sizeStyle]"
    placeholder
    :src="src"
    class="h-[var(--size)] w-[var(--size)] rounded-full object-cover"
    :class="[{ hidden: !loaded }, props.class]"
    @load="loaded = true"
  />
  <img
    v-if="!loaded"
    class="h-[var(--size)] w-[var(--size)] animate-pulse rounded-full bg-surface-5 object-cover"
    :style="[style, sizeStyle]"
  >
</template>
