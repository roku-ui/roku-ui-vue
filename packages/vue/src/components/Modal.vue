<script setup lang="ts">
const props = withDefaults(defineProps<{
  persistent?: boolean
  blur?: 'sm' | 'md' | 'lg' | boolean
  title?: string
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
    wrapper-class="flex justify-center items-end  md:items-start md:pt-5%"
  >
    <Transition
      enter-from-class="translate-y-1/2"
      enter-to-class="translate-y-0"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-1/2"
      enter-active-class="transition ease-out duration-100"
      leave-active-class="transition ease-in duration-100"
    >
      <template v-if="model">
        <slot v-if="$slots.default" />
        <template v-else>
          <Paper with-border class="w-full flex flex flex-col gap-2 md:w-md">
            <div v-if="title || $slots.title" class="text-lg">
              <div v-if="title">
                {{ title }}
              </div>
              <slot v-else name="title" />
            </div>
            <div>
              <slot name="body" />
            </div>
            <slot name="footer" />
          </Paper>
        </template>
      </template>
    </Transition>
  </FullscreenOverlay>
</template>
