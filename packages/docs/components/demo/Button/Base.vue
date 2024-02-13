<script setup lang="tsx">
import { Btn, Select, Slider, Switch } from '@roku-ui/vue'

type Size = 'sm' | 'md' | 'lg'
type Variant = 'default' | 'filled'
const size = ref<Size>('md')
const disabled = ref<boolean>(false)

function code(props: { size?: Size, variant?: Variant, disabled?: boolean } = {}) {
  return `<template>
  <Btn${getpropsString(props)}> // [!code highlight]
    Button // [!code highlight]
  </Btn> // [!code highlight]
</template>`
}
const variants = ['default', 'filled', 'light', 'ghost', 'outline', 'subtle', 'transparent', 'constrast']
const variant = ref<Variant>('default')
</script>

<template>
  <Demo :code="code({ size, variant, disabled })">
    <template #form>
      <div class="flex flex-col gap-6">
        <div>
          <div class="text-surface-on-low">
            Variant
          </div>
          <Select
            v-model="variant"
            aria-label="Variant"
            :options="variants"
          />
        </div>
        <div>
          <div class="text-surface-on-low">
            Size
          </div>
          <Slider
            v-model="size"
            :options="['sm', 'md', 'lg']"
          />
        </div>
        <div>
          <div class="text-surface-on-low">
            Disabled
          </div>
          <Switch
            v-model="disabled"
          />
        </div>
      </div>
    </template>
    <template #preview>
      <Btn
        :size="size"
        :variant="variant"
        :disabled="disabled"
      >
        Button
      </Btn>
    </template>
  </Demo>
</template>
