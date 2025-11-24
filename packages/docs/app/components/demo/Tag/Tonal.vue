<script setup lang="ts">
import { Tag } from '@roku-ui/vue'

const code = `<template>
  <div class="flex gap-2 items-center">
    <Tag variant="filled" color="primary">Filled</Tag>
    <Tag variant="tonal" color="primary">Tonal</Tag>
  </div>
</template>`
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <div class="flex gap-2 items-center">
        <Tag
          variant="filled"
          color="primary"
        >
          Filled
        </Tag>
        <Tag
          variant="tonal"
          color="primary"
        >
          Tonal
        </Tag>
      </div>
    </template>
  </Demo>
</template>
