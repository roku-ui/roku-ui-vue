<script setup lang="ts">
import { Slider, Switch } from '@roku-ui/vue'

type Size = 'sm' | 'md' | 'lg'
const size = ref<Size>('md')
const code = computed(() => `<script setup>
const value = ref(false)
<\/script> 
<template>
  <Switch v-model="value"${getpropsString({ size: size.value })} /> // [!code highlight]
</template>`)
const value = ref(false)
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
      <Switch
        v-model="value"
        :size="size"
      />
    </template>
  </Demo>
</template>
