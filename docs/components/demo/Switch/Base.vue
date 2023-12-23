<script setup lang="ts">
import { Slider, Switch } from '@roku-ui/vue'

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
      <Switch :size="size" />
    </template>
  </Demo>
</template>
