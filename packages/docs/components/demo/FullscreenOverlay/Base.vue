<script setup lang="ts">
import { Btn, FullscreenOverlay } from '@roku-ui/vue'

const code = computed(() => `<script setup>
import { ref } from 'vue'
import { Btn, FullscreenOverlay } from '@roku-ui/vue'
const show = ref(false)
<\/script>
<template>
  <Btn @click="show = true">
    Open Fullscreen Overlay
  </Btn>
  <FullscreenOverlay v-model="show" />
</template>`)
const show = ref(false)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <Btn @click="show = true">
        Open Fullscreen Overlay
      </Btn>
      <FullscreenOverlay v-model="show" />
    </template>
  </Demo>
</template>
