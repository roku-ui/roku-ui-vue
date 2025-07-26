<script setup lang="ts">
import { Waterfall } from '@roku-ui/vue'

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
    <Waterfall
      :gap="20"
      style="height: 300px; overflow-x: hidden;"
    >
      <img
        v-for="item, i in items"
        :key="i"
        :src="item.src"
        :style="{
          display: 'inline-block',
          height: '100%',
        }"
      >
    </Waterfall>
  </div>
</template>

`)

const tmps = ref(Array.from({ length: 10 }))
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
      <div class="p-2 h-full w-full relative">
        <Waterfall
          :gap="20"
          style="height: 300px; overflow-x: hidden;"
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
        </Waterfall>
      </div>
    </template>
  </Demo>
</template>
