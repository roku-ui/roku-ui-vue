<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'
import { useId } from '@/composables'
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
    placeholder?: string
    label?: string
    format?: 'hex' | 'rgb' | 'hsl'
    showSwatch?: boolean
  }>(),
  {
    color: 'primary',
    rounded: 'md',
    size: 'md',
    format: 'hex',
    showSwatch: true,
  },
)

const model = defineModel<string>({ default: '#000000' })

const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm': {
      return {
        wrapper: 'h-6 text-xs gap-1 px-2',
        input: 'py-1',
        swatch: 'w-4 h-4',
      }
    }
    case 'lg': {
      return {
        wrapper: 'h-10 text-base gap-2 px-3',
        input: 'py-2',
        swatch: 'w-6 h-6',
      }
    }
    // case 'md':
    default: {
      return {
        wrapper: 'h-8 text-sm gap-2 px-3',
        input: 'py-1',
        swatch: 'w-5 h-5',
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
      return 'text-base'
    }
    // case 'md':
    default: {
      return 'text-sm'
    }
  }
})

const colorProp = computed(() => props.color)
const colorStyle = useInputColorStyle(colorProp)
const disabledCls = computed(() => {
  if (props.disabled) {
    return 'pointer-events-none select-none filter opacity-60'
  }
  return ''
})

const rounded = useRounded(props)

const input = ref<HTMLInputElement | null>(null)
const colorPicker = ref<HTMLInputElement | null>(null)

defineExpose({
  el: input,
})

const attrs = useAttrs()
const id = useId(attrs)

// Validate and format color value
function isValidColor(value: string): boolean {
  if (!value) {
    return false
  }

  // Check hex format
  if (value.startsWith('#')) {
    return /^#(?:[A-F0-9]{6}|[A-F0-9]{3})$/i.test(value)
  }

  // Check rgb format
  if (value.startsWith('rgb')) {
    return /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(value)
  }

  // Check hsl format
  if (value.startsWith('hsl')) {
    return /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/.test(value)
  }

  return false
}

function formatColorValue(value: string): string {
  if (!value) {
    return '#000000'
  }

  // If already in desired format, return as is
  if (props.format === 'hex' && value.startsWith('#')) {
    return value
  }

  // For now, ensure hex format for the color picker
  if (value.startsWith('#')) {
    return value
  }

  // Convert other formats to hex (simplified)
  return value.startsWith('#') ? value : '#000000'
}

const displayValue = computed(() => {
  return formatColorValue(model.value || '#000000')
})

// Handle text input changes
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value

  if (isValidColor(value) || value === '') {
    model.value = value
    props.onChange?.(value)
  }
}

// Handle color picker changes
function handleColorPickerChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
  model.value = value
  props.onChange?.(value)
}

// Sync color picker with text input
watch(() => model.value, (newValue) => {
  if (colorPicker.value && isValidColor(newValue)) {
    colorPicker.value.value = formatColorValue(newValue)
  }
}, { immediate: true })

// Open color picker when swatch is clicked
function openColorPicker() {
  if (!props.disabled && colorPicker.value) {
    // Temporarily make the color picker visible and positioned correctly
    colorPicker.value.style.opacity = '0.01'
    colorPicker.value.style.pointerEvents = 'auto'
    colorPicker.value.style.zIndex = '9999'

    // Trigger click
    colorPicker.value.click()

    // Hide it again after a short delay
    setTimeout(() => {
      if (colorPicker.value) {
        colorPicker.value.style.opacity = '0'
        colorPicker.value.style.pointerEvents = 'none'
      }
    }, 100)
  }
}
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
      <span v-else>
        {{ label }}
      </span>
    </label>
    <div
      class="custom-input-colors outline-none border inline-flex items-center relative"
      :class="[disabledCls, rounded.class, sizeCls.wrapper]"
      :style="[rounded.style]"
    >
      <div
        v-if="$slots.leftSection"
        class="flex items-center justify-center"
      >
        <slot name="leftSection" />
      </div>

      <!-- Color swatch -->
      <div
        v-if="showSwatch"
        class="border rounded-sm flex cursor-pointer items-center justify-center"
        :class="[sizeCls.swatch]"
        @click="openColorPicker"
      >
        <div
          class="rounded-sm h-full w-full"
          :style="{ backgroundColor: displayValue }"
        />
      </div>

      <!-- Hidden color picker input positioned absolutely -->
      <input
        ref="colorPicker"
        type="color"
        class="opacity-0 pointer-events-none absolute"
        :value="displayValue"
        :disabled="disabled"
        @input="handleColorPickerChange"
        @change="handleColorPickerChange"
      >

      <!-- Text input -->
      <input
        :id="id"
        v-bind="$attrs"
        ref="input"
        :value="model"
        :disabled="disabled"
        class="outline-none bg-transparent flex-1"
        :class="[sizeCls.input]"
        :placeholder="placeholder || '#000000'"
        type="text"
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
