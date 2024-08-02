<script setup lang="ts">
import { LazyWaterfall, ScrollArea } from '@roku-ui/vue'

const code = computed(() => `<script setup lang="ts">
const tmps = ref(Array.from({ length: 20 }))
const heights = [50, 100, 200, 300, 400]
const width = 100
const items = computed(() => tmps.value.map(() => {
  const height = heights[Math.floor(Math.random() * heights.length)]
  return {
    width,
    height,
    src: \`https://picsum.photos/\${width}/\${height}?random=\${Math.random()}\`,
  }
}))
<\/script>
<template>
  <div class="relative h-full w-full p-2">
    <LazyWaterfall
      :is="ScrollArea"
      :gap="4"
      :item-width="width"
      :items="items"
    >
      <img
        v-for="item, i in items"
        :key="i"
        :src="item.src"
        :style="{
          display: 'inline-block',
          height: '100%'',
          backgroundImage: \`url(\${item.src})\`,
        }"
      >
    </LazyWaterfall>
  </div>
</template>`)

const tmps = ref(Array.from({ length: 20 }))
const heights = [50, 100, 200, 300, 400]
const width = 100
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
  <Demo :code="code">
    <template #preview>
      <ClientOnly>
        <div class="relative h-full w-full p-2">
          <LazyWaterfall
            :is="ScrollArea"
            :gap="4"
            :item-width="width"
            :items="items"
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
          </LazyWaterfall>
        </div>
      </ClientOnly>
    </template>
  </Demo>
</template>
