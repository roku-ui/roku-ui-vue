<script setup lang="ts">
import { childrenElementMapSymbol, directionSymbol, tabCurrentSymbol } from '../utils'

const props = withDefaults(defineProps<{
  value: string | number | symbol
  color?: string
}>(), {
  color: 'primary',
})
const currentModel = inject<Ref<string | number | symbol>>(tabCurrentSymbol, ref(''))
const tabRef = ref<HTMLButtonElement | null>(null)
const isActivated = computed(() => {
  return currentModel.value === props.value
})

function onClick() {
  currentModel.value = props.value
}
const childrenElementMap = inject<Map<string | number | symbol, Ref<HTMLButtonElement | null>>>(childrenElementMapSymbol, new Map())
onMounted(() => {
  childrenElementMap.set(props.value, tabRef)
})
const direction = inject<ComputedRef<'horizontal' | 'vertical'>>(directionSymbol, computed(() => 'horizontal'))
const directionCls = computed(() => {
  switch (direction.value) {
    case 'horizontal':
      return 'flex-col rounded-tr-lg rounded-tl-lg'
    case 'vertical':
      return 'flex-row-reverse rounded-tr-lg rounded-br-lg'
  }
})
const indicatorCls = computed(() => {
  switch (direction.value) {
    case 'horizontal':
      return 'absolute inset-0 top-100% h-2px w-full transition-background-color,border-color,color '
    case 'vertical':
      return 'absolute inset-0 right-100% h-full w-2px transition-background-color,border-color,color'
  }
})
const colorCls = computed(() => {
  if (isActivated.value) {
    return 'bg-primary-containerl'
  }
  return 'bg-surface-lowest'
})
</script>

<template>
  <button
    ref="tabRef"
    type="button"
    class="rutline-none relative min-w-20 flex items-center justify-center outline-none focus-visible:outline-2 focus-visible:outline-primary-container outline-offset-0!"
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
