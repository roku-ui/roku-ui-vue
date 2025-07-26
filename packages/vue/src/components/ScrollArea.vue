<script setup lang="ts">
import { useElementBounding, useEventListener, useMouse, useScroll } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useClientHeight } from '@/composables/dom'

const props = withDefaults(
  defineProps<{
    height?: number
    barWidth?: number
    threshold?: number
    stopPropagation?: boolean
    capture?: boolean
    minBarHeight?: number
  }>(),
  {
    barWidth: 4,
    threshold: 100,
    stopPropagation: false,
    capture: false,
    minBarHeight: 20,
  },
)
const scrollBarIndicatorRef = ref<HTMLElement>()
const scrollBarIndicatorBounds = useElementBounding(() => scrollBarIndicatorRef.value)

const scrollDomRef = ref<HTMLElement>()

const clientHeight = useClientHeight(() => scrollDomRef.value)
const scrollHeight = ref(0)
// 为了检查滚动区域长度的变化，姑且使用 Mutation Observer
useMutationObserver(scrollDomRef, () => {
  if (scrollDomRef.value) {
    scrollHeight.value = scrollDomRef.value.scrollHeight
  }
}, {
  subtree: true,
  attributes: true,
  childList: true,
})
const scrollableLength = computed(() => {
  return (scrollHeight.value ?? 0) - (clientHeight.value ?? 0)
})

const { x, y } = useScroll(() => scrollDomRef.value)
const barProgress = computed(() => y.value / scrollableLength.value || 0)
const barHeight = computed(() => {
  if (!scrollDomRef.value) {
    return 0
  }
  const calculatedBarHeight = clientHeight.value / scrollHeight.value * clientHeight.value
  return Math.max(calculatedBarHeight, props.minBarHeight)
})
const scrollableHeight = computed(() => {
  return clientHeight.value - barHeight.value
})

const scrollBarData = computed(() => {
  if (!scrollDomRef.value) {
    return null
  }
  const barTop = barProgress.value * scrollableHeight.value
  return {
    x: x.value,
    y: y.value,
    barHeight: barHeight.value,
    barTop,
  }
})
const dragging = ref(false)
const dragStartY = ref(0)
const previousUserSelect = ref('')
const startScrollTop = ref(0)
const mouse = useMouse({ type: 'client' })
useEventListener(() => scrollBarIndicatorRef.value, 'pointerdown', (e) => {
  dragging.value = true
  dragStartY.value = e.clientY
  startScrollTop.value = y.value
  previousUserSelect.value = document.body.style.userSelect
  document.body.style.userSelect = 'none'
}, {
  capture: props.capture,
})

useEventListener(() => document, 'pointermove', (e) => {
  if (props.stopPropagation) {
    e.stopPropagation()
  }
  if (!dragging.value) {
    return
  }
  if ((props.threshold < scrollBarIndicatorBounds.left.value - mouse.x.value) || (mouse.x.value - scrollBarIndicatorBounds.right.value > props.threshold)) {
    y.value = startScrollTop.value
    return
  }
  const diff = mouse.y.value - dragStartY.value
  const progress = diff / scrollableHeight.value
  y.value = startScrollTop.value + progress * scrollableLength.value
}, {
  capture: props.capture,
})

useEventListener(() => document, 'pointerup', (e) => {
  if (props.stopPropagation) {
    e.stopPropagation()
  }
  dragging.value = false
  document.body.style.userSelect = previousUserSelect.value
}, {
  capture: props.capture,
})

defineExpose({
  $el: scrollDomRef,
})
</script>

<template>
  <div
    class="relative overflow-hidden"
  >
    <div
      v-if="scrollBarData"
      :style="{
        width: `${barWidth}px`,
      }"
      class="h-full right-0 absolute z-999"
    >
      <div
        v-show="scrollBarData.barHeight < clientHeight"
        ref="scrollBarIndicatorRef"

        class="rounded-full bg-[--r-surface-border-variant-color] right-0 absolute"
        :style="{
          right: '0px',
          width: `${barWidth}px`,
          top: `${scrollBarData.barTop}px`,
          height: `${scrollBarData.barHeight}px`,
        }"
      />
    </div>
    <div
      ref="scrollDomRef"
      class="scroll-area h-full w-full overflow-auto"
      v-bind="$attrs"
      :style="{
        scrollbarWidth: 'none',
      }"
    >
      <slot />
    </div>
  </div>
</template>
