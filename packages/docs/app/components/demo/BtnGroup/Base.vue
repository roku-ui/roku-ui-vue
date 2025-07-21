<script setup lang="ts">
import { BtnGroup } from '@roku-ui/vue'

const val = ref('left')
const selections = ['left', 'center', 'right']

const code = computed(() => `<script setup>
import { ref } from 'vue'
import { BtnGroup } from '@roku-ui/vue'

const val = ref('left')
const selections = ['left', 'center', 'right']
<\/script>

<template>
  <BtnGroup
    v-model="val"
    :selections="selections"
  />
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <BtnGroup
        v-model="val"
        :selections="selections"
      />
    </template>
  </Demo>
</template>
