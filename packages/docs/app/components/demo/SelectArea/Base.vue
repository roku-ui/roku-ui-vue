<script setup lang="ts">
import type { SelectArea } from '@roku-ui/vue'

const items = [1, 2, 3, 4]
const selectingItems = ref<number[]>([])

function onSelectStart() {
  selectingItems.value = []
}

function onSelectChange(area: { left: any, top: any, right: any, bottom: any }) {
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

const code = computed(() => {
  return `<template>
  <div class="relative h-200px w-200px flex flex-wrap select-none bg-surface-base">
    <SelectArea
      @select-start="onSelectStart"
      @select-change="onSelectChange"
    />
    <div
      v-for="item in items"
      :key="item"
      class="h-100px w-100px flex items-center justify-center border"
      :class="{
        'bg-primary-container text-white': selectingItems.includes(item),
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
          拖拽选择区域来选择项目
        </div>
        <div class="bg-surface-base flex flex-wrap h-200px w-200px select-none relative">
          <SelectArea
            @select-start="onSelectStart"
            @select-change="onSelectChange"
          />
          <div
            v-for="item in items"
            :key="item"
            class="border flex h-100px w-100px items-center justify-center"
            :class="{
              'bg-primary-container text-white': selectingItems.includes(item),
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
