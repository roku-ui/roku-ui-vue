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
  for (const [i, d] of [...val].entries()) {
    if (currentIndex + i >= inputs.value.length) {
      break
    }
    const target = inputs.value[currentIndex + i]
    if (!target) {
      break
    }
    target.el.value = d
    const next = inputs.value[currentIndex + i + 1]
    if (next) {
      next.el.focus()
      next.el.select()
    }
    else {
      target.el.blur()
    }
  }
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
  const prev = inputs.value[currentIndex - 1]
  if (prev) {
    prev.el.focus()
    prev.el.select()
  }
  if (!alreadyFill) {
    prev && (prev.el.value = '')
  }
}

function onArrowLeft(e: KeyboardEvent) {
  e.preventDefault()
  e.stopPropagation()
  const currentIndex = inputs.value.findIndex(d => d.el === e.target)
  if (currentIndex > 0) {
    const prev = inputs.value[currentIndex - 1]
    if (prev) {
      prev.el.focus()
      prev.el.select()
    }
  }
}

function onArrowRight(e: KeyboardEvent) {
  e.preventDefault()
  e.stopPropagation()
  const currentIndex = inputs.value.findIndex(d => d.el === e.target)
  if (currentIndex < inputs.value.length - 1) {
    const next = inputs.value[currentIndex + 1]
    if (next) {
      next.el.focus()
      next.el.select()
    }
  }
}
</script>

<template>
  <div class="flex gap-2">
    <TextField
      v-for="i in props.length"
      ref="inputs"
      :key="i"
      class="text-center w-[30px] children:px-0!"
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
