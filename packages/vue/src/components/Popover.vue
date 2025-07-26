<script setup lang="ts">
import { onClickOutside, useElementBounding, useElementHover } from '@vueuse/core'
import { computed, ref } from 'vue'

type Position = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end' | 'top' | 'bottom' | 'left' | 'right'

const props = withDefaults(defineProps<{
  trigger?: 'hover' | 'click'
  position?: Position
  zIndex?: number
  offset?: number
  overlay?: boolean
  disabled?: boolean
}>(), {
  trigger: 'click',
  position: 'bottom',
  zIndex: 10_000,
  offset: 4,
  overlay: false,
  disabled: false,
})

defineSlots<{
  default: (props: any) => any
  content: (props: any) => any
}>()

const wrapperRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const wrapperBounds = useElementBounding(wrapperRef)
const contentBounds = useElementBounding(contentRef)
const positionClass = computed(() => {
  switch (props.position) {
    case 'top-start': {
      return 'top-0 left-0'
    }
    case 'top-end': {
      return 'top-0 right-0'
    }
    case 'bottom-end': {
      return 'top-100% right-0'
    }
    case 'bottom-start': {
      return 'top-100% left-0'
    }
    case 'bottom': {
      return 'top-100% left-50%'
    }
    default: {
      return 'top-100%'
    }
  }
})
const positionStyle = computed(() => {
  switch (props.position) {
    case 'top-start':
    case 'top-end': {
      return {
        top: `${-contentBounds.height.value - props.offset}px`,
      }
    }
    case 'top': {
      return {
        top: `${-contentBounds.height.value - props.offset}px`,
        left: `${-contentBounds.width.value / 2 + wrapperBounds.width.value / 2}px`,
      }
    }
    case 'bottom-start':
    case 'bottom-end': {
      return {
        marginTop: `${props.offset}px`,
      }
    }
    case 'bottom': {
      return {
        top: `${wrapperBounds.height.value + props.offset}px`,
        left: `${-contentBounds.width.value / 2 + wrapperBounds.width.value / 2}px`,
      }
    }
    case 'left-start': {
      return {
        left: `${-contentBounds.width.value - props.offset}px`,
        top: 0,
      }
    }
    case 'left-end': {
      return {
        left: `${-contentBounds.width.value - props.offset}px`,
        top: `${-contentBounds.height.value + wrapperBounds.height.value}px`,
      }
    }
    case 'left': {
      return {
        left: `${-contentBounds.width.value - props.offset}px`,
        top: `${-contentBounds.height.value / 2 + wrapperBounds.height.value / 2}px`,
      }
    }
    case 'right-start': {
      return {
        left: `${props.offset + wrapperBounds.width.value}px`,
        top: 0,
      }
    }
    case 'right-end': {
      return {
        left: `${props.offset + wrapperBounds.width.value}px`,
        top: `${-contentBounds.height.value + wrapperBounds.height.value}px`,
      }
    }
    case 'right': {
      return {
        left: `${wrapperBounds.width.value + props.offset}px`,
        top: `${-contentBounds.height.value / 2 + wrapperBounds.height.value / 2}px`,
      }
    }
    default: {
      return {}
    }
  }
})
const hover = useElementHover(wrapperRef)
const active = defineModel({
  default: false,
})
const showContent = computed(() => {
  if (props.disabled) {
    return false
  }
  return props.trigger === 'hover' ? hover.value : active.value
})

function onWrapperClick(e: PointerEvent) {
  if (props.disabled) {
    return
  }
  // Only toggle if clicked directly on the wrapper children (not on content)
  if (!contentRef.value?.contains(e.target as HTMLElement)) {
    active.value = !active.value
  }
}

onClickOutside(contentRef, (e) => {
  // Only close if clicked outside both wrapper and content
  const clickedOnWrapper = wrapperRef.value?.contains(e.target as HTMLElement)
  if (!clickedOnWrapper) {
    active.value = false
  }
})
</script>

<template>
  <div
    class="inline-block relative"
  >
    <div
      ref="wrapperRef"
      class="inline-block relative"
      @pointerup="onWrapperClick"
    >
      <slot />
      <div
        v-if="showContent"
        ref="contentRef"
        :class="positionClass"
        :style="[positionStyle, { zIndex }]"
        class="absolute children:w-max"
      >
        <slot name="content" />
      </div>
    </div>
    <Overlay
      v-if="showContent && overlay"
      :opacity="0"
      class="inset-0 fixed z-10"
      :style="{
        zIndex: zIndex - 1,
      }"
      @pointerup="active = false"
    />
  </div>
</template>
