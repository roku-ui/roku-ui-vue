<script setup lang="ts">
import { AspectRatio, Image } from '@roku-ui/vue'

const code = computed(() => `<template>
  <AspectRatio
    width="16rem"
    :ratio="16 / 9"
  >
    <Image
      src="https://picsum.photos/seed/2/512/512"
    />
  </AspectRatio>
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <AspectRatio
        width="16rem"
        :ratio="16 / 9"
      >
        <Image
          src="https://picsum.photos/seed/2/512/512"
        />
      </AspectRatio>
    </template>
  </Demo>
</template>
