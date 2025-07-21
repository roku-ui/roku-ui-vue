<script setup lang="ts">
import { Image, Indicator } from '@roku-ui/vue'

const code = computed(() => `<template>
  <Indicator>
    <Image
      width="48px"
      height="48px"
      src="https://avatars.githubusercontent.com/u/29743310?v=4"
    />
  </Indicator>
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <Indicator>
        <Image
          width="48px"
          height="48px"
          src="https://avatars.githubusercontent.com/u/29743310?v=4"
        />
      </Indicator>
    </template>
  </Demo>
</template>
