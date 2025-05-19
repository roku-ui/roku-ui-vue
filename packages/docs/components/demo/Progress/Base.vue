<script setup lang="ts">
import { Progress } from '@roku-ui/vue'

const code = computed(() => `<template>
  <Progress value="47" ${getpropsString({})} /> // [!code highlight]
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <div class="w-full p-2">
        <Progress
          :value="47"
        />
      </div>
    </template>
  </Demo>
</template>
