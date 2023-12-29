<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  persistent?: boolean
  blur?: 'sm' | 'md' | 'lg' | boolean
}>(), {
  persistent: false,
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
watchEffect(() => {
  if (model.value) {
    document.body.style.overflow = 'hidden'
    document.body.style.marginRight = '15px'
  }
  else {
    setTimeout(() => {
      document.body.style.overflow = ''
      document.body.style.marginRight = ''
    }, 300)
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      ref="wrapperRef"
      class="fixed left-0 top-0 z-100 h-full w-full flex items-end justify-center bg-surface-10/50 transition-all duration-300 md:items-center"
      :class="[blurCls, {
        ['opacity-0 pointer-events-none']: !model,
        ['opacity-100']: model,
      }]"
      @click="onClick"
    >
      <Transition
        enter-from-class="translate-y-1/2"
        enter-to-class="translate-y-0"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-1/2"
        enter-active-class="transition ease-out duration-300"
        leave-active-class="transition ease-in duration-200"
      >
        <slot v-if="model" />
      </Transition>
    </div>
  </Teleport>
</template>
