<script setup lang="ts">
import { Calendar } from '@roku-ui/vue'
import { ref } from 'vue'

const date1 = ref<Date>(new Date())
const date2 = ref<Date>(new Date())
const date3 = ref<Date>(new Date())
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-semibold mb-3">
        Small Size
      </h3>
      <Calendar
        v-model="date1"
        size="sm"
        mode="single"
      />
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-3">
        Medium Size (Default)
      </h3>
      <Calendar
        v-model="date2"
        size="md"
        mode="single"
      />
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-3">
        Large Size
      </h3>
      <Calendar
        v-model="date3"
        size="lg"
        mode="single"
      />
    </div>
  </div>
</template>
