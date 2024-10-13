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
</script>

<template>
  <div>
    <Select
      v-model="selected"
      :options="selections"
    />
  </div>
</template>
