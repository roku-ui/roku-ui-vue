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
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-1">
          <div class="texttext-surface-onlow">
            Size
          </div>
          <Slider
            v-model="size"
            :options="['sm', 'md', 'lg']"
          />
        </div>
        <div class="flex flex-col gap-1">
          <div class="texttext-surface-onlow">
            Placeholder
          </div>
          <TextField
            v-model="placeholder"
          />
        </div>
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
