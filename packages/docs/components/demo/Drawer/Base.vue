<script setup lang="ts">
import { Btn, Drawer } from '@roku-ui/vue'

const code = computed(() => `<script setup>
import { ref } from 'vue'
import { Btn, Drawer } from '@roku-ui/vue'
const show = ref(false)
<\/script>
<template>
  <Btn @click="show = true">
    Open Drawer
  </Btn>
  <Drawer v-model="show">
    This is a drawer
  </Drawer>
</template>`)
const show = ref(false)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <Btn @click="show = true">
        Open Drawer
      </Btn>
      <Drawer v-model="show">
        This is a drawer
      </Drawer>
    </template>
  </Demo>
</template>
