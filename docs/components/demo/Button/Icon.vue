<script setup lang="tsx">
import { Btn } from '@roku-ui/vue'

const code = `<template>
  <Btn icon>
    <i class="i-tabler-circle-plus" />
  </Btn>
</template>`
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <Btn icon>
        <i class="i-tabler-circle-plus" />
      </Btn>
    </template>
  </Demo>
</template>
