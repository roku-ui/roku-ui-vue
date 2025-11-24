<script setup lang="ts">
import { Btn } from '@roku-ui/vue'

const code = `<template>
  <div class="flex gap-2 items-center">
    <Btn variant="filled">Filled</Btn>
    <Btn variant="tonal">Tonal</Btn>
  </div>
</template>`
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <div class="flex gap-2 items-center">
        <Btn variant="filled">
          Filled
        </Btn>
        <Btn variant="tonal">
          Tonal
        </Btn>
      </div>
    </template>
  </Demo>
</template>
