<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'
import { useId } from '@/composables'
import { useComponentDefaults, useInputColorStyle, useTheme } from '@/shared'
import { useRounded } from '@/utils/classGenerator'

export type TextFieldFormatFn = (value: string) => string
export interface TextFieldParseContext {
  event?: Event
  previousDisplay: string
  previousValue: string
}
export interface TextFieldFormatConfig {
  format: TextFieldFormatFn
  parse?: (value: string, context: TextFieldParseContext) => string
}
export type TextFieldFormat = TextFieldFormatFn | TextFieldFormatConfig

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
    format?: TextFieldFormat
    partialVisible?: boolean
    visibleStart?: number
    visibleEnd?: number
  }>(),
  {
    color: undefined,
    rounded: undefined,
    size: undefined,
    visibleStart: 2,
    visibleEnd: 2,
  },
)
const theme = useTheme()
const componentDefaults = useComponentDefaults('TextField')

// Build effective props merged with theme defaults
const effectiveProps = computed(() => ({
  ...props,
  color: props.color ?? componentDefaults?.color ?? theme.value.defaultColor,
  rounded: props.rounded ?? componentDefaults?.rounded ?? theme.value.rounded,
  size: props.size ?? componentDefaults?.size ?? theme.value.defaultSize,
}))
const model = defineModel<string | number>()
const sizeCls = computed(() => {
  switch (effectiveProps.value.size) {
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
    // case 'md': covered in default branch
    default: {
      return {
        wrapper: 'h-8 text-sm gap-2 px-3',
        input: 'py-1',
      }
    }
  }
})

const labelSizeCls = computed(() => {
  switch (effectiveProps.value.size) {
    case 'sm': {
      return 'text-xs'
    }
    case 'lg': {
      return 'md-md'
    }
    // case 'md': covered in default branch
    default: {
      return 'text-sm'
    }
  }
})
const color = computed(() => effectiveProps.value.color)
const colorStyle = useInputColorStyle(color)
const disabledCls = computed(() => {
  if (props.disabled) {
    return 'pointer-events-none select-none filter opacity-60'
  }
  return ''
})

const rounded = useRounded(effectiveProps.value)

const input = ref<HTMLInputElement | null>(null)
defineExpose({
  el: input,
})
const attrs = useAttrs()
const id = useId(attrs)

// Internal display value to support formatting
function formatValue(value: string): string {
  if (!props.format) {
    return value
  }
  if (typeof props.format === 'function') {
    return props.format(value)
  }
  return props.format.format(value)
}

const displayValue = ref(
  props.password && props.partialVisible
    ? getMaskedValue(model.value?.toString() || '')
    : formatValue(model.value?.toString() || ''),
)

function parseValue(value: string, event?: Event): string {
  if (!props.format) {
    return value
  }
  if (typeof props.format === 'function' || !props.format.parse) {
    return value
  }
  return props.format.parse(value, {
    event,
    previousDisplay: displayValue.value,
    previousValue: model.value?.toString() || '',
  })
}

// Masked value helper for partially visible passwords
function getMaskedValue(value: string) {
  if (!value || value.length <= props.visibleStart + props.visibleEnd) {
    return value
  }

  const start = value.slice(0, props.visibleStart)
  const end = value.slice(-props.visibleEnd)
  const hiddenLength = value.length - props.visibleStart - props.visibleEnd
  const masked = '*'.repeat(hiddenLength)

  return start + masked + end
}

// Handle input events
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const currentValue = target.value

  if (props.password && props.partialVisible) {
    // Partial password visibility: update actual value then mask display
    model.value = currentValue
    displayValue.value = getMaskedValue(currentValue)
    props.onChange?.(currentValue)

    // Preserve cursor position
    const cursorPos = target.selectionStart || 0

    // Restore cursor position on next tick
    setTimeout(() => {
      if (target) {
        target.setSelectionRange(cursorPos, cursorPos)
      }
    }, 0)
  }
  else {
    // Standard mode
    // Persist the unformatted value
    const parsedValue = parseValue(currentValue, event)
    model.value = parsedValue
    displayValue.value = formatValue(parsedValue)
    props.onChange?.(parsedValue)
  }
}

// Sync display value when model changes
watch(model, (newValue) => {
  if (props.password && props.partialVisible) {
    displayValue.value = getMaskedValue(newValue?.toString() || '')
    return
  }
  displayValue.value = formatValue(newValue?.toString() || '')
})

watch(
  () => props.format,
  () => {
    if (props.password && props.partialVisible) {
      displayValue.value = getMaskedValue(model.value?.toString() || '')
      return
    }
    displayValue.value = formatValue(model.value?.toString() || '')
  },
)
</script>

<template>
  <div
    :style="[colorStyle]"
    v-bind="$attrs"
  >
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
      class="custom-input-colors outline-none border inline-flex items-center"
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
        :value="displayValue"
        :disabled="disabled"
        class="outline-none bg-transparent flex-1"
        :class="[sizeCls.input]"
        :placeholder="placeholder"
        :type="props.password && !props.partialVisible ? 'password' : 'text'"
        @input="handleInput"
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
