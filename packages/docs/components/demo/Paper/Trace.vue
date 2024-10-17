<script setup lang="ts">
import { Paper } from '@roku-ui/vue'

const code = computed(() => `<template>
  <div class="flex flex-gap-2">
    <Paper trace-animate> // [!code highlight]
      Trace Animation
    </Paper>
    <Paper trace-animate> // [!code highlight]
      Trace Animation
    </Paper>
  </div>
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <div class="flex flex-gap-2">
        <Paper trace-animate>
          Trace Animation
        </Paper>
        <Paper trace-animate>
          Trace Animation
        </Paper>
      </div>
    </template>
  </Demo>
</template>
