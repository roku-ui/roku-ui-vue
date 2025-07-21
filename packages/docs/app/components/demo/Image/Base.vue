<script setup lang="ts">
import { Image } from '@roku-ui/vue'

const code = computed(() => `<template>
  <Image
    height="200px"
    width="300px"
    title="Image Title"
    src="https://picsum.photos/seed/3/300/200"
  />
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <Image
        height="200px"
        width="300px"
        title="Image Title"
        src="https://picsum.photos/seed/3/300/200"
      />
    </template>
  </Demo>
</template>
