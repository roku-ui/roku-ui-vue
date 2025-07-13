<script setup lang="ts">
import type { CalendarMode, Color } from '@/types'
import { computed, ref } from 'vue'
import { useButtonCS } from '@/shared'
import { useRounded } from '@/utils/classGenerator'

const props = withDefaults(
  defineProps<{
    modelValue?: Date | Date[] | { start: Date, end: Date }
    mode?: CalendarMode
    minDate?: Date
    maxDate?: Date
    disabledDates?: Date[] | ((date: Date) => boolean)
    showWeekNumbers?: boolean
    firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    locale?: string
    size?: 'sm' | 'md' | 'lg'
    color?: Color
    variant?: 'default' | 'filled' | 'light'
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
    animate?: boolean
  }>(),
  {
    mode: 'single',
    firstDayOfWeek: 0,
    locale: 'en-US',
    size: 'md',
    color: 'primary',
    variant: 'default',
    rounded: 'md',
    animate: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: Date | Date[] | { start: Date, end: Date } | undefined]
}>()

const currentDate = ref(new Date())
const hoveredDate = ref<Date | null>(null)

const rounded = useRounded(props)

const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm': {
      return {
        container: 'p-3 text-xs w-64',
        header: 'p-2 mb-2',
        cell: 'aspect-square text-xs',
        weekHeader: 'h-6 text-xs font-medium',
        headerTitle: 'text-sm',
      }
    }
    case 'lg': {
      return {
        container: 'p-4 text-base w-80',
        header: 'p-3 mb-3',
        cell: 'aspect-square text-base',
        weekHeader: 'h-8 text-sm font-medium',
        headerTitle: 'text-lg',
      }
    }
    default: {
      return {
        container: 'p-3 text-sm w-72',
        header: 'p-2 mb-2',
        cell: 'aspect-square text-sm',
        weekHeader: 'h-7 text-xs font-medium',
        headerTitle: 'text-base',
      }
    }
  }
})

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())

const monthNames = computed(() => {
  const formatter = new Intl.DateTimeFormat(props.locale, { month: 'long' })
  return Array.from({ length: 12 }, (_, i) =>
    formatter.format(new Date(2023, i, 1)))
})

const weekDayNames = computed(() => {
  const formatter = new Intl.DateTimeFormat(props.locale, { weekday: 'short' })
  const days = []
  for (let i = 0; i < 7; i++) {
    const dayIndex = (i + props.firstDayOfWeek) % 7
    const date = new Date(2023, 0, dayIndex + 1) // Start from Sunday
    days.push(formatter.format(date))
  }
  return days
})

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const firstDayOfWeek = (firstDay.getDay() - props.firstDayOfWeek + 7) % 7
  const daysInMonth = lastDay.getDate()

  const days: Array<{
    date: Date
    isCurrentMonth: boolean
    isToday: boolean
    isSelected: boolean
    isInRange: boolean
    isRangeStart: boolean
    isRangeEnd: boolean
    isPreviewRange: boolean
    isPreviewEnd: boolean
    isDisabled: boolean
  }> = []

  // Previous month days
  const prevMonth = new Date(year, month - 1, 0)
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonth.getDate() - i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      isInRange: false,
      isRangeStart: false,
      isRangeEnd: false,
      isPreviewRange: false,
      isPreviewEnd: false,
      isDisabled: isDateDisabled(date),
    })
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const isToday = isSameDay(date, new Date())
    const isSelected = isDateSelected(date)
    const { isInRange, isRangeStart, isRangeEnd, isPreviewRange, isPreviewEnd } = getRangeStatus(date)

    days.push({
      date,
      isCurrentMonth: true,
      isToday,
      isSelected,
      isInRange,
      isRangeStart,
      isRangeEnd,
      isPreviewRange,
      isPreviewEnd,
      isDisabled: isDateDisabled(date),
    })
  }

  // Next month days to fill the grid
  // Only fill to complete weeks, don't force 6 weeks
  const totalDaysAdded = days.length
  const remainingInWeek = (7 - (totalDaysAdded % 7)) % 7

  for (let day = 1; day <= remainingInWeek; day++) {
    const date = new Date(year, month + 1, day)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      isInRange: false,
      isRangeStart: false,
      isRangeEnd: false,
      isPreviewRange: false,
      isPreviewEnd: false,
      isDisabled: isDateDisabled(date),
    })
  }

  return days
})

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate()
}

function isDateSelected(date: Date): boolean {
  if (!props.modelValue) {
    return false
  }

  if (props.mode === 'single') {
    return props.modelValue instanceof Date && isSameDay(date, props.modelValue)
  }

  if (props.mode === 'multiple') {
    return Array.isArray(props.modelValue)
      && props.modelValue.some(d => isSameDay(date, d))
  }

  if (props.mode === 'range') {
    const range = props.modelValue as { start: Date, end: Date }
    return range && range.start && range.end
      && (isSameDay(date, range.start) || isSameDay(date, range.end))
  }

  return false
}

function getRangeStatus(date: Date) {
  if (props.mode !== 'range' || !props.modelValue) {
    return { isInRange: false, isRangeStart: false, isRangeEnd: false, isPreviewRange: false, isPreviewEnd: false }
  }

  const range = props.modelValue as { start: Date, end: Date }
  if (!range.start || !range.end) {
    // Handle hover preview when only start date is selected
    if (range.start && hoveredDate.value) {
      const startDate = range.start
      const endDate = hoveredDate.value
      const [earlierDate, laterDate] = startDate <= endDate ? [startDate, endDate] : [endDate, startDate]

      const isRangeStart = isSameDay(date, earlierDate)
      const isPreviewEnd = isSameDay(date, laterDate)
      const isPreviewRange = date >= earlierDate && date <= laterDate && !isRangeStart && !isPreviewEnd

      return { isInRange: false, isRangeStart, isRangeEnd: false, isPreviewRange, isPreviewEnd }
    }

    // Only start date selected
    if (range.start) {
      const isRangeStart = isSameDay(date, range.start)
      return { isInRange: false, isRangeStart, isRangeEnd: false, isPreviewRange: false, isPreviewEnd: false }
    }

    return { isInRange: false, isRangeStart: false, isRangeEnd: false, isPreviewRange: false, isPreviewEnd: false }
  }

  const isRangeStart = isSameDay(date, range.start)
  const isRangeEnd = isSameDay(date, range.end)
  const isInRange = date >= range.start && date <= range.end && !isRangeStart && !isRangeEnd

  return { isInRange, isRangeStart, isRangeEnd, isPreviewRange: false, isPreviewEnd: false }
}

function isDateDisabled(date: Date): boolean {
  if (props.minDate && date < props.minDate) {
    return true
  }
  if (props.maxDate && date > props.maxDate) {
    return true
  }

  if (props.disabledDates) {
    if (Array.isArray(props.disabledDates)) {
      return props.disabledDates.some(d => isSameDay(date, d))
    }
    return props.disabledDates(date)
  }

  return false
}

function selectDate(date: Date) {
  if (isDateDisabled(date)) {
    return
  }

  switch (props.mode) {
    case 'single': {
      emit('update:modelValue', date)

      break
    }
    case 'multiple': {
      const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
      const existingIndex = current.findIndex(d => isSameDay(d, date))

      if (existingIndex === -1) {
        current.push(date)
      }
      else {
        current.splice(existingIndex, 1)
      }

      emit('update:modelValue', current)

      break
    }
    case 'range': {
      const current = props.modelValue as { start: Date, end: Date } | undefined

      if (!current || !current.start || (current.start && current.end)) {
        emit('update:modelValue', { start: date, end: null as any })
      }
      else if (current.start && !current.end) {
        if (date < current.start) {
          emit('update:modelValue', { start: date, end: current.start })
        }
        else {
          emit('update:modelValue', { start: current.start, end: date })
        }
      }

      break
    }
  // No default
  }
}

function navigateMonth(delta: number) {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + delta)
  currentDate.value = newDate
}

function navigateYear(delta: number) {
  const newDate = new Date(currentDate.value)
  newDate.setFullYear(newDate.getFullYear() + delta)
  currentDate.value = newDate
}

function getCellCS(day: any) {
  return useButtonCS(computed(() => {
    if (day.isSelected || day.isRangeStart || day.isRangeEnd) {
      return 'filled'
    }
    if (day.isInRange) {
      return 'light'
    }
    return 'transparent'
  }), computed(() => props.color))
}
</script>

<template>
  <div
    class="border-surface-variant-1 inline-block border bg-surface"
    :class="[
      sizeCls.container,
      rounded.class,
    ]"
    :style="[
      rounded.style,
    ]"
  >
    <!-- Header -->
    <div
      class="border-surface-variant-1 flex items-center justify-between border-b bg-surface-variant-1"
      :class="[sizeCls.header]"
    >
      <div class="flex items-center gap-1">
        <Btn
          size="sm"
          variant="transparent"
          icon
          @click="navigateYear(-1)"
        >
          <div class="i-tabler-chevrons-left" />
        </Btn>
        <Btn
          size="sm"
          variant="transparent"
          icon
          @click="navigateMonth(-1)"
        >
          <div class="i-tabler-chevron-left" />
        </Btn>
      </div>

      <div
        class="text-center font-semibold"
        :class="sizeCls.headerTitle"
      >
        {{ monthNames[currentMonth] }} {{ currentYear }}
      </div>

      <div class="flex items-center gap-1">
        <Btn
          size="sm"
          variant="transparent"
          icon
          @click="navigateMonth(1)"
        >
          <div class="i-tabler-chevron-right" />
        </Btn>
        <Btn
          size="sm"
          variant="transparent"
          icon
          @click="navigateYear(1)"
        >
          <div class="i-tabler-chevrons-right" />
        </Btn>
      </div>
    </div>

    <!-- Week headers -->
    <div class="border-surface-variant-1 grid grid-cols-7 border-b border-l bg-surface-variant-1">
      <div
        v-for="weekDay in weekDayNames"
        :key="weekDay"
        class="border-surface-variant-1 text-surface-variant flex items-center justify-center border-r text-center"
        :class="sizeCls.weekHeader"
      >
        {{ weekDay }}
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="border-surface-variant-1 grid grid-cols-7 border-l">
      <div
        v-for="day in calendarDays"
        :key="day.date.getTime()"
        class="border-surface-variant-1 relative border-b border-r transition-colors"
        :class="[
          sizeCls.cell,
          {
            'bg-surface-variant-1': !day.isCurrentMonth,
            'opacity-50': day.isDisabled,
            'cursor-not-allowed': day.isDisabled,
            'cursor-pointer': !day.isDisabled,
            'hover:bg-surface-variant-1': !day.isDisabled && !day.isSelected,
          },
        ]"
        @click="selectDate(day.date)"
        @mouseenter="hoveredDate = day.date"
        @mouseleave="hoveredDate = null"
      >
        <!-- Date number -->
        <div
          class="absolute inset-0 flex items-center justify-center"
          :class="{
            'text-surface-variant': !day.isCurrentMonth,
            'font-medium': day.isCurrentMonth,
          }"
        >
          <span
            class="h-6 w-6 flex items-center justify-center rounded-full transition-all duration-200"
            :class="[
              {
                'bg-primary text-white font-semibold': day.isSelected || day.isRangeStart || day.isRangeEnd,
                'bg-primary-light text-primary': day.isInRange,
                'bg-primary-light text-primary opacity-60 border-2 border-dashed border-primary': day.isPreviewRange,
                'border-2 border-dashed border-primary text-primary font-semibold': day.isPreviewEnd,
                'ring-2 ring-primary ring-offset-1': day.isToday && !day.isSelected && !day.isRangeStart && !day.isRangeEnd && !day.isPreviewEnd,
                'text-primary font-semibold': day.isToday && !day.isSelected && !day.isRangeStart && !day.isRangeEnd && !day.isPreviewEnd,
              },
              props.animate && day.isPreviewRange ? 'animate-pulse' : '',
              props.animate && day.isPreviewEnd ? 'animate-pulse' : '',
            ]"
            :style="[
              (day.isSelected || day.isRangeStart || day.isRangeEnd) ? getCellCS(day).value.style : {},
            ]"
          >
            {{ day.date.getDate() }}
          </span>
        </div>

        <!-- Range background -->
        <div
          v-if="day.isInRange"
          class="bg-primary-light absolute inset-0 opacity-20"
        />

        <!-- Preview range background -->
        <div
          v-if="day.isPreviewRange"
          class="bg-primary-light absolute inset-0 opacity-10"
          :class="props.animate ? 'animate-pulse' : ''"
        />
      </div>
    </div>
  </div>
</template>
