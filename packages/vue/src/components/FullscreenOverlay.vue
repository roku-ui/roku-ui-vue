<script setup lang="ts">
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import { useRokuProvider } from '@/composables/modal'

const props = withDefaults(defineProps<{
  persistent?: boolean
  blur?: 'sm' | 'md' | 'lg' | boolean
  wrapperClass?: string
  animate?: boolean
}>(), {
  persistent: false,
  blur: false,
  animate: false,
})

const emit = defineEmits<{
  maskClick: []
}>()

const model = defineModel<boolean>()

const wrapperRef = ref(null)
let mousedownTarget: EventTarget | null = null

function onMouseDown(event: MouseEvent) {
  mousedownTarget = event.target
}

function onMouseUp(event: MouseEvent) {
  if (!props.persistent 
      && mousedownTarget === wrapperRef.value 
      && event.target === wrapperRef.value) {
    emit('maskClick')
    model.value = false
  }
  mousedownTarget = null
}

const blurCls = computed(() => {
  switch (props.blur) {
    case 'sm': {
      return 'backdrop-blur-sm'
    }
    case 'md':
    case true: {
      return 'backdrop-blur-md'
    }
    case 'lg': {
      return 'backdrop-blur-lg'
    }
    default: {
      return ''
    }
  }
})
const scrollbarWidth = ref(0)
let resizeObserver: ResizeObserver | null = null

watchEffect(() => {
  if (model.value) {
    document.body.style.overflow = 'hidden'
    document.body.style.marginRight = `${scrollbarWidth.value}px`
  }
  else {
    setTimeout(() => {
      if (document // if all modals are closed
        && !document.querySelector('.modal-wrapper.op100')) {
        document.body.style.overflow = ''
        document.body.style.marginRight = ''
      }
    }, 200)
  }
})

watchEffect(() => {
  if (globalThis.window !== undefined && !resizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      const curWidth = window.innerWidth - document.body.clientWidth
      if (curWidth !== 0) {
        scrollbarWidth.value = curWidth
      }
    })
    resizeObserver.observe(document.body)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
const provider = useRokuProvider()
</script>

<template>
  <Teleport :to="provider ?? 'body'">
    <Transition
      v-if="props.animate"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      enter-active-class="transition-opacity duration-150 ease-out"
      leave-active-class="transition-opacity duration-100 ease-in"
    >
      <div
        v-if="model"
        ref="wrapperRef"
        class="p-2 will-change-auto bg-surface-10/60 h-full w-full left-0 top-0 fixed z-100"
        :class="[blurCls, wrapperClass]"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
      >
        <slot />
      </div>
    </Transition>
    <div
      v-else-if="model"
      ref="wrapperRef"
      class="p-2 will-change-auto bg-surface-10/60 h-full w-full left-0 top-0 fixed z-100"
      :class="[blurCls, wrapperClass]"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
    >
      <slot />
    </div>
  </Teleport>
</template>
