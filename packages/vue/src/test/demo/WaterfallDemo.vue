<script setup lang="ts">
import ScrollArea from '@/components/ScrollArea.vue'
import { computed, ref } from 'vue'
import { VirtualWaterfall } from 'vue-wf'

const tmps = ref(Array.from({ length: 100 }))
const heights = [50, 100, 200, 300, 400]
const width = 200

const items = computed(() => tmps.value.map(() => {
  const height = heights[Math.floor(Math.random() * heights.length)]
  return {
    width,
    height,
    src: `https://picsum.photos/${width}/${height}?random=${Math.random()}`,
  }
}))
</script>

<template>
  <div>
    <ScrollArea
      floating
      style="height: 40vh"
    >
      <VirtualWaterfall
        :gap="4"
        :item-width="width"
        :items="items"
        floating
      >
        <img
          v-for="item, i in items"
          :key="i"
          :src="item.src"
          :style="{
            display: 'inline-block',
            height: `100%`,
            backgroundImage: `url(${item.src})`,
          }"
        >
      </VirtualWaterfall>
    </ScrollArea>
  </div>
</template>
