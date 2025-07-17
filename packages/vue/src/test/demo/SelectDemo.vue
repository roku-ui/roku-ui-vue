<script setup lang="ts">
import { ref } from 'vue'

const selections = [
  {
    label: 'Option 1',
    id: 'option1',
  },
  {
    label: 'Option 2',
    id: 'option2',
  },
  {
    label: 'Option 3',
    id: 'option3',
  },
]
const selected = ref(selections[0])

// 大量选项演示
const manyOptions = Array.from({ length: 100 }, (_, i) => ({ id: i, label: `城市 ${i + 1}` }))
const manySelected = ref(manyOptions[0])
</script>

<template>
  <div>
    <h3>基础用法</h3>
    <Select
      v-model="selected"
      :options="selections"
    />

    <h3 class="mt-8">
      大量选项演示
    </h3>
    <Select
      v-model="manySelected"
      :options="manyOptions"
      placeholder="请选择一个城市"
      searchable
      style="width: 300px;"
    />
    <div class="mt-2">
      当前选择：{{ manySelected.label }}
    </div>
  </div>
</template>
