<script setup lang="ts">
import { Tag } from '@roku-ui/vue'

const code = `<script setup>
import { Tag } from '@roku-ui/vue'
<\/script>
<template>
  <Tag>Tag</Tag>
</template>`
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <Tag>Tag</Tag>
    </template>
  </Demo>
</template>
