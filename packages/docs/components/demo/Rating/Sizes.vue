<script setup lang="ts">
import { Rating } from '@roku-ui/vue'

const rating = ref(3)

const code = computed(() => {
  return `<template>
  <div class="flex flex-col gap-4">
    <Rating v-model="rating" size="sm" />
    <Rating v-model="rating" size="md" />
    <Rating v-model="rating" size="lg" />
  </div>
</template>`
})
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <div class="flex flex-col gap-4">
        <Rating
          v-model="rating"
          size="sm"
        />
        <Rating
          v-model="rating"
          size="md"
        />
        <Rating
          v-model="rating"
          size="lg"
        />
      </div>
    </template>
  </Demo>
</template>
