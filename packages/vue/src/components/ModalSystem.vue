<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useModals } from '@/utils/modals'

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
