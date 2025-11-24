<script setup lang="ts">
import { Image, Overlay, Slider } from '@roku-ui/vue'

function code(props: { opacity?: number } = {}) {
  return `<template>
  <Overlay${getpropsString(props)}>
    <Image
      height="100px"
      width="150px"
      src="https://picsum.photos/seed/1/200/300"
    />
  </Overlay>
</template>`
}
const opacity = ref<number>(80)
</script>

<template>
  <Demo :code="code({ opacity })">
    <template #form>
      <div class="flex flex-col gap-2">
        <div class="text-surface-dimmed">
          Opacity
        </div>
        <Slider
          v-model="opacity"
          :min="0"
          :max="100"
          :step="1"
          :min-width="6"
        />
      </div>
    </template>
    <template #preview>
      <Overlay
        :opacity="opacity"
      >
        <Image
          height="100px"
          width="150px"
          src="https://picsum.photos/seed/1/200/300"
        />
      </Overlay>
    </template>
  </Demo>
</template>
