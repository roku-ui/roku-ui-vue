<script setup lang="ts">
import { Select, Slider } from '@roku-ui/vue'

type Size = 'sm' | 'md' | 'lg'
const size = ref<Size>('md')
const code = computed(() => `<template>
  <Select${getpropsString({ size: size.value })} /> // [!code highlight]
</template>`)
const selected = ref('')
const options = ['apple', 'banana', 'orange', 'pear']
</script>

<template>
  <Demo :code="code">
    <template #form>
      <div class="flex flex-col gap-6">
        <div>
          <div class="texttext-neutral-3">
            Size
          </div>
          <Slider
            v-model="size"
            :options="['sm', 'md', 'lg']"
          />
        </div>
      </div>
    </template>
    <template #preview>
      <Select
        v-model="selected"
        :size="size"
        :options="options"
      />
    </template>
  </Demo>
</template>
