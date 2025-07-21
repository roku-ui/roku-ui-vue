<script setup lang="ts">
import { AspectRatio } from '@roku-ui/vue'

const code = computed(() => `<template>
  <AspectRatio
    width="100%"
    :ratio="16 / 9"
  >
    <iframe
      src="//player.bilibili.com/player.html?aid=605030231&bvid=BV1L84y1y7Lv&cid=890299277&p=1"
    />
  </AspectRatio>
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <AspectRatio
        width="100%"
        :ratio="16 / 9"
      >
        <iframe
          src="//player.bilibili.com/player.html?aid=605030231&bvid=BV1L84y1y7Lv&cid=890299277&p=1"
        />
      </AspectRatio>
    </template>
  </Demo>
</template>
