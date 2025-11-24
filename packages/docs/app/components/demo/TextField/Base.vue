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
          placeholder="Placeholder"
        />
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
