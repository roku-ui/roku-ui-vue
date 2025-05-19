<script setup lang="ts">
import { useElementBounding, useElementHover, useEventListener, useMouse, useParentElement, useScroll } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useSurfaceCS } from '@/shared'
import { useClientHeight, useScrollHeight } from '../composables/dom'

const props = withDefaults(
  defineProps<{
    height?: number | string
    barWidth?: number
    threshold?: number
    floating?: boolean
    autoHide?: boolean
  }>(),
  {
    barWidth: 8,
    threshold: 100,
  },
)

const parentElement = useParentElement()
const parentBounds = useElementBounding(parentElement)
const scrollBarIndicatorRef = ref<HTMLElement | null>()
const scrollBarIndicatorBounds = useElementBounding(() => scrollBarIndicatorRef.value)

const height = computed(() => {
  if (props.height) {
    if (typeof props.height === 'number') {
      return `${props.height}px`
    }
    return props.height
  }
  const parentPaddingY = parentElement.value ? Number.parseFloat(getComputedStyle(parentElement.value).paddingTop) + Number.parseFloat(getComputedStyle(parentElement.value).paddingBottom) : 0
  const parentMarginY = parentElement.value ? Number.parseFloat(getComputedStyle(parentElement.value).marginTop) + Number.parseFloat(getComputedStyle(parentElement.value).marginBottom) : 0
  return `${parentBounds.height.value - parentPaddingY - parentMarginY}px`
})
const scrollDomRef = ref<HTMLElement | null>()
const clientHeight = useClientHeight(() => scrollDomRef.value)
const { x, y } = useScroll(() => scrollDomRef.value)
const scrollableLength = computed(() => {
  return (scrollDomRef.value?.scrollHeight ?? 0) - (clientHeight.value ?? 0)
})
const scrollHeight = useScrollHeight(() => scrollDomRef.value)
const barProgress = computed(() => y.value / scrollableLength.value || 0)
const barHeight = computed(() => {
  if (!scrollDomRef.value) {
    return 0
  }
  return clientHeight.value / scrollHeight.value * clientHeight.value
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
const prevUserSelect = ref('')
const startScrollTop = ref(0)
const mouse = useMouse({ type: 'client' })
useEventListener(() => scrollBarIndicatorRef.value, 'pointerdown', (e) => {
  dragging.value = true
  dragStartY.value = e.clientY
  startScrollTop.value = y.value
  prevUserSelect.value = document.body.style.userSelect
  document.body.style.userSelect = 'none'
})

useEventListener(() => document, 'pointermove', () => {
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
})

useEventListener(() => document, 'pointerup', () => {
  dragging.value = false
  document.body.style.userSelect = prevUserSelect.value
})

defineExpose({
  $el: scrollDomRef,
})

const wrapperRef = ref<HTMLElement | null>()
const wrapperHover = useElementHover(wrapperRef)

const hover = useElementHover(() => scrollBarIndicatorRef.value)
const indicatorBgNormal = useSurfaceCS('bg', { dark: 2, light: 7 }, 0.5)
const indicatorBgHover = useSurfaceCS('bg', { dark: 2, light: 7 }, 0.75)

// 当按下滚动条背景时，滚动条会向下移动一屏幕的距离，按下一秒后，
function onBarBackgroundPointerDown(e: PointerEvent) {
  const { clientY } = e
  const { top, height } = scrollBarIndicatorBounds
  const barTop = top.value
  const barHeight = height.value
  const barCenter = barTop + barHeight / 2
  const diff = clientY - barCenter
  scrollDomRef.value?.scrollBy({
    top: diff / barHeight * clientHeight.value,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div
    ref="wrapperRef"
    :style="{
      height,
    }"
    class="relative max-h-fit overflow-hidden"
  >
    <div
      v-if="scrollBarData"
      :style="{
        width: `${barWidth}px`,
      }"
      class="absolute right-0 z-99999 h-full"
      @pointerdown="onBarBackgroundPointerDown"
    >
      <div
        v-show="scrollBarData.barHeight < clientHeight"
        ref="scrollBarIndicatorRef"
        :class="[
          indicatorBgNormal.class, {
            'op-0': !wrapperHover && autoHide,
            'op-100': wrapperHover && autoHide,
          }]"
        class="absolute right-0 z-1 rounded-full transition-background-color,opacity"
        :style="[
          {
            right: '0px',
            width: `${barWidth}px`,
            top: `${scrollBarData.barTop}px`,
            height: `${scrollBarData.barHeight}px`,
          },
          (!hover && !dragging) && indicatorBgNormal.style,
          (hover || dragging) && indicatorBgHover.style,
        ]"
      />
    </div>
    <div
      ref="scrollDomRef"
      :style="{
        paddingRight: `${floating ? 0 : barWidth}px`,
        scrollbarWidth: 'none',
        height: '100%',
        overflowY: 'scroll',
      }"
    >
      <slot />
    </div>
  </div>
</template>
