<script setup lang="ts">
import { Switch } from '@roku-ui/vue'

const code = computed(() => `<script setup>
const value = ref(false)
<\/script> 
<template>
  <Switch 
    v-model="value" 
    off-icon="i-line-md-close" 
    on-icon="i-line-md-circle"
  /> 
</template>`)
const value = ref(false)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <Switch
        v-model="value"
        off-icon="i-line-md-close"
        on-icon="i-line-md-circle"
      />
    </template>
  </Demo>
</template>
