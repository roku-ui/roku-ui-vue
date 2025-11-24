<script setup lang="ts">
import { Rating } from '@roku-ui/vue'

const rating = ref(2)

const code = computed(() => {
  return `<template>
  <div class="flex flex-col gap-4">
    <Rating
      v-model="rating"
      :count="4"
      size="lg"
      :icons="[
        'i-fluent-checkmark-circle-12-filled',
        'i-fluent-question-circle-12-filled',
        'i-fluent-error-circle-12-filled',
        'i-fluent-dismiss-circle-12-filled',
      ]"
      :color="['green', 'yellow', 'orange', 'red']"
    />
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
          :count="4"
          size="lg"
          :icons="[
            'i-fluent-checkmark-circle-12-filled',
            'i-fluent-question-circle-12-filled',
            'i-fluent-error-circle-12-filled',
            'i-fluent-dismiss-circle-12-filled',
          ]"
          :color="['green', 'yellow', 'orange', 'red']"
        />
        <div class="text-surface-dimmed text-sm">
          状态: {{ ['良好', '一般', '警告', '错误'][rating - 1] || '未选择' }}
        </div>
      </div>
    </template>
  </Demo>
</template>
