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
    password?: boolean
    placeholder?: string
  }>(),
  {
    color: 'primary',
    rounded: 'md',
  },
)

const emit = defineEmits(['change', 'update:modelValue', 'input', 'click', 'pointerdown', 'pointerup'])
const colorCls = computed(() => {
  if (props.error) {
    return 'text-error-container bg-surface-base border-error-5 focus:border-error-5'
  }
  switch (props.color) {
    case 'secondary':
      return 'text-surface-on bg-surface-base border-surface-high focus:border-secondary-5'
    case 'tertiary':
      return 'text-surface-on bg-surface-base border-surface-high focus:border-tertiary-5'
    case 'error':
      return 'text-surface-on bg-surface-base border-surface-high focus:border-error-5'
    case 'primary':
    default:
      return 'text-surface-on bg-surface-base border-surface-high focus:border-primary-5'
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
    class="bg-back-2 border px-2 py-1 outline-none"
    :class="[colorCls, disabledCls, rounded.class]"
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
