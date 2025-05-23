<script setup lang="ts">
import { useElementBounding, useEventListener, useMagicKeys, useMouse, useParentElement } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useColors } from '@/shared'

const props = withDefaults(defineProps<{
  target?: HTMLElement
  color?: string
}>(), {
  color: 'primary',
})
const emit = defineEmits<{
  selectStart: [{ target: EventTarget | null, shift: boolean, ctrl: boolean }]
  selectChange: [Area, { target: EventTarget | null, shift: boolean, ctrl: boolean }]
  selectEnd: [Area, { target: EventTarget | null, shift: boolean, ctrl: boolean }]
}>()
const color = computed(() => props.color)
const colors = useColors(color)
const colorStyle = computed(() => {
  const borderColor = colors.value[5].setAlpha(0.5).toHex8String()
  const fillColor = colors.value[5].setAlpha(0.1).toHex8String()
  return {
    '--border-color': borderColor,
    '--fill-color': fillColor,
  }
})

const { shift, control: ctrl } = useMagicKeys()
export interface Area {
  left: number
  top: number
  right: number
  bottom: number
}

const parentEl = useParentElement()
const target = computed(() => props.target ?? parentEl.value as HTMLElement | null | undefined)
const mouse = useMouse()
const startPoint = ref({ x: 0, y: 0 })
const endPoint = ref({ x: 0, y: 0 })
const dragging = ref(false)
const targetBounds = useElementBounding(target)
useEventListener(target, 'pointerdown', (e) => {
  // if not left click, return
  if (e.button !== 0) {
    return
  }
  const offsetX = e.pageX - targetBounds.left.value
  const offsetY = e.pageY - targetBounds.top.value
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
}, { capture: true })
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
  const offsetX = e.pageX - targetBounds.left.value
  const offsetY = e.pageY - targetBounds.top.value
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
    x: mouse.x.value - targetBounds.left.value,
    y: mouse.y.value - targetBounds.top.value,
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
  <Teleport
    v-if="target"
    :to="target"
  >
    <div
      v-if="dragging"
      class="absolute z-10000 h-1 border border border-[var(--border-color)] bg-[var(--fill-color)]"
      :style="[{
        left: `${Math.min(startPoint.x, endPoint.x)}px`,
        top: `${Math.min(startPoint.y, endPoint.y)}px`,
        width: `${Math.abs(startPoint.x - endPoint.x)}px`,
        height: `${Math.abs(startPoint.y - endPoint.y)}px`,
      }, colorStyle]"
    />
  </Teleport>
</template>
