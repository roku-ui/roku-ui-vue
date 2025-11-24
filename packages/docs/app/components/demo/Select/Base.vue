<script setup lang="ts">
import { Select, Slider, TextField } from '@roku-ui/vue'

type Size = 'sm' | 'md' | 'lg'
const size = ref<Size>('md')
const placeholder = ref<string>('Placeholder')
const code = computed(() => `<template>
  <Select${getpropsString({ size: size.value, placeholder: placeholder.value })} /> // [!code highlight]
</template>`)
const selected = ref('')
const options = ['apple', 'banana', 'orange', 'pear']
</script>

<template>
  <Demo :code="code">
    <template #form>
      <div class="flex flex-col gap-2">
        <div class="text-surface-dimmed">
          Size
        </div>
        <Slider
          v-model="size"
          :options="['sm', 'md', 'lg']"
          :min-width="6"
        />
      </div>
      <div class="flex flex-col gap-2">
        <div class="text-surface-dimmed">
          Placeholder
        </div>
        <TextField
          v-model="placeholder"
        />
      </div>
    </template>
    <template #preview>
      <Select
        v-model="selected"
        :size="size"
        :placeholder="placeholder"
        :options="options"
      />
    </template>
  </Demo>
</template>
