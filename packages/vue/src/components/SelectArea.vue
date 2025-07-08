<script setup lang="ts">
import { useElementBounding, useEventListener, useMouse } from '@vueuse/core'
import { computed, ref } from 'vue'

const props = defineProps<{
  target?: HTMLElement | null
}>()
const emit = defineEmits<{
  selectStart: [{ target: EventTarget | null, shift: boolean, ctrl: boolean }]
  selectChange: [Area, { target: EventTarget | null, shift: boolean, ctrl: boolean }]
  selectEnd: [Area, { target: EventTarget | null, shift: boolean, ctrl: boolean }]
}>()
const { shift, control: ctrl } = useMagicKeys()
export interface Area {
  left: number
  top: number
  right: number
  bottom: number
}

const target = computed(() => props.target ?? document.documentElement)
const mouse = useMouse()
const startPoint = ref({ x: 0, y: 0 })
const endPoint = ref({ x: 0, y: 0 })
const dragging = ref(false)
const targetBounds = useElementBounding(target)
const targetScroll = useScroll(target)
useEventListener(target, 'pointerdown', (e) => {
  // if not left click, return
  if (e.button !== 0) {
    return
  }
  const offsetX = e.pageX - targetBounds.left.value + targetScroll.x.value
  const offsetY = e.pageY - targetBounds.top.value + targetScroll.y.value
  // 获取相对于 target 的坐标
  startPoint.value = {
    x: offsetX,
    y: offsetY,
  }
  endPoint.value = {
    x: offsetX,
    y: offsetY,
  }
  dragging.value = true
  emit('selectStart', { target: e.target, shift: shift.value, ctrl: ctrl.value })
})

// 捕获任意元素的 mouseup 事件
useEventListener(globalThis, 'pointerup', (e) => {
  dragging.value = false
  emit('selectEnd', {
    left: Math.min(startPoint.value.x, endPoint.value.x),
    top: Math.min(startPoint.value.y, endPoint.value.y),
    right: Math.max(startPoint.value.x, endPoint.value.x),
    bottom: Math.max(startPoint.value.y, endPoint.value.y),
  }, { target: e.target, shift: shift.value, ctrl: ctrl.value })
})

useEventListener(target, 'pointermove', (e) => {
  const offsetX = e.pageX - targetBounds.left.value + targetScroll.x.value
  const offsetY = e.pageY - targetBounds.top.value + targetScroll.y.value
  if (!dragging.value) {
    return
  }
  endPoint.value = {
    x: offsetX,
    y: offsetY,
  }
  emit('selectChange', {
    left: Math.min(startPoint.value.x, endPoint.value.x),
    top: Math.min(startPoint.value.y, endPoint.value.y),
    right: Math.max(startPoint.value.x, endPoint.value.x),
    bottom: Math.max(startPoint.value.y, endPoint.value.y),
  }, { target: e.target, shift: shift.value, ctrl: ctrl.value })
})
const parent = computed(() => {
  if (!target.value) {
    return null
  }
  return target.value.parentElement
})
useEventListener(parent, 'scroll', (e) => {
  if (!dragging.value) {
    return
  }
  endPoint.value = {
    x: mouse.x.value - targetBounds.left.value + targetScroll.x.value,
    y: mouse.y.value - targetBounds.top.value + targetScroll.y.value,
  }
  emit('selectChange', {
    left: Math.min(startPoint.value.x, endPoint.value.x),
    top: Math.min(startPoint.value.y, endPoint.value.y),
    right: Math.max(startPoint.value.x, endPoint.value.x),
    bottom: Math.max(startPoint.value.y, endPoint.value.y),
  }, { target: e.target, shift: shift.value, ctrl: ctrl.value })
})

useEventListener(globalThis, 'dragend', () => {
  dragging.value = false
})
</script>

<template>
  <div class="relative">
    <div
      v-if="dragging"
      class="absolute z-10000 h-1 border-primary-8/75 bg-primary-8/25"
      :style="{
        left: `${Math.min(startPoint.x, endPoint.x)}px`,
        top: `${Math.min(startPoint.y, endPoint.y)}px`,
        width: `${Math.abs(startPoint.x - endPoint.x)}px`,
        height: `${Math.abs(startPoint.y - endPoint.y)}px`,
      }"
    />
  </div>
</template>
