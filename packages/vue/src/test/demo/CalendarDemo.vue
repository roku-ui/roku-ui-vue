<script setup lang="ts">
import { ref } from 'vue'
import { Calendar } from '../../components'

const singleDate = ref<Date>()
const multipleDates = ref<Date[]>([])
const rangeDate = ref<{ start: Date, end: Date }>()
const rangeDate2 = ref<{ start: Date, end: Date }>()

const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)
const nextWeek = new Date(today)
nextWeek.setDate(nextWeek.getDate() + 7)

// Disabled dates example - weekends
function disabledWeekends(date: Date) {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday = 0, Saturday = 6
}

// Min and max date example
const minDate = new Date()
minDate.setDate(minDate.getDate() - 30) // 30 days ago
const maxDate = new Date()
maxDate.setDate(maxDate.getDate() + 60) // 60 days from now

// Disabled specific dates
const specificDisabledDates = [
  new Date(today.getFullYear(), today.getMonth(), 15),
  new Date(today.getFullYear(), today.getMonth(), 25),
]
</script>

<template>
  <div class="p-6 space-y-8">
    <div>
      <h1 class="text-3xl text-surface font-bold mb-6">
        Calendar Component
      </h1>
      <p class="text-surface-variant text-lg mb-8">
        A flexible calendar component supporting single date, multiple dates, and date range selection.
      </p>
    </div>

    <!-- Single Date Selection -->
    <section class="space-y-4">
      <h2 class="text-2xl text-surface font-semibold">
        Single Date Selection
      </h2>
      <div class="flex flex-wrap gap-6">
        <!-- Small size -->
        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Small Size
          </h3>
          <Calendar
            v-model="singleDate"
            mode="single"
            size="sm"
          />
          <p class="text-surface-variant text-sm">
            Selected: {{ singleDate ? singleDate.toLocaleDateString() : 'None' }}
          </p>
        </div>

        <!-- Medium size (default) -->
        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Medium Size (Default)
          </h3>
          <Calendar
            v-model="singleDate"
            mode="single"
          />
          <p class="text-surface-variant text-sm">
            Selected: {{ singleDate ? singleDate.toLocaleDateString() : 'None' }}
          </p>
        </div>

        <!-- Large size -->
        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Large Size
          </h3>
          <Calendar
            v-model="singleDate"
            mode="single"
            size="lg"
          />
          <p class="text-surface-variant text-sm">
            Selected: {{ singleDate ? singleDate.toLocaleDateString() : 'None' }}
          </p>
        </div>
      </div>
    </section>

    <!-- Multiple Date Selection -->
    <section class="space-y-4">
      <h2 class="text-2xl text-surface font-semibold">
        Multiple Date Selection
      </h2>
      <div class="flex flex-wrap gap-6">
        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Select Multiple Dates
          </h3>
          <Calendar
            v-model="multipleDates"
            mode="multiple"
            color="secondary"
          />
          <div class="text-surface-variant text-sm max-w-72">
            <p class="font-medium">
              Selected ({{ multipleDates.length }}):
            </p>
            <div class="space-y-1">
              <div
                v-for="date in multipleDates"
                :key="date.getTime()"
                class="text-xs"
              >
                {{ date.toLocaleDateString() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Date Range Selection -->
    <section class="space-y-4">
      <h2 class="text-2xl text-surface font-semibold">
        Date Range Selection
      </h2>
      <div class="flex flex-wrap gap-6">
        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Interactive Range Selection (With Animation)
          </h3>
          <p class="text-surface-variant text-sm max-w-80">
            选择开始日期后，鼠标悬停在其他日期上会显示虚线预览效果，帮助您直观地看到即将选择的日期范围。
          </p>
          <Calendar
            v-model="rangeDate"
            mode="range"
            color="accent"
            :animate="true"
          />
          <div class="text-surface-variant text-sm">
            <p v-if="rangeDate?.start && rangeDate?.end">
              <span class="text-accent font-medium">已选择范围:</span>
              {{ rangeDate.start.toLocaleDateString() }} - {{ rangeDate.end.toLocaleDateString() }}
            </p>
            <p v-else-if="rangeDate?.start">
              <span class="text-accent font-medium">已选择开始日期:</span>
              {{ rangeDate.start.toLocaleDateString() }}
              <br>
              <span class="text-surface-variant-dark text-xs">请选择结束日期 (悬停查看预览)</span>
            </p>
            <p v-else>
              <span class="text-surface-variant-dark">请选择开始日期</span>
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Range Selection (No Animation)
          </h3>
          <p class="text-surface-variant text-sm max-w-80">
            禁用动画效果的范围选择模式，预览效果更加静态。
          </p>
          <Calendar
            v-model="rangeDate2"
            mode="range"
            color="secondary"
            :animate="false"
          />
          <div class="text-surface-variant text-sm">
            <p v-if="rangeDate2?.start && rangeDate2?.end">
              <span class="text-secondary font-medium">已选择范围:</span>
              {{ rangeDate2.start.toLocaleDateString() }} - {{ rangeDate2.end.toLocaleDateString() }}
            </p>
            <p v-else-if="rangeDate2?.start">
              <span class="text-secondary font-medium">已选择开始日期:</span>
              {{ rangeDate2.start.toLocaleDateString() }}
              <br>
              <span class="text-surface-variant-dark text-xs">请选择结束日期 (无动画预览)</span>
            </p>
            <p v-else>
              <span class="text-surface-variant-dark text-xs">animate=false - 请选择开始日期</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Calendar with Constraints -->
    <section class="space-y-4">
      <h2 class="text-2xl text-surface font-semibold">
        Calendar with Constraints
      </h2>
      <div class="flex flex-wrap gap-6">
        <!-- Min/Max dates -->
        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Min/Max Dates
          </h3>
          <p class="text-surface-variant text-sm">
            Range: 30 days ago to 60 days from now
          </p>
          <Calendar
            mode="single"
            :min-date="minDate"
            :max-date="maxDate"
            color="warning"
          />
        </div>

        <!-- Disabled weekends -->
        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Disabled Weekends
          </h3>
          <p class="text-surface-variant text-sm">
            Weekends are disabled
          </p>
          <Calendar
            mode="single"
            :disabled-dates="disabledWeekends"
            color="success"
          />
        </div>

        <!-- Specific disabled dates -->
        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Specific Disabled Dates
          </h3>
          <p class="text-surface-variant text-sm">
            15th and 25th are disabled
          </p>
          <Calendar
            mode="single"
            :disabled-dates="specificDisabledDates"
            color="danger"
          />
        </div>
      </div>
    </section>

    <!-- Different Variants and Colors -->
    <section class="space-y-4">
      <h2 class="text-2xl text-surface font-semibold">
        Variants and Colors
      </h2>
      <div class="flex flex-wrap gap-6">
        <!-- Default variant -->
        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Default Variant
          </h3>
          <Calendar
            mode="single"
            variant="default"
            color="primary"
          />
        </div>

        <!-- Filled variant -->
        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Filled Variant
          </h3>
          <Calendar
            mode="single"
            variant="filled"
            color="secondary"
          />
        </div>

        <!-- Light variant -->
        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Light Variant
          </h3>
          <Calendar
            mode="single"
            variant="light"
            color="accent"
          />
        </div>
      </div>
    </section>

    <!-- Different Rounded Styles -->
    <section class="space-y-4">
      <h2 class="text-2xl text-surface font-semibold">
        Rounded Styles
      </h2>
      <div class="flex flex-wrap gap-6">
        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            No Rounded
          </h3>
          <Calendar
            mode="single"
            rounded="none"
          />
        </div>

        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Small Rounded
          </h3>
          <Calendar
            mode="single"
            rounded="sm"
          />
        </div>

        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Large Rounded
          </h3>
          <Calendar
            mode="single"
            rounded="lg"
          />
        </div>
      </div>
    </section>

    <!-- Locale Examples -->
    <section class="space-y-4">
      <h2 class="text-2xl text-surface font-semibold">
        Different Locales
      </h2>
      <div class="flex flex-wrap gap-6">
        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            English (US)
          </h3>
          <Calendar
            mode="single"
            locale="en-US"
            :first-day-of-week="0"
          />
        </div>

        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Chinese (Simplified)
          </h3>
          <Calendar
            mode="single"
            locale="zh-CN"
            :first-day-of-week="1"
          />
        </div>

        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            German
          </h3>
          <Calendar
            mode="single"
            locale="de-DE"
            :first-day-of-week="1"
          />
        </div>
      </div>
    </section>
  </div>
</template>
