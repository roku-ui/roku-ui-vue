<script setup lang="ts">
import { Dropzone } from '@roku-ui/vue'

const code = computed(() => `<template>
  <Dropzone>
    Drop files here
  </Dropzone>
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <Dropzone>
        Drop files here
      </Dropzone>
    </template>
  </Demo>
</template>
