<script setup lang="ts">
import { Chip } from '@roku-ui/vue'

const code = computed(() => `<template>
  <Chip>Chip</Chip> // [!code highlight]
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <Chip>Chip</Chip>
    </template>
  </Demo>
</template>
