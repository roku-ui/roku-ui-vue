<script setup lang="ts">
import type { Area } from '@/types'
import { ref } from 'vue'
import { SelectArea } from '../../components'

const items = [1, 2, 3, 4]
const areaRef = ref(null)
const selectingItems = ref<number[]>([])
const borderColor = ref('rgba(59, 130, 246, 0.8)')
const backgroundColor = ref('rgba(59, 130, 246, 0.1)')
const borderStyle = ref<'solid' | 'dashed' | 'dotted'>('solid')

const presetColors = [
  { name: 'Blue', border: 'rgba(59, 130, 246, 0.8)', bg: 'rgba(59, 130, 246, 0.1)' },
  { name: 'Green', border: 'rgba(34, 197, 94, 0.8)', bg: 'rgba(34, 197, 94, 0.1)' },
  { name: 'Red', border: 'rgba(239, 68, 68, 0.8)', bg: 'rgba(239, 68, 68, 0.1)' },
  { name: 'Purple', border: 'rgba(168, 85, 247, 0.8)', bg: 'rgba(168, 85, 247, 0.1)' },
  { name: 'Orange', border: 'rgba(249, 115, 22, 0.8)', bg: 'rgba(249, 115, 22, 0.1)' },
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
      <h3 class="text-lg font-medium">Selection Box Style</h3>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="preset in presetColors"
          :key="preset.name"
          type="button"
          class="px-3 py-1 border rounded hover:bg-gray-100"
          @click="setPresetColor(preset)"
        >
          {{ preset.name }}
        </button>
      </div>
      
      <div class="grid grid-cols-3 gap-4 text-sm">
        <div>
          <label class="block font-medium mb-1">Border Style</label>
          <select v-model="borderStyle" class="w-full px-2 py-1 border rounded">
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
        </div>
        <div>
          <label class="block font-medium mb-1">Border Color</label>
          <input v-model="borderColor" type="text" class="w-full px-2 py-1 border rounded text-xs">
        </div>
        <div>
          <label class="block font-medium mb-1">Background Color</label>
          <input v-model="backgroundColor" type="text" class="w-full px-2 py-1 border rounded text-xs">
        </div>
      </div>
    </div>

    <!-- Selection Area -->
    <div
      ref="areaRef"
      class="bg-surface-base h-200px w-200px select-none relative border grid grid-cols-2"
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
        class="flex h-100px w-100px items-center justify-center border-r border-b border-gray-300"
        :class="{
          'bg-red-500 text-white': selectingItems.includes(item),
          'bg-gray-100': !selectingItems.includes(item),
        }"
      >
        {{ item }}
      </div>
    </div>
    
    <p class="text-sm text-gray-600">
      拖拽鼠标来选择方块。选中的方块会变成红色。
    </p>
  </div>
</template>
