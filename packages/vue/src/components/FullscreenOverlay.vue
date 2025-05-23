<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRokuProvider } from '@/composables/modal'

const props = withDefaults(defineProps<{
  persistent?: boolean
  blur?: 'sm' | 'md' | 'lg' | boolean
  wrapperClass?: string
}>(), {
  persistent: false,
  blur: false,
})

const model = defineModel<boolean>()

const wrapperRef = ref(null)
function onClick(event: any) {
  if (!props.persistent && event.target === wrapperRef.value) {
    model.value = false
  }
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
    }, 300)
  }
})
watchEffect(() => {
  if (globalThis.window !== undefined) {
    const resizeObserver = new ResizeObserver(() => {
      const curWidth = window.innerWidth - document.body.clientWidth
      if (curWidth !== 0) {
        scrollbarWidth.value = curWidth
      }
    })
    resizeObserver.observe(document.body)
  }
})
const provider = useRokuProvider()
</script>

<template>
  <Teleport :to="provider ?? 'body'">
    <div
      ref="wrapperRef"
      class="fixed left-0 top-0 z-100 h-full w-full bg-surface-10/50 p-2 transition-all duration-100"
      :class="[blurCls, wrapperClass, {
        ['op-0 pointer-events-none']: !model,
        ['op-100']: model,
      }]"
      @click="onClick"
    >
      <slot />
    </div>
  </Teleport>
</template>
