<script setup lang="ts">
import { directionSymbol, tabCurrentSymbol } from '../utils'

const props = withDefaults(defineProps<{
  value: string | number | symbol
  color?: string
}>(), {
  color: 'primary',
})
const currentModel = inject<Ref<string | number | symbol>>(tabCurrentSymbol, ref(''))
const direction = inject<ComputedRef<'horizontal' | 'vertical'>>(directionSymbol, computed(() => 'horizontal'))

const isActivated = computed(() => {
  return currentModel.value === props.value
})

function onClick() {
  currentModel.value = props.value
}

const directionCls = computed(() => {
  switch (direction.value) {
    case 'horizontal':
      return 'flex-col'
    case 'vertical':
      return 'flex-row-reverse'
  }
})
const indicatorCls = computed(() => {
  switch (direction.value) {
    case 'horizontal':
      return 'absolute inset-0 top-100% h-2px w-full transition-background-color,border-color,color'
    case 'vertical':
      return 'absolute inset-0 right-100% h-full w-2px bg-primary-container transition-background-color,border-color,color'
  }
})
const colorCls = computed(() => {
  if (isActivated.value) {
    return 'bg-primary-container'
  }
  return 'bg-surface-lowest'
})
</script>

<template>
  <button
    type="button"
    class="relative min-w-20 flex items-center justify-center"
    :class="[directionCls]"
    @click="onClick"
  >
    <div
      v-if="isActivated"
      :class="[indicatorCls, colorCls]"
    />
    <div
      v-else
      :class="[indicatorCls, colorCls]"
    />
    <div class="h-full py-2">
      <slot />
    </div>
  </button>
</template>
