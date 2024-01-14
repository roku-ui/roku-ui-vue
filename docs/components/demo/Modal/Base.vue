<script setup lang="ts">
import { Btn, Modal, Paper } from '@roku-ui/vue'

const code = computed(() => `<script setup>
import { ref } from 'vue'
import { Btn, Modal, Paper } from '@roku-ui/vue'
const show = ref(false)
<\/script>
<template>
  <Btn @click="show = true">
    Open Modal
  </Btn>
  <Modal v-model="show">
    <Paper>
      This is a modal
    </Paper>
  </Modal>
</template>`)
const show = ref(false)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <Btn @click="show = true">
        Open modal
      </Btn>
      <Modal v-model="show">
        <Paper>
          This is a modal
        </Paper>
      </Modal>
    </template>
  </Demo>
</template>
