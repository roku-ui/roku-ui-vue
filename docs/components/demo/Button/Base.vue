<script setup lang="tsx">
import { Btn, Select, Slider } from '@roku-ui/vue'

type Size = 'sm' | 'md' | 'lg'
type Variant = 'default' | 'filled'
const size = ref<Size>('md')

function code(props: { size?: Size, variant?: Variant } = {}) {
  return `<template>
  <Btn${getpropsString(props)}> // [!code highlight]
    Button // [!code highlight]
  </Btn> // [!code highlight]
</template>`
}
const variants = ['default', 'filled']
const variant = ref<Variant>('default')
</script>

<template>
  <Demo :code="code({ size, variant })">
    <template #form>
      <div class="flex flex-col gap-6">
        <div>
          <div class="text-neutral-3">
            Variant
          </div>
          <Select
            v-model="variant"
            :options="variants"
          />
        </div>
        <div>
          <div class="text-neutral-3">
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
      <Btn
        :size="size"
        :variant="variant"
      >
        Button
      </Btn>
    </template>
  </Demo>
</template>
