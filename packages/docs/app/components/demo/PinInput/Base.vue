<script setup lang="ts">
import { PinInput } from '@roku-ui/vue'

const code = computed(() => `<template>
  <PinInput${getpropsString({})} /> // [!code highlight]
</template>`)
const value = ref('')
</script>

<template>
  <Demo :code="code">
    <template #preview>
      {{ value }}
      <PinInput
        v-model="value"
      />
    </template>
  </Demo>
</template>
