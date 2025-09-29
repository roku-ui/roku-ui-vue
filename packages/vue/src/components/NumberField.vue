<script setup lang="ts">
import { computed, watch } from 'vue'
import type { Color } from '@/types'
import TextField from './TextField.vue'
import type { TextFieldFormat } from './TextField.vue'

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
}

const supportedColors = ['primary', 'secondary', 'tertiary', 'error'] as const
type SupportedColor = (typeof supportedColors)[number]

function isSupportedColor(color: string): color is SupportedColor {
  return supportedColors.includes(color as SupportedColor)
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
})

const model = defineModel<number | string>()

const textFieldColor = computed<SupportedColor | undefined>(() => {
  const candidate = props.color
  if (!candidate) {
    return undefined
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
    const [mantissa, exponent] = valueString.split('e-')
    const mantissaDecimals = mantissa.includes('.') ? mantissa.split('.')[1].length : 0
    return Number.parseInt(exponent, 10) + mantissaDecimals
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

function handleBlur(event: FocusEvent): void {
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
    @focusout="handleBlur"
  >
    <template
      v-if="$slots.leftSection"
      #leftSection
    >
      <slot name="leftSection" />
    </template>

    <template #rightSection>
      <div
        class="flex self-stretch items-stretch"
        :class="spinnerSizeClasses.wrapper"
      >
        <div
          class="flex self-stretch flex-col overflow-hidden rounded-r-inherit border-l border-surface/20 bg-surface/4 dark:border-surface/25"
          :class="spinnerSizeClasses.container"
        >
          <button
            type="button"
            class="flex flex-1 items-center justify-center text-xs text-surface-dimmed transition-colors duration-150 hover:bg-surface/8 hover:text-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:text-surface-dimmed border-b border-surface/15 dark:border-surface/30"
            :class="spinnerSizeClasses.buttonPadding"
            :aria-label="$t ? $t('numberField.increment') : 'Increment'"
            :disabled="isIncrementDisabled"
            @click="handleStep(true)"
          >
            <div
              class="i-heroicons-chevron-up-16-solid"
              :class="spinnerSizeClasses.icon"
            />
          </button>
          <button
            type="button"
            class="flex flex-1 items-center justify-center text-xs text-surface-dimmed transition-colors duration-150 hover:bg-surface/8 hover:text-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:text-surface-dimmed"
            :class="spinnerSizeClasses.buttonPadding"
            :aria-label="$t ? $t('numberField.decrement') : 'Decrement'"
            :disabled="isDecrementDisabled"
            @click="handleStep(false)"
          >
            <div
              class="i-heroicons-chevron-down-16-solid"
              :class="spinnerSizeClasses.icon"
            />
          </button>
        </div>
      </div>
    </template>
  </TextField>
</template>
