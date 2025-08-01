<script setup lang="ts">
import { computed } from 'vue'
import { Modals, useModals } from '@/utils/modals'
import { Btn, FullscreenOverlay, Paper } from '.'

const modals = useModals()

const hasModal = computed(() => modals.value.length > 0)
const currentModal = computed(() => modals.value[0])

function handleConfirm() {
  if (currentModal.value) {
    currentModal.value.onConfirm()
    Modals.close(currentModal.value.id)
  }
}

function handleCancel() {
  if (currentModal.value) {
    if (currentModal.value.type === 'confirm' && currentModal.value.onCancel) {
      currentModal.value.onCancel()
    }
    Modals.close(currentModal.value.id)
  }
}
</script>

<template>
  <FullscreenOverlay
    :model-value="hasModal"
    :persistent="true"
    :blur="true"
    wrapper-class="flex justify-center items-center p-4"
  >
    <Transition
      enter-from-class="scale-95 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-95 opacity-0"
      enter-active-class="transition-all ease-out duration-150 will-change-transform"
      leave-active-class="transition-all ease-in duration-100 will-change-transform"
    >
      <Paper
        v-if="currentModal"
        class="border-surface-20 p-6 border max-w-md w-full shadow-xl"
        with-border
      >
        <div class="space-y-5">
          <div class="text-center space-y-2">
            <div class="mx-auto mb-4 rounded-full bg-primary-10 flex h-12 w-12 items-center justify-center">
              <div class="bg-primary-50 rounded-full h-6 w-6" />
            </div>
            <h3 class="text-surface-90 text-xl font-semibold">
              {{ currentModal.title }}
            </h3>
            <p class="text-surface-60 leading-relaxed">
              {{ currentModal.message }}
            </p>
          </div>
          <div class="pt-2 flex gap-3 justify-end">
            <Btn
              v-if="currentModal.type === 'confirm'"
              variant="outline"
              size="md"
              @click="handleCancel"
            >
              Cancel
            </Btn>
            <Btn
              size="md"
              @click="handleConfirm"
            >
              {{ currentModal.type === 'confirm' ? 'Confirm' : 'OK' }}
            </Btn>
          </div>
        </div>
      </Paper>
    </Transition>
  </FullscreenOverlay>
</template>
