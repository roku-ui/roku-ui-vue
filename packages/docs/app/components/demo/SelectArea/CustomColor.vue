<script setup lang="ts">
import type { Area } from '@roku-ui/vue'
import { SelectArea } from '@roku-ui/vue'

const items = [1, 2, 3, 4, 5, 6]
const selectingItems = ref<number[]>([])

function onSelectStart() {
  selectingItems.value = []
}

function onSelectChange(area: Area) {
  selectingItems.value = items.filter((_, index) => {
    const { left, top, right, bottom } = area
    const itemLeft = index % 3 * 80
    const itemTop = Math.floor(index / 3) * 80
    const itemRight = itemLeft + 80
    const itemBottom = itemTop + 80
    return (
      left < itemRight
      && right > itemLeft
      && top < itemBottom
      && bottom > itemTop
    )
  })
}

const code = computed(() => {
  return `<template>
  <div class="relative h-160px w-240px flex flex-wrap select-none bg-surface-base">
    <SelectArea
      color="#10b981"
      @select-start="onSelectStart"
      @select-change="onSelectChange"
    />
    <div
      v-for="item in items"
      :key="item"
      class="h-80px w-80px flex items-center justify-center border"
      :class="{
        'bg-green-500 text-white': selectingItems.includes(item),
      }"
    >
      {{ item }}
    </div>
  </div>
</template>`
})
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <div class="flex flex-col gap-4">
        <div class="text-sm text-surface-dimmed">
          自定义选择区域颜色
        </div>
        <div class="bg-surface-base flex flex-wrap h-160px w-240px select-none relative">
          <SelectArea
            color="#10b981"
            @select-start="onSelectStart"
            @select-change="onSelectChange"
          />
          <div
            v-for="item in items"
            :key="item"
            class="border flex h-80px w-80px items-center justify-center"
            :class="{
              'bg-green-500 text-white': selectingItems.includes(item),
            }"
          >
            {{ item }}
          </div>
        </div>
        <div class="text-sm text-surface-dimmed">
          选中的项目: {{ selectingItems.join(', ') || '无' }}
        </div>
      </div>
    </template>
  </Demo>
</template>
