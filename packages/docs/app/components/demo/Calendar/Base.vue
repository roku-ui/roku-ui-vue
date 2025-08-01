<script setup lang="ts">
import { Calendar } from '@roku-ui/vue'
import { ref } from 'vue'

const selectedDate = ref<Date>(new Date())
const selectedDates = ref<Date[]>([])
const selectedRange = ref<{ start: Date, end: Date }>()
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-semibold mb-3">
        Single Date Selection
      </h3>
      <div class="flex gap-4 items-start">
        <Calendar
          v-model="selectedDate"
          mode="single"
        />
        <div class="text-sm">
          <p class="font-medium">
            Selected Date:
          </p>
          <p class="text-surface-variant">
            {{ selectedDate?.toLocaleDateString() || 'None' }}
          </p>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-3">
        Multiple Date Selection
      </h3>
      <div class="flex gap-4 items-start">
        <Calendar
          v-model="selectedDates"
          mode="multiple"
          color="secondary"
        />
        <div class="text-sm max-w-48">
          <p class="font-medium">
            Selected Dates:
          </p>
          <div class="text-surface-variant space-y-1">
            <p
              v-for="date in selectedDates"
              :key="date.getTime()"
            >
              {{ date.toLocaleDateString() }}
            </p>
            <p v-if="selectedDates.length === 0">
              None
            </p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-3">
        Date Range Selection
      </h3>
      <div class="flex gap-4 items-start">
        <Calendar
          v-model="selectedRange"
          mode="range"
          color="tertiary"
        />
        <div class="text-sm">
          <p class="font-medium">
            Selected Range:
          </p>
          <div class="text-surface-variant">
            <p v-if="selectedRange?.start">
              Start: {{ selectedRange.start.toLocaleDateString() }}
            </p>
            <p v-if="selectedRange?.end">
              End: {{ selectedRange.end.toLocaleDateString() }}
            </p>
            <p v-if="!selectedRange?.start">
              No range selected
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
