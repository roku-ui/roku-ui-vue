<script setup lang="ts">
import type { CalendarMode, Color } from '@/types'
import { computed, ref } from 'vue'
import { useButtonCS, useTheme } from '@/shared'
import { useRounded } from '@/utils/classGenerator'
import { Btn } from '.'

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
  }>(),
  {
    mode: 'single',
    firstDayOfWeek: 0,
    locale: 'en-US',
    variant: 'default',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: Date | Date[] | { start: Date, end: Date } | undefined]
}>()

const theme = useTheme()

// 创建带有 theme 默认值的有效 props
const effectiveProps = computed(() => ({
  ...props,
  size: props.size ?? theme.value.defaultSize,
  color: props.color ?? theme.value.defaultColor,
  rounded: props.rounded ?? theme.value.rounded,
}))

const currentDate = ref(new Date())
const hoveredDate = ref<Date | null>(null)

const rounded = useRounded(effectiveProps.value)

const sizeCls = computed(() => {
  switch (effectiveProps.value.size) {
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

  // Helper to build a day meta (支持跨月 range 状态)
  function buildDay(date: Date, isCurrentMonth: boolean) {
    const isToday = isSameDay(date, new Date())
    const isSelected = isDateSelected(date)
    const { isInRange, isRangeStart, isRangeEnd, isPreviewRange, isPreviewEnd } = getRangeStatus(date)
    return {
      date,
      isCurrentMonth,
      isToday,
      isSelected,
      isInRange,
      isRangeStart,
      isRangeEnd,
      isPreviewRange,
      isPreviewEnd,
      isDisabled: isDateDisabled(date),
    }
  }

  // Previous month days (leading filler)
  const prevMonth = new Date(year, month, 0)
  const prevMonthDays = prevMonth.getDate()
  for (let i = 1; i <= firstDayOfWeek; i++) {
    const date = new Date(year, month - 1, prevMonthDays - firstDayOfWeek + i)
    days.push(buildDay(date, false))
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    days.push(buildDay(date, true))
  }

  // Next month days to fill the grid
  // Only fill to complete weeks, don't force 6 weeks
  const totalDaysAdded = days.length
  const remainingInWeek = (7 - (totalDaysAdded % 7)) % 7

  for (let day = 1; day <= remainingInWeek; day++) {
    const date = new Date(year, month + 1, day)
    days.push(buildDay(date, false))
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
  // 修改: 现在 isInRange 包含起始与结束日期（以前不包含）
  const isInRange = date >= range.start && date <= range.end

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
  }), computed(() => effectiveProps.value.color))
}
</script>

<template>
  <div
    class="bg-container border-container border inline-block"
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
      class="bg-container border-container flex items-center justify-between"
      :class="[sizeCls.header]"
    >
      <div class="flex gap-1 items-center">
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
        class="font-semibold text-center min-w-128px"
        :class="sizeCls.headerTitle"
      >
        {{ monthNames[currentMonth] }} {{ currentYear }}
      </div>

      <div class="flex gap-1 items-center">
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
    <div class="bg-container border-container border-x border-b border-t grid grid-cols-7 divide-x">
      <div
        v-for="weekDay in weekDayNames"
        :key="weekDay"
        class="text-surface-variant border-container text-center flex items-center justify-center"
        :class="sizeCls.weekHeader"
      >
        {{ weekDay }}
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="border-container border-x grid grid-cols-7 divide-x">
      <div
        v-for="day in calendarDays"
        :key="day.date.getTime()"
        class="border-container border-b relative"
        :class="[
          sizeCls.cell,
          {
            'bg-container': !day.isCurrentMonth,
            'opacity-50': day.isDisabled,
            'cursor-not-allowed': day.isDisabled,
            'cursor-pointer': !day.isDisabled,
            'hover:bg-container': !day.isDisabled && !day.isSelected,
          },
        ]"
        @click="selectDate(day.date)"
        @mouseenter="hoveredDate = day.date"
        @mouseleave="hoveredDate = null"
      >
        <!-- Range background (包含起止端点) -->
        <div
          v-if="day.isInRange"
          class="bg-primary opacity-20 inset-0 absolute z-0"
        />

        <!-- Preview range background (hover 预览) -->
        <div
          v-if="day.isPreviewRange"
          class="bg-primary opacity-10 inset-0 absolute z-0"
        />

        <!-- Date number -->
        <div
          class="flex items-center inset-0 justify-center absolute z-10"
          :class="{
            'text-dimmed': !day.isCurrentMonth,
            'font-medium': day.isCurrentMonth,
          }"
        >
          <span
            class="rounded-full flex h-6 w-6 items-center justify-center"
            :class="[
              {
                'bg-primary text-white font-semibold': day.isSelected || day.isRangeStart || day.isRangeEnd,
                'bg-primary text-white': day.isInRange,
                'bg-primary text-white border-2 border-dashed border-primary': day.isPreviewRange,
                'border-2 border-dashed border-primary text-white': day.isPreviewEnd,
                'ring-2 ring-primary ring-offset-1': day.isToday && !day.isSelected && !day.isRangeStart && !day.isRangeEnd && !day.isPreviewEnd,
                'text-primary font-semibold': day.isToday && !day.isSelected && !day.isRangeStart && !day.isRangeEnd && !day.isPreviewEnd,
              },
            ]"
            :style="[
              (day.isSelected || day.isRangeStart || day.isRangeEnd) ? getCellCS(day).value.style : {},
            ]"
          >
            {{ day.date.getDate() }}
          </span>
        </div>

        <!-- 背景已前置并含端点 -->
      </div>
    </div>
  </div>
</template>
