<script setup lang="ts">
import { Switch, TabItem, Tabs } from '@roku-ui/vue'

const tab = ref(0)
const code = computed(() => {
  return `<template>
  <Tabs v-model="tab">
    <TabItem :value="0">
      Tab 1
    </TabItem>
    <TabItem :value="1">
      Tab 2
    </TabItem>
  </Tabs>
</template>`
})
const direction = ref<'horizontal' | 'vertical'>('horizontal')
const isVertical = computed({
  get: () => direction.value === 'vertical',
  set: (val) => {
    direction.value = val ? 'vertical' : 'horizontal'
  },
})
</script>

<template>
  <Demo :code="code">
    <template #form>
      <div>
        <div class="text-surface-dimmed">
          Direction
        </div>
        <Switch v-model="isVertical" />
      </div>
    </template>
    <template #preview>
      <Tabs
        v-model="tab"
        :direction="direction"
      >
        <TabItem :value="0">
          Tab 1
        </TabItem>
        <TabItem :value="1">
          Tab 2
        </TabItem>
      </tabs>
    </template>
  </Demo>
</template>
