<script setup lang="ts">
import { Calendar } from '@roku-ui/vue'
import { ref } from 'vue'

const selectedDate = ref<Date>(new Date())

const minDate = new Date()
minDate.setDate(minDate.getDate() - 5)

const maxDate = new Date()
maxDate.setDate(maxDate.getDate() + 30)

function disabledWeekends(date: Date) {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday = 0, Saturday = 6
}

const specificDisabledDates = [
  new Date(2024, 11, 25), // Christmas
  new Date(2025, 0, 1), // New Year
]
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="mb-3 text-lg font-semibold">
        Min/Max Date Restriction
      </h3>
      <div class="flex items-start gap-4">
        <Calendar
          v-model="selectedDate"
          :min-date="minDate"
          :max-date="maxDate"
          mode="single"
        />
        <div class="text-sm">
          <p class="font-medium">
            Restrictions:
          </p>
          <div class="text-surface-variant space-y-1">
            <p>Min Date: {{ minDate.toLocaleDateString() }}</p>
            <p>Max Date: {{ maxDate.toLocaleDateString() }}</p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h3 class="mb-3 text-lg font-semibold">
        Disabled Weekends
      </h3>
      <Calendar
        v-model="selectedDate"
        :disabled-dates="disabledWeekends"
        mode="single"
        color="secondary"
      />
    </div>

    <div>
      <h3 class="mb-3 text-lg font-semibold">
        Specific Disabled Dates
      </h3>
      <Calendar
        v-model="selectedDate"
        :disabled-dates="specificDisabledDates"
        mode="single"
        color="tertiary"
      />
    </div>
  </div>
</template>
