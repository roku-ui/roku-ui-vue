<script setup lang="ts">
import { Slider, TextField } from '@roku-ui/vue'

type Size = 'sm' | 'md' | 'lg'
const size = ref<Size>('md')
const code = computed(() => `<template>
  <Switch${getpropsString({ size: size.value })} /> // [!code highlight]
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #form>
      <div class="flex flex-col gap-6">
        <div>
          <div class="texttext-surface-onlow">
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
      <TextField :size="size" />
    </template>
  </Demo>
</template>
