<script setup lang="ts">
import type { CalendarMode, Color } from '@/types'
import { computed, ref, useAttrs } from 'vue'
import { useInputColorStyle } from '@/shared'
import { useRounded } from '@/utils/classGenerator'

const props = withDefaults(
  defineProps<{
    mode?: CalendarMode
    color?: Color
    error?: boolean
    disabled?: boolean
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
    size?: 'sm' | 'md' | 'lg'
    placeholder?: string
    label?: string
    minDate?: Date
    maxDate?: Date
    disabledDates?: Date[] | ((date: Date) => boolean)
    showWeekNumbers?: boolean
    firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    locale?: string
    dateFormat?: string
    rangeSeparator?: string
  }>(),
  {
    mode: 'single',
    color: 'primary',
    rounded: 'md',
    size: 'md',
    firstDayOfWeek: 0,
    locale: 'en-US',
    dateFormat: 'yyyy-MM-dd',
    rangeSeparator: ' ~ ',
  },
)

const model = defineModel<Date | Date[] | { start: Date; end: Date }>()

const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm': {
      return {
        base: 'h-6 px-2 py-1 text-xs',
      }
    }
    case 'lg': {
      return {
        base: 'h-10 px-4 py-2 text-base',
      }
    }
    default: {
      return {
        base: 'h-8 px-3 py-1 text-sm',
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
const popoverActive = ref(false)

defineExpose({
  el: input,
})

const attrs = useAttrs()
const id = useId(attrs)

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(props.locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

const displayValue = computed(() => {
  if (!model.value) {
    return ''
  }

  if (props.mode === 'single') {
    return formatDate(model.value as Date)
  }

  if (props.mode === 'multiple') {
    const dates = model.value as Date[]
    return dates.map(date => formatDate(date)).join(', ')
  }

  if (props.mode === 'range') {
    const range = model.value as { start: Date; end: Date }
    if (range.start && range.end) {
      return `${formatDate(range.start)}${props.rangeSeparator}${formatDate(range.end)}`
    }
    if (range.start) {
      return formatDate(range.start)
    }
    return ''
  }

  return ''
})

function handleCalendarChange(value: Date | Date[] | { start: Date; end: Date } | undefined) {
  console.log('Calendar value changed:', value)
  model.value = value
  
  // Close popover for single date selection
  if (props.mode === 'single' && value) {
    popoverActive.value = false
  }
  
  // Close popover for range selection when both dates are selected
  if (props.mode === 'range' && value && typeof value === 'object' && 'start' in value && 'end' in value && value.start && value.end) {
    popoverActive.value = false
  }
}


function handleInputKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    if (!props.disabled) {
      popoverActive.value = !popoverActive.value
    }
  }
  if (e.key === 'Escape') {
    popoverActive.value = false
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
    
    <Popover
      v-model="popoverActive"
      position="bottom-start"
      :offset="4"
      :overlay="false"
    >
      <input
        :id="id"
        ref="input"
        :value="displayValue"
        :disabled="disabled"
        :placeholder="placeholder"
        readonly
        class="w-full border custom-input-colors outline-none cursor-pointer"
        :class="[disabledCls, rounded.class, sizeCls.base]"
        :style="[rounded.style]"
        @keydown="handleInputKeydown"
      >
      
      <template #content>
        <Calendar
          :model-value="model"
          :mode="mode"
          :color="color"
          :size="size"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled-dates="disabledDates"
          :show-week-numbers="showWeekNumbers"
          :first-day-of-week="firstDayOfWeek"
          :locale="locale"
          @update:model-value="handleCalendarChange"
        />
      </template>
    </Popover>
  </div>
</template>