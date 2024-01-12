<script setup lang="ts">
import { Paper } from '@roku-ui/vue'

const code = computed(() => `<template>
  <Paper> // [!code highlight]
    Test Paper // [!code highlight]
  </Paper> // [!code highlight]
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <Paper>
        Test Paper
      </Paper>
    </template>
  </Demo>
</template>
