<script setup lang="ts">
const props = withDefaults(defineProps<{
  persistent?: boolean
  blur?: 'sm' | 'md' | 'lg' | boolean
  position?: 'left' | 'right'
}>(), {
  persistent: false,
  blur: false,
  position: 'left',
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
  >
    <Transition
      :enter-from-class="position === 'left' ? '-translate-x-1/1' : 'translate-x-1/1'"
      :enter-to-class="position === 'left' ? 'translate-x-0' : 'translate-x-0'"
      :leave-from-class="position === 'left' ? 'translate-x-0' : 'translate-x-0'"
      :leave-to-class="position === 'left' ? '-translate-x-1/1' : 'translate-x-1/1'"
      enter-active-class="transition ease-out duration-300"
      leave-active-class="transition ease-in duration-200"
    >
      <div
        v-if="model"
        class="h-full bg-surface-low md:w-md w-full fixed"
        :class="position === 'left' ? 'left-0' : 'right-0'"
      >
        <div class="flex justify-end p-4 md:px-6 md:py-4 md:pb-0">
          <Btn
            icon
            variant="transparent"
            class="text-surface-on hover:text-surface-on"
            @pointerup="model = false"
          >
            <i class="i-tabler-x" />
          </Btn>
        </div>
        <div class="flex flex-col items-center justify-center h-full px-4 md:px-6">
          <slot />
        </div>
      </div>
    </Transition>
  </FullscreenOverlay>
</template>
