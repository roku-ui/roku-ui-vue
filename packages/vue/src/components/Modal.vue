<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { FullscreenOverlay, Paper } from '@/components'

interface ModalProps {
  persistent?: boolean
  blur?: 'sm' | 'md' | 'lg' | boolean
  title?: string
  animate?: boolean
  escClose?: boolean
}

const props = withDefaults(defineProps<ModalProps>(), {
  persistent: false,
  blur: false,
  animate: false,
  escClose: true,
})

const emit = defineEmits<{
  close: []
  beforeClose: []
}>()

const model = defineModel<boolean>()

function handleClose() {
  emit('beforeClose')
  model.value = false
  emit('close')
}

function handleEscClose(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.escClose && model.value) {
    handleClose()
  }
}

onMounted(() => {
  if (props.escClose) {
    document.addEventListener('keydown', handleEscClose)
  }
})

onUnmounted(() => {
  if (props.escClose) {
    document.removeEventListener('keydown', handleEscClose)
  }
})
</script>

<template>
  <FullscreenOverlay
    v-model="model"
    :blur="props.blur"
    :persistent="props.persistent"
    :animate="props.animate"
    wrapper-class="flex justify-center items-end md:items-start md:pt-5%"
    @mask-click="handleClose"
  >
    <Transition
      v-if="props.animate"
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
          <Paper
            with-border
            class="flex flex flex-col gap-2 w-full md:w-md"
          >
            <div
              v-if="title || $slots.title"
              class="text-lg"
            >
              <div v-if="title">
                {{ title }}
              </div>
              <slot
                v-else
                name="title"
              />
            </div>
            <div>
              <slot name="body" />
            </div>
            <slot name="footer" />
          </Paper>
        </template>
      </template>
    </Transition>
    <template v-else>
      <template v-if="model">
        <slot v-if="$slots.default" />
        <template v-else>
          <Paper
            with-border
            class="flex flex flex-col gap-2 w-full md:w-md"
          >
            <div
              v-if="title || $slots.title"
              class="text-lg"
            >
              <div v-if="title">
                {{ title }}
              </div>
              <slot
                v-else
                name="title"
              />
            </div>
            <div>
              <slot name="body" />
            </div>
            <slot name="footer" />
          </Paper>
        </template>
      </template>
    </template>
  </FullscreenOverlay>
</template>
