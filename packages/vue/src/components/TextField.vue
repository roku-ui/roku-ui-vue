<script setup lang="ts">
import { useRounded } from '../utils/classGenerator'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    onChange?: (value: string) => void
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
    error?: boolean
    disabled?: boolean
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
    size?: 'sm' | 'md' | 'lg'
    password?: boolean
    placeholder?: string
  }>(),
  {
    color: 'primary',
    rounded: 'md',
    size: 'md',
  },
)
const emit = defineEmits(['change', 'update:modelValue', 'input', 'click', 'pointerdown', 'pointerup'])
const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        base: 'h-6 px-2 py-1 text-xs',
      }
    case 'md':
      return {
        base: 'h-8 px-3 py-1 text-sm',
      }
    case 'lg':
      return {
        base: 'h-10 px-4 py-2 text-base',
      }
  }
})
const colorCls = computed(() => {
  if (props.error) {
    return 'text-error-container bg-surface-base border-error-container focus:border-error-container'
  }
  switch (props.color) {
    case 'secondary':
      return 'text-surface-on bg-surface-base border-surface-border-base focus:border-secondary-container'
    case 'tertiary':
      return 'text-surface-on bg-surface-base border-surface-border-base focus:border-tertiary-container'
    case 'error':
      return 'text-surface-on bg-surface-base border-surface-border-base focus:border-error-container'
    case 'primary':
    default:
      return 'text-surface-on bg-surface-base border-surface-border-base focus:border-primary-container'
  }
})

const disabledCls = computed(() => {
  if (props.disabled) {
    return 'pointer-events-none filter grayscale opacity-60'
  }
  return ''
})

const rounded = useRounded(props)
const input = ref<HTMLInputElement | null>(null)

function onInput(event: Event) {
  emit('update:modelValue', (event.target as any)?.value ?? '')
  emit('input', event)
}

defineExpose({
  el: input,
})
</script>

<template>
  <input
    ref="input"
    :value="modelValue"
    class="bg-back-2 border px-2 py-1 outline-none transition-background-color,border-color,color"
    :class="[colorCls, disabledCls, rounded.class, sizeCls.base]"
    :style="[rounded.style]"
    :placeholder="placeholder"
    :type="props.password ? 'password' : 'text'"
    @change="$emit('change', $event)"
    @input="onInput"
    @click="$emit('click', $event)"
    @pointerdown="$emit('pointerdown', $event)"
    @pointerup="$emit('pointerup', $event)"
  >
</template>
