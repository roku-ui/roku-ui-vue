<script setup lang="ts">
import { Paper } from '@roku-ui/vue'

const code = computed(() => `<template>
  <Paper loading> // [!code highlight]
    Loading Paper
  </Paper>
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <Paper loading>
        Loading Paper
      </Paper>
    </template>
  </Demo>
</template>
