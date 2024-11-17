<script setup lang="ts">
import { useRounded } from '@/utils/classGenerator'
import { computed, ref, useAttrs } from 'vue'
import { useInputColorStyle } from '@/shared'

const props = withDefaults(
  defineProps<{
    onChange?: (value: string) => void
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
    error?: boolean
    disabled?: boolean
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
    size?: 'sm' | 'md' | 'lg'
    password?: boolean
    placeholder?: string
    label?: string
  }>(),
  {
    color: 'primary',
    rounded: 'md',
    size: 'md',
  },
)
const model = defineModel<string | number>()
const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        base: 'h-6 px-2 py-1 text-xs',
      }
    case 'lg':
      return {
        base: 'h-10 px-4 py-2 text-base',
      }
    case 'md':
    default:
      return {
        base: 'h-8 px-3 py-1 text-sm',
      }
  }
})

const labelSizeCls = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-xs'
    case 'lg':
      return 'md-md'
    case 'md':
    default:
      return 'text-sm'
  }
})
const color = computed(() => props.color)
const colorStyle = useInputColorStyle(color)
const disabledCls = computed(() => {
  if (props.disabled) {
    return 'pointer-events-none select-none filter opacity-60'
  }
  return ''
})

const rounded = useRounded(props)

const input = ref<HTMLInputElement | null>(null)
defineExpose({
  el: input,
})
const attrs = useAttrs()
const id = useId(attrs)
</script>

<template>
  <div :style="[colorStyle]">
    <label
      v-if="$slots.label || label"
      :for="id"
      class="mb-1 block"
      :class="[labelSizeCls]"
    >
      <slot
        v-if="$slots.label"
        name="label"
      />
      <span
        v-else
      >
        {{ label }}
      </span>
    </label>
    <input
      :id="id"
      v-bind="$attrs"
      ref="input"
      v-model="model"
      class="w-full border px-2 py-1 outline-none custom-input-colors"
      :class="[disabledCls, rounded.class, sizeCls.base]"
      :style="[rounded.style]"
      :placeholder="placeholder"
      :type="props.password ? 'password' : 'text'"
    >
  </div>
</template>
