<script setup lang="ts">
import type { Area } from '@/types'
import { ref } from 'vue'
import { Btn, SelectArea } from '../../components'

const items = [1, 2, 3, 4]
const areaRef = ref(null)
const selectingItems = ref<number[]>([])
const borderColor = ref('rgba(44, 155, 230, 0.8)')
const backgroundColor = ref('rgba(44, 155, 230, 0.12)')
const borderStyle = ref<'solid' | 'dashed' | 'dotted'>('solid')

const presetColors = [
  { name: 'Primary', border: 'rgba(44, 155, 230, 0.8)', bg: 'rgba(44, 155, 230, 0.12)' },
  { name: 'Secondary', border: 'rgba(16, 195, 231, 0.8)', bg: 'rgba(16, 195, 231, 0.12)' },
  { name: 'Success', border: 'rgba(0, 220, 130, 0.8)', bg: 'rgba(0, 220, 130, 0.12)' },
  { name: 'Warning', border: 'rgba(245, 166, 35, 0.8)', bg: 'rgba(245, 166, 35, 0.12)' },
  { name: 'Error', border: 'rgba(249, 88, 88, 0.8)', bg: 'rgba(249, 88, 88, 0.12)' },
]

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

function setPresetColor(preset: { border: string, bg: string }) {
  borderColor.value = preset.border
  backgroundColor.value = preset.bg
}
</script>

<template>
  <div class="space-y-4">
    <!-- Color Controls -->
    <div class="space-y-2">
      <h3 class="text-lg font-medium">
        Selection Box Style
      </h3>
      <div class="flex flex-wrap gap-2">
        <Btn
          v-for="preset in presetColors"
          :key="preset.name"
          size="sm"
          @click="setPresetColor(preset)"
        >
          {{ preset.name }}
        </Btn>
      </div>

      <div class="text-sm gap-4 grid grid-cols-3">
        <div>
          <label class="font-medium mb-1 block">Border Style</label>
          <select
            v-model="borderStyle"
            class="px-2 py-1 border rounded w-full"
          >
            <option value="solid">
              Solid
            </option>
            <option value="dashed">
              Dashed
            </option>
            <option value="dotted">
              Dotted
            </option>
          </select>
        </div>
        <div>
          <label class="font-medium mb-1 block">Border Color</label>
          <input
            v-model="borderColor"
            type="text"
            class="text-xs px-2 py-1 border rounded w-full"
          >
        </div>
        <div>
          <label class="font-medium mb-1 block">Background Color</label>
          <input
            v-model="backgroundColor"
            type="text"
            class="text-xs px-2 py-1 border rounded w-full"
          >
        </div>
      </div>
    </div>

    <!-- Selection Area -->
    <div
      ref="areaRef"
      class="bg-surface-base border grid grid-cols-2 h-200px w-200px select-none relative"
    >
      <SelectArea
        :target="areaRef"
        :border-color="borderColor"
        :background-color="backgroundColor"
        :border-style="borderStyle"
        @select-start="onSelectStart"
        @select-change="onSelectChange"
      />
      <div
        v-for="item in items"
        :key="item"
        class="border-b border-r flex h-100px w-100px items-center justify-center"
        :class="{
          'bg-error text-inverted': selectingItems.includes(item),
        }"
      >
        {{ item }}
      </div>
    </div>

    <p class="text-dimmed text-sm">
      拖拽鼠标来选择方块。选中的方块会采用错误色背景高亮。
    </p>
  </div>
</template>
