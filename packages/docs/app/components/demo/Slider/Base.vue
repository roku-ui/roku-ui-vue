<script setup lang="tsx">
import { Slider, Switch } from '@roku-ui/vue'

type Size = 'sm' | 'md' | 'lg'

const size = ref<Size>('md')
const animate = ref<boolean>(false)

function code(props: { size?: Size, animate?: boolean } = {}) {
  return `<template> 
  <Slider
    v-model="value" 
    :options="['Apple', 'Banana', 'Lemon']" 
   ${getpropsString(props)}
  >  
    Button 
  </Slider>
</template>`
}
const option = ref('Apple')
</script>

<template>
  <Demo :code="code({ size, animate })">
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
          Animate
        </div>
        <Switch
          v-model="animate"
        />
      </div>
    </template>
    <template #preview>
      <div>
        <Slider
          v-model="option"
          :options="['Apple', 'Banana', 'Lemon']"
          :size="size"
          :animate="animate"
        />
      </div>
    </template>
  </Demo>
</template>
