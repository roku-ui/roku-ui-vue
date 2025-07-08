<script setup lang="ts">
import { Rating } from '@roku-ui/vue'

const rating = ref(3)

const code = computed(() => {
  return `<template>
  <Rating v-model="rating" />
</template>`
})
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <div class="flex flex-col gap-4">
        <Rating v-model="rating" />
        <div class="text-sm text-surface-dimmed">
          当前评分: {{ rating }}
        </div>
      </div>
    </template>
  </Demo>
</template>
