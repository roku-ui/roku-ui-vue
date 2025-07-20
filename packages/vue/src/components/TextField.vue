<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { useInputColorStyle } from '@/shared'
import { useRounded } from '@/utils/classGenerator'

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
    case 'sm': {
      return {
        wrapper: 'h-6 text-xs gap-1 px-2',
        input: 'py-1',
      }
    }
    case 'lg': {
      return {
        wrapper: 'h-10 text-base gap-2 px-3',
        input: 'py-2',
      }
    }
    // case 'md':
    default: {
      return {
        wrapper: 'h-8 text-sm gap-2 px-3',
        input: 'py-1',
      }
    }
  }
})

const labelSizeCls = computed(() => {
  switch (props.size) {
    case 'sm': {
      return 'text-xs'
    }
    case 'lg': {
      return 'md-md'
    }
    // case 'md':
    default: {
      return 'text-sm'
    }
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
    <div
      class="inline-flex items-center border custom-input-colors outline-none"
      :class="[disabledCls, rounded.class, sizeCls.wrapper]"
      :style="[rounded.style]"
    >
      <div
        v-if="$slots.leftSection"
        class="flex items-center justify-center"
      >
        <slot name="leftSection" />
      </div>
      <input
        :id="id"
        v-bind="$attrs"
        ref="input"
        v-model="model"
        :disabled="disabled"
        class="flex-1 bg-transparent outline-none"
        :class="[sizeCls.input]"
        :placeholder="placeholder"
        :type="props.password ? 'password' : 'text'"
      >
      <div
        v-if="$slots.rightSection"
        class="flex items-center justify-center"
      >
        <slot name="rightSection" />
      </div>
    </div>
  </div>
</template>
