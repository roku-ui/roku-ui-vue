<script setup lang="ts">
import { Slider, TextField } from '@roku-ui/vue'

type Size = 'sm' | 'md' | 'lg'
const size = ref<Size>('md')
const placeholder = ref<string>('Placeholder')
const code = computed(() => `<template>
  <TextField${getpropsString({ size: size.value, placeholder: placeholder.value })} /> // [!code highlight]
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #form>
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-1">
          <div class="text-surface-onlow">
            Size
          </div>
          <Slider
            v-model="size"
            :options="['sm', 'md', 'lg']"
          />
        </div>
        <div class="flex flex-col gap-1">
          <div class="text-surface-onlow">
            Placeholder
          </div>
          <TextField
            v-model="placeholder"
            placeholder="Placeholder"
          />
        </div>
      </div>
    </template>
    <template #preview>
      <TextField
        :size="size"
        :placeholder="placeholder"
      />
    </template>
  </Demo>
</template>
