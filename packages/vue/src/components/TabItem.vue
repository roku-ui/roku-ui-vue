<script setup lang="ts">
import type { ComputedRef, Ref } from 'vue'
import { computed, inject, onMounted, ref } from 'vue'
import { useCS } from '@/shared'
import { childrenElementMapSymbol, directionSymbol, tabCurrentSymbol } from '@/utils'

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
    case 'vertical': {
      return 'flex-row-reverse rounded-tr-lg rounded-br-lg'
    }
    case 'horizontal': {
      return 'flex-col rounded-tr-lg rounded-tl-lg'
    }
    default: {
      return ''
    }
  }
})
const indicatorCls = computed(() => {
  switch (direction.value) {
    case 'vertical': {
      return 'absolute inset-0 right-100% h-full w-2px'
    }
    case 'horizontal': {
      return 'absolute inset-0 top-100% h-2px w-full'
    }
    default: {
      return ''
    }
  }
})
// const colorCls = computed(() => {
//   if (isActivated.value) {
//     return 'bg-primary-container'
//   }
//   return 'bg-surface-lowest'
// })
const indicatorBgCS = useCS({
  color: color.value,
  type: 'bg',
  index: 5,
})
const btnOutlineCS = useCS({
  color: color.value,
  type: 'outline',
  index: 5,
})
</script>

<template>
  <button
    ref="tabRef"
    type="button"
    class="rutline-none outline-none flex min-w-20 items-center justify-center relative focus-visible:outline-2 outline-offset-0!"
    :class="[directionCls]"
    v-bind="btnOutlineCS"
    @click="onClick"
  >
    <div
      v-if="isActivated"
      :class="[indicatorBgCS.class, indicatorCls]"
      :style="[indicatorBgCS.style]"
    />
    <div
      v-else
      :class="[indicatorCls]"
    />
    <div class="py-2 h-full">
      <slot />
    </div>
  </button>
</template>
