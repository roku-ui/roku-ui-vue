<script setup lang="ts">
const props = withDefaults(defineProps<{
  persistent?: boolean
  blur?: 'sm' | 'md' | 'lg' | boolean
}>(), {
  persistent: false,
  blur: false,
})

const model = defineModel<boolean>()
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
      enter-active-class="transition ease-out duration-100"
      leave-active-class="transition ease-in duration-100"
    >
      <slot v-if="model" />
    </Transition>
  </FullscreenOverlay>
</template>
