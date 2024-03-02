<script setup lang="ts">
import { computed } from 'vue'

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
  if (!props.persistent) {
    if (event.target === wrapperRef.value) {
      model.value = false
    }
  }
}

const blurCls = computed(() => {
  switch (props.blur) {
    case 'sm':
      return 'backdrop-blur-sm'
    case 'md':
    case true:
      return 'backdrop-blur-md'
    case 'lg':
      return 'backdrop-blur-lg'
    default:
      return ''
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
      // if all modals are closed
      if (!document.querySelector('.modal-wrapper.op100')) {
        document.body.style.overflow = ''
        document.body.style.marginRight = ''
      }
    }, 300)
  }
})

if (typeof window !== 'undefined') {
  const resizeObserver = new ResizeObserver(() => {
    const curWidth = window.innerWidth - document.body.clientWidth
    if (curWidth !== 0) {
      scrollbarWidth.value = curWidth
    }
  })
  resizeObserver.observe(document.body)
}

const currentTheme = useCurrentThemeData()
</script>

<template>
  <Teleport to="body">
    <ThemeProvider
      :theme="currentTheme"
    >
      <div
        ref="wrapperRef"
        class="modal-wrapper fixed left-0 top-0 z-100 h-full w-full bg-surface-9/50 transition-all duration-300 md:items-center"
        :class="[blurCls, wrapperClass, {
          ['op0 pointer-events-none']: !model,
          ['op100']: model,
        }]"
        @click="onClick"
      >
        <slot />
      </div>
    </ThemeProvider>
  </Teleport>
</template>
