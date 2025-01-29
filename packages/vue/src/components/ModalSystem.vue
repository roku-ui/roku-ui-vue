<script setup lang="ts">
import { useModals } from '@/utils/modals'
import { computed, watchEffect } from 'vue'

const modals = useModals()
watchEffect(() => {
  console.log(modals.value)
})
const hasModal = computed(() => modals.value.length > 0)
</script>

<template>
  <FullscreenOverlay
    :model-value="hasModal"
    :persistent="true"
    wrapper-class="flex justify-center items-end md:items-start md:pt-5%"
  >
    <div>
      {{ modals }}
    </div>
  </FullscreenOverlay>
</template>
