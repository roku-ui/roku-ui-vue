<script setup lang="ts">
import { Btn, FullscreenOverlay } from '.'

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
        class="bg-surface-low h-full w-full fixed md:w-md"
        :class="position === 'left' ? 'left-0' : 'right-0'"
      >
        <div class="p-4 flex justify-end md:px-6 md:py-4 md:pb-0">
          <Btn
            icon
            variant="transparent"
            class="text-surface-on hover:text-surface-on"
            @pointerup="model = false"
          >
            <i class="i-fluent-dismiss-12-filled" />
          </Btn>
        </div>
        <div class="px-4 flex flex-col h-full items-center justify-center md:px-6">
          <slot />
        </div>
      </div>
    </Transition>
  </FullscreenOverlay>
</template>
