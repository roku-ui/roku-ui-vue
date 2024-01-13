<script setup lang="ts">
const props = withDefaults(defineProps<{
  persistent?: boolean
  blur?: 'sm' | 'md' | 'lg' | boolean
}>(), {
  persistent: false,
  blur: false,
})

const model = defineModel<boolean>()

watchEffect(() => {
  if (model.value) {
    document.body.style.overflow = 'hidden'
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
</script>

<template>
  <FullscreenOverlay
    v-model="model"
    :blur="props.blur"
    :persistent="props.persistent"
    wrapper-class="flex items-end justify-center"
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
  </FullscreenOverlay>
</template>
