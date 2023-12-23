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
</script>

<template>
  <Demo :code="code({ size, animate })">
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
        <div>
          <Switch
            v-model="animate"
            label="Animate"
          />
        </div>
      </div>
    </template>
    <template #preview>
      <Slider
        :options="['Apple', 'Banana', 'Lemon']"
        :size="size"
        :animate="animate"
      />
    </template>
  </Demo>
</template>
