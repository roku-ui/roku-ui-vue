<script setup lang="ts">
import { Paper } from '@roku-ui/vue'

const code = computed(() => `<template>
  <Paper> // [!code highlight]
    Paper // [!code highlight]
  </Paper> // [!code highlight]
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <Paper>
        Paper
      </Paper>
    </template>
  </Demo>
</template>
