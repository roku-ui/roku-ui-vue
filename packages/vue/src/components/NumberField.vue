<script setup lang="ts">
import type { TextFieldFormat } from './TextField.vue'
import type { Color } from '@/types'
import { computed, ref, watch } from 'vue'
import TextField from './TextField.vue'

interface Props {
  modelValue?: number | string
  min?: number
  max?: number
  step?: number
  color?: Color
  error?: boolean
  disabled?: boolean
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
  size?: 'sm' | 'md' | 'lg'
  placeholder?: string
  label?: string
  format?: TextFieldFormat
  incrementAriaLabel?: string
  decrementAriaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  incrementAriaLabel: 'Increment',
  decrementAriaLabel: 'Decrement',
})
const supportedColors = ['primary', 'secondary', 'tertiary', 'error'] as const
type SupportedColor = (typeof supportedColors)[number]

function isSupportedColor(color: string): color is SupportedColor {
  return supportedColors.includes(color as SupportedColor)
}

const model = defineModel<number | string>()

const textFieldColor = computed<SupportedColor | undefined>(() => {
  const candidate = props.color
  if (!candidate) {
    return
  }
  if (typeof candidate !== 'string') {
    return candidate
  }
  return isSupportedColor(candidate) ? candidate : undefined
})

function sanitizeInput(value: string): string {
  if (!value) {
    return ''
  }
  let sanitized = value.replaceAll(/[^0-9.-]/g, '')
  const hasLeadingMinus = sanitized.startsWith('-')
  const withoutMinus = (hasLeadingMinus ? sanitized.slice(1) : sanitized).replaceAll('-', '')
  sanitized = hasLeadingMinus ? `-${withoutMinus}` : withoutMinus
  const dotIndex = sanitized.indexOf('.')
  if (dotIndex === -1) {
    return sanitized
  }
  const beforeDot = sanitized.slice(0, dotIndex + 1)
  const afterDot = sanitized.slice(dotIndex + 1).replaceAll('.', '')
  return `${beforeDot}${afterDot}`
}

function parseNumber(value: string): number | undefined {
  const trimmed = value.trim()
  if (!trimmed || trimmed === '-' || trimmed === '.' || trimmed === '-.' || trimmed === '+') {
    return undefined
  }
  const num = Number(trimmed)
  return Number.isNaN(num) ? undefined : num
}

function getPrecision(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }
  const valueString = value.toString()
  if (valueString.includes('e-')) {
    const parts = valueString.split('e-')
    const mantissa = parts[0]
    const exponent = parts[1]
    const mantissaDecimals = mantissa && mantissa.includes('.') ? (mantissa.split('.')[1]?.length ?? 0) : 0
    const expNum = Number.parseInt(exponent || '0', 10)
    return expNum + mantissaDecimals
  }
  const decimalPart = valueString.split('.')[1]
  return decimalPart ? decimalPart.length : 0
}

function getStepValue(increment: boolean): number {
  const currentNumeric = parseNumber(model.value?.toString() || '')
  const base = currentNumeric ?? props.min ?? 0
  const step = props.step
  const precision = Math.max(getPrecision(base), getPrecision(step))
  const factor = 10 ** precision
  const roundedBase = Math.round(base * factor)
  const roundedStep = Math.round(step * factor)
  const delta = increment ? roundedStep : -roundedStep
  const raw = (roundedBase + delta) / factor
  return raw
}

function clampValue(value: number): number {
  let result = value
  if (props.min !== undefined && result < props.min) {
    result = props.min
  }
  if (props.max !== undefined && result > props.max) {
    result = props.max
  }
  return result
}

const numericValue = computed<number | undefined>(() => {
  return parseNumber(model.value?.toString() || '')
})

const effectiveSize = computed<'sm' | 'md' | 'lg'>(() => {
  return props.size ?? 'md'
})

const spinnerSizeClasses = computed(() => {
  switch (effectiveSize.value) {
    case 'sm': {
      return {
        wrapper: '-mr-2',
        container: 'h-6',
        buttonPadding: 'px-1.5',
        icon: 'h-3 w-3',
      }
    }
    case 'lg': {
      return {
        wrapper: '-mr-3',
        container: 'h-10',
        buttonPadding: 'px-2.5',
        icon: 'h-4 w-4',
      }
    }
    default: {
      return {
        wrapper: '-mr-3',
        container: 'h-8',
        buttonPadding: 'px-2',
        icon: 'h-3.5 w-3.5',
      }
    }
  }
})

const incrementAriaLabel = computed<string>(() => {
  return props.incrementAriaLabel
})

const decrementAriaLabel = computed<string>(() => {
  return props.decrementAriaLabel
})

const isHovered = ref(false)
const isFocused = ref(false)

const isIncrementDisabled = computed<boolean>(() => {
  if (props.disabled) {
    return true
  }
  if (props.max === undefined) {
    return false
  }
  if (numericValue.value === undefined) {
    return false
  }
  return numericValue.value >= props.max
})

const isDecrementDisabled = computed<boolean>(() => {
  if (props.disabled) {
    return true
  }
  if (props.min === undefined) {
    return false
  }
  if (numericValue.value === undefined) {
    return false
  }
  return numericValue.value <= props.min
})

function handleInput(value: string | number | undefined): void {
  if (typeof value !== 'string') {
    model.value = value ?? ''
    return
  }
  const sanitized = sanitizeInput(value)
  model.value = sanitized
}

function handleFocusIn(): void {
  isFocused.value = true
}

function handleFocusOut(event: FocusEvent): void {
  isFocused.value = false
  const target = event.target
  if (!(target instanceof HTMLInputElement)) {
    return
  }
  const sanitized = sanitizeInput(target.value)
  const numeric = parseNumber(sanitized)
  if (numeric === undefined) {
    model.value = ''
    return
  }
  const clamped = clampValue(numeric)
  model.value = clamped
}

function handleStep(increment: boolean): void {
  const stepped = getStepValue(increment)
  const clamped = clampValue(stepped)
  model.value = clamped
}

function handleMouseEnter(): void {
  isHovered.value = true
}

function handleMouseLeave(): void {
  isHovered.value = false
}

function handleWheel(event: WheelEvent): void {
  if (!isHovered.value || !isFocused.value) {
    return
  }
  if (props.disabled) {
    return
  }
  if (event.deltaY === 0) {
    return
  }
  if (event.deltaY < 0) {
    if (isIncrementDisabled.value) {
      return
    }
    handleStep(true)
    return
  }
  if (isDecrementDisabled.value) {
    return
  }
  handleStep(false)
}

watch(
  model,
  (newValue) => {
    if (typeof newValue === 'number') {
      const clamped = clampValue(newValue)
      if (clamped !== newValue) {
        model.value = clamped
      }
      return
    }
    if (typeof newValue === 'string') {
      const sanitized = sanitizeInput(newValue)
      if (sanitized !== newValue) {
        model.value = sanitized
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <TextField
    :model-value="model"
    :color="textFieldColor"
    :error="error"
    :disabled="disabled"
    :rounded="rounded"
    :size="size"
    :placeholder="placeholder"
    :label="label"
    :format="format"
    type="text"
    @update:model-value="handleInput"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @wheel.prevent="handleWheel"
  >
    <template
      v-if="$slots.leftSection"
      #leftSection
    >
      <slot name="leftSection" />
    </template>

    <template #rightSection>
      <div
        class="flex items-stretch self-stretch"
        :class="spinnerSizeClasses.wrapper"
      >
        <div
          class="border-surface/20 bg-surface/4 dark:border-surface/25 border-l rounded-r-inherit flex flex-col self-stretch overflow-hidden"
          :class="spinnerSizeClasses.container"
        >
          <button
            type="button"
            class="hover:bg-surface/8 focus-visible:ring-primary border-surface/15 dark:border-surface/30 text-surface-dimmed disabled:text-surface-dimmed hover:text-surface text-xs border-b flex flex-1 transition-colors duration-150 items-center justify-center focus-visible:outline-none disabled:opacity-60 disabled:cursor-not-allowed focus-visible:ring-1"
            :class="spinnerSizeClasses.buttonPadding"
            :aria-label="incrementAriaLabel"
            :disabled="isIncrementDisabled"
            @click="handleStep(true)"
          >
            <slot name="incrementIcon">
              <div
                class="i-heroicons-chevron-up-16-solid"
                :class="spinnerSizeClasses.icon"
              />
            </slot>
          </button>
          <button
            type="button"
            class="hover:bg-surface/8 focus-visible:ring-primary text-surface-dimmed disabled:text-surface-dimmed hover:text-surface text-xs flex flex-1 transition-colors duration-150 items-center justify-center focus-visible:outline-none disabled:opacity-60 disabled:cursor-not-allowed focus-visible:ring-1"
            :class="spinnerSizeClasses.buttonPadding"
            :aria-label="decrementAriaLabel"
            :disabled="isDecrementDisabled"
            @click="handleStep(false)"
          >
            <slot name="decrementIcon">
              <div
                class="i-heroicons-chevron-down-16-solid"
                :class="spinnerSizeClasses.icon"
              />
            </slot>
          </button>
        </div>
      </div>
    </template>
  </TextField>
</template>
