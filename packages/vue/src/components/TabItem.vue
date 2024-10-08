<script setup lang="ts">
import { childrenElementMapSymbol, directionSymbol, tabCurrentSymbol } from '@/utils'
import { computed, type ComputedRef, inject, onMounted, type Ref, ref } from 'vue'
import { useColorStyleWithKey } from '../shared'

const props = withDefaults(defineProps<{
  value: string | number | symbol
  color?: string
}>(), {
  color: 'primary',
})
const color = computed(() => props.color)
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
    case 'vertical':
      return 'flex-row-reverse rounded-tr-lg rounded-br-lg'
    case 'horizontal':
    default:
      return 'flex-col rounded-tr-lg rounded-tl-lg'
  }
})
const indicatorCls = computed(() => {
  switch (direction.value) {
    case 'vertical':
      return 'absolute inset-0 right-100% h-full w-2px transition-background-color,border-color,color'
    case 'horizontal':
    default:
      return 'absolute inset-0 top-100% h-2px w-full transition-background-color,border-color,color '
  }
})
// const colorCls = computed(() => {
//   if (isActivated.value) {
//     return 'bg-primary-container'
//   }
//   return 'bg-surface-lowest'
// })
const colorStyle = useColorStyleWithKey(color, ['fill'])
</script>

<template>
  <button
    ref="tabRef"
    type="button"
    class="rutline-none relative min-w-20 flex items-center justify-center outline-none focus-visible:outline-2 focus-visible:outline-[var(--d-bg)] outline-offset-0!"
    :class="[directionCls]"
    :style="colorStyle"
    @click="onClick"
  >
    <div
      v-if="isActivated"
      class="dark:bg-[var(--d-bg)] light:bg-[var(--l-bg)]"
      :class="[indicatorCls]"
    />
    <div
      v-else
      :class="[indicatorCls]"
    />
    <div class="h-full py-2">
      <slot />
    </div>
  </button>
</template>
