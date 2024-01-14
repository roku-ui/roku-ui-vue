<script setup lang="ts">
import { PinInput, SchemeSwitch } from '@roku-ui/vue'

const code = computed(() => `<template>
  <SchemeSwitch /> // [!code highlight]
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <SchemeSwitch />
    </template>
  </Demo>
</template>
