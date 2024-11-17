<script setup lang="ts">
import { Avatar, Slider } from '@roku-ui/vue'

type Size = 'sm' | 'md' | 'lg'
const size = ref<Size>('md')
const code = computed(() => `<template>
  <Avatar src="https://avatars.githubusercontent.com/u/29743310?v=4"${getpropsString({ size: size.value })} /> // [!code highlight]
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #form>
      <div class="flex flex-col gap-6">
        <div>
          <div class="texttext-surface-dimmed">
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
      <Avatar
        title="Jannchie"
        src="https://avatars.githubusercontent.com/u/29743310?v=4"
        :size="size"
      />
    </template>
  </Demo>
</template>
