<script setup lang="ts">
import type { Area } from '@/components/SelectArea.vue'
import { ref } from 'vue'

const items = [1, 2, 3, 4]
const areaRef = ref(null)
const selectingItems = ref<number[]>([])
function onSelectStart() {
  selectingItems.value = []
}

function onSelectChange(area: Area) {
  selectingItems.value = items.filter((_, index) => {
    const { left, top, right, bottom } = area
    const itemLeft = index % 2 * 100
    const itemTop = Math.floor(index / 2) * 100
    const itemRight = itemLeft + 100
    const itemBottom = itemTop + 100
    return (
      left < itemRight
      && right > itemLeft
      && top < itemBottom
      && bottom > itemTop
    )
  })
}
</script>

<template>
  <div
    ref="areaRef"
    class="relative h-200px w-200px flex flex flex-wrap select-none bg-surface-base"
  >
    <SelectArea
      color="#f10"
      @select-start="onSelectStart"
      @select-change="onSelectChange"
    />
    <div
      v-for="item in items"
      :key="item"
      class="h-100px w-100px flex items-center justify-center"
      :class="{
        'bg-primary-container text-white': selectingItems.includes(item),
      }"
    >
      {{ item }}
    </div>
  </div>
</template>
