<script setup lang="ts">
import { Rating } from '@roku-ui/vue'

const rating1 = ref(3)
const rating2 = ref(3)

const code = computed(() => {
  return `<template>
  <div class="flex flex-col gap-4">
    <div>
      <div class="text-sm text-surface-dimmed mb-2">默认高亮模式</div>
      <Rating v-model="rating1" size="lg" />
    </div>
    
    <div>
      <div class="text-sm text-surface-dimmed mb-2">仅高亮选中项</div>
      <Rating v-model="rating2" size="lg" highlight-selected-only />
    </div>
  </div>
</template>`
})
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <div class="flex flex-col gap-4">
        <div>
          <div class="text-sm text-surface-dimmed mb-2">
            默认高亮模式
          </div>
          <Rating
            v-model="rating1"
            size="lg"
          />
        </div>

        <div>
          <div class="text-sm text-surface-dimmed mb-2">
            仅高亮选中项
          </div>
          <Rating
            v-model="rating2"
            size="lg"
            highlight-selected-only
          />
        </div>
      </div>
    </template>
  </Demo>
</template>
