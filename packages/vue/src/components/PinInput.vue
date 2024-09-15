<script setup lang="ts">
import { ref } from 'vue'
import TextField from './TextField.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    length?: number
    size?: 'sm' | 'md' | 'lg'
    password?: boolean
  }>(),
  {
    length: 6,
  },
)
const inputs = ref<{
  el: HTMLInputElement
  focus: () => void
  blur: () => void
}[]
>([])
function onInput(e: InputEvent) {
  e.preventDefault()
  e.stopPropagation()
  const currentIndex = inputs.value.findIndex(d => d.el === e.target)
  const val = (e.target as any).value ?? '';
  (e.target as any).value = ''
  Array.from<string>(val).forEach((d: string, i: number) => {
    if (currentIndex + i >= inputs.value.length) {
      return
    }
    inputs.value[currentIndex + i].el.value = d
    if (currentIndex + i + 1 < inputs.value.length) {
      inputs.value[currentIndex + i + 1].el.focus()
      inputs.value[currentIndex + i + 1].el.select()
    }
    else {
      inputs.value[currentIndex + i].el.blur()
    }
  })
}
function onBackspace(e: KeyboardEvent) {
  e.preventDefault()
  e.stopPropagation()
  const alreadyFill = (e.target as any).value !== '';
  (e.target as any).value = ''
  const currentIndex = inputs.value.findIndex(d => d.el === e.target)
  if (currentIndex === 0) {
    return
  }
  inputs.value[currentIndex - 1].el.focus()
  inputs.value[currentIndex - 1].el.select()
  if (!alreadyFill) {
    inputs.value[currentIndex - 1].el.value = ''
  }
}

function onArrowLeft(e: KeyboardEvent) {
  e.preventDefault()
  e.stopPropagation()
  const currentIndex = inputs.value.findIndex(d => d.el === e.target)
  if (currentIndex > 0) {
    inputs.value[currentIndex - 1].el.focus()
    inputs.value[currentIndex - 1].el.select()
  }
}

function onArrowRight(e: KeyboardEvent) {
  e.preventDefault()
  e.stopPropagation()
  const currentIndex = inputs.value.findIndex(d => d.el === e.target)
  if (currentIndex < inputs.value.length - 1) {
    inputs.value[currentIndex + 1].el.focus()
    inputs.value[currentIndex + 1].el.select()
  }
}
</script>

<template>
  <div class="flex gap-2">
    <TextField
      v-for="i in props.length"
      ref="inputs"
      :key="i"
      class="w-8 text-center"
      style="padding: 0;"
      :password="props.password"
      @pointerup="$event.target.select()"
      @input.stop.prevent="onInput"
      @keydown.backspace="onBackspace"
      @keydown.arrow-left="onArrowLeft"
      @keydown.arrow-right="onArrowRight"
    />
  </div>
</template>
