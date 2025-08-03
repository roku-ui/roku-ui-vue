<script setup lang="ts">
import { ref } from 'vue'
import { CalendarInput } from '../../components'

const singleDate = ref<Date>()
const multipleDate = ref<Date[]>([])
const dateRange = ref<{ start: Date, end: Date }>()

const currentDate = new Date()
const minDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
const maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0)

const singleDateWithValidation = ref<Date>()
const rangeWithValidation = ref<{ start: Date, end: Date }>()

const disabledDates = [
  new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
  new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
]

function isWeekend(date: Date) {
  const day = date.getDay()
  return day === 0 || day === 6
}
</script>

<template>
  <div class="p-6 space-y-8">
    <div class="space-y-4">
      <h2 class="text-2xl font-bold">
        CalendarInput Demo
      </h2>
      <p class="text-surface-dimmed">
        A text field that opens a calendar popup for date selection.
      </p>
    </div>

    <!-- Single Date Selection -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">
        Single Date Selection
      </h3>
      <div class="gap-4 grid grid-cols-1 md:grid-cols-3">
        <CalendarInput
          v-model="singleDate"
          mode="single"
          label="Select Date"
          placeholder="Pick a date"
          size="sm"
        />
        <CalendarInput
          v-model="singleDate"
          mode="single"
          label="Select Date (Medium)"
          placeholder="Pick a date"
          size="md"
        />
        <CalendarInput
          v-model="singleDate"
          mode="single"
          label="Select Date (Large)"
          placeholder="Pick a date"
          size="lg"
        />
      </div>
      <div class="text-sm text-gray-500">
        Selected: {{ singleDate ? singleDate.toDateString() : 'None' }}
      </div>
    </div>

    <!-- Multiple Date Selection -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">
        Multiple Date Selection
      </h3>
      <CalendarInput
        v-model="multipleDate"
        mode="multiple"
        label="Select Multiple Dates"
        placeholder="Pick multiple dates"
        class="w-full md:w-80"
      />
      <div class="text-sm text-gray-500">
        Selected: {{ multipleDate?.map(d => d.toDateString()).join(', ') || 'None' }}
      </div>
    </div>

    <!-- Date Range Selection -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">
        Date Range Selection
      </h3>
      <CalendarInput
        v-model="dateRange"
        mode="range"
        label="Select Date Range"
        placeholder="Pick a date range"
        class="w-full md:w-80"
      />
      <div class="text-sm text-gray-500">
        Selected: {{ dateRange?.start && dateRange?.end ? `${dateRange.start.toDateString()} ~ ${dateRange.end.toDateString()}` : 'None' }}
      </div>
    </div>

    <!-- Different Colors -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">
        Different Colors
      </h3>
      <div class="gap-4 grid grid-cols-1 md:grid-cols-4">
        <CalendarInput
          v-model="singleDate"
          mode="single"
          label="Primary"
          color="primary"
          placeholder="Primary color"
        />
        <CalendarInput
          v-model="singleDate"
          mode="single"
          label="Secondary"
          color="secondary"
          placeholder="Secondary color"
        />
        <CalendarInput
          v-model="singleDate"
          mode="single"
          label="Tertiary"
          color="tertiary"
          placeholder="Tertiary color"
        />
        <CalendarInput
          v-model="singleDate"
          mode="single"
          label="Error"
          color="error"
          placeholder="Error color"
        />
      </div>
    </div>

    <!-- With Validation -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">
        With Date Validation
      </h3>
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2">
        <CalendarInput
          v-model="singleDateWithValidation"
          mode="single"
          label="With Min/Max Date"
          placeholder="Only current and next month"
          :min-date="minDate"
          :max-date="maxDate"
        />
        <CalendarInput
          v-model="rangeWithValidation"
          mode="range"
          label="Range with Disabled Dates"
          placeholder="Some dates disabled"
          :disabled-dates="disabledDates"
        />
      </div>
      <div class="text-sm text-gray-500">
        Single with validation: {{ singleDateWithValidation ? singleDateWithValidation.toDateString() : 'None' }}
        <br>
        Range with validation: {{ rangeWithValidation?.start && rangeWithValidation?.end ? `${rangeWithValidation.start.toDateString()} ~ ${rangeWithValidation.end.toDateString()}` : 'None' }}
      </div>
    </div>

    <!-- Disabled Weekends -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">
        Disabled Weekends
      </h3>
      <CalendarInput
        v-model="singleDate"
        mode="single"
        label="No Weekends"
        placeholder="Weekends disabled"
        :disabled-dates="isWeekend"
        class="w-full md:w-80"
      />
    </div>

    <!-- Disabled State -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">
        Disabled State
      </h3>
      <CalendarInput
        v-model="singleDate"
        mode="single"
        label="Disabled Field"
        placeholder="This field is disabled"
        disabled
        class="w-full md:w-80"
      />
    </div>

    <!-- Different Locales -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">
        Different Locales
      </h3>
      <div class="gap-4 grid grid-cols-1 md:grid-cols-2">
        <CalendarInput
          v-model="singleDate"
          mode="single"
          label="English (US)"
          locale="en-US"
          placeholder="US format"
        />
        <CalendarInput
          v-model="singleDate"
          mode="single"
          label="Chinese (Simplified)"
          locale="zh-CN"
          placeholder="Chinese format"
        />
      </div>
    </div>

    <!-- Custom Range Separator -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">
        Custom Range Separator
      </h3>
      <CalendarInput
        v-model="dateRange"
        mode="range"
        label="Custom Separator"
        placeholder="Custom range separator"
        range-separator=" to "
        class="w-full md:w-80"
      />
    </div>
  </div>
</template>
