<script setup lang="tsx">
import { Btn } from '@roku-ui/vue'

const code = `<template>
  <Btn is="a" href="https://jannchie.com" target="_blank"> // [!code highlight]
    To Jannchie's Blog
  </Btn>
</template>`
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <Btn
        is="a"
        href="https://jannchie.com"
        target="_blank"
      >
        To Jannchie's Blog
      </Btn>
    </template>
  </Demo>
</template>
