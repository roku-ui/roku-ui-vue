<script setup lang="ts">
import { ref } from 'vue'
import { NumberField, Paper } from '@/components'

const basicNumber = ref(50)
const limitedNumber = ref(50)
const decimalNumber = ref(10.5)
const negativeNumber = ref(-10)
const disabledNumber = ref(100)
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">
      NumberField Demo
    </h1>

    <!-- Basic NumberField -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Basic NumberField
      </h2>
      <Paper class="space-y-4">
        <NumberField
          v-model="basicNumber"
          label="Basic Number"
          placeholder="Enter a number..."
        />
        <div class="text-sm text-surface-dimmed">
          Value: {{ basicNumber }}
        </div>
      </Paper>
    </section>

    <!-- With Min/Max Limits -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        With Min/Max Limits
      </h2>
      <Paper class="space-y-4">
        <NumberField
          v-model="limitedNumber"
          label="Number between 0 and 100"
          :min="0"
          :max="100"
          placeholder="Enter a number between 0-100..."
        />
        <div class="text-sm text-surface-dimmed">
          Value: {{ limitedNumber }} (Try entering values outside 0-100 and blur the field)
        </div>
      </Paper>
    </section>

    <!-- Decimal Numbers -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Decimal Numbers
      </h2>
      <Paper class="space-y-4">
        <NumberField
          v-model="decimalNumber"
          label="Decimal Number"
          :step="0.5"
          :min="0"
          :max="20"
          placeholder="Enter a decimal number..."
        />
        <div class="text-sm text-surface-dimmed">
          Value: {{ decimalNumber }} (Step: 0.5)
        </div>
      </Paper>
    </section>

    <!-- Negative Numbers -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Negative Numbers
      </h2>
      <Paper class="space-y-4">
        <NumberField
          v-model="negativeNumber"
          label="Negative Number"
          :min="-50"
          :max="50"
          placeholder="Enter a number..."
        />
        <div class="text-sm text-surface-dimmed">
          Value: {{ negativeNumber }} (Range: -50 to 50)
        </div>
      </Paper>
    </section>

    <!-- With Formatting -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        With Formatting
      </h2>
      <Paper class="space-y-4">
        <NumberField
          v-model="limitedNumber"
          label="Number with Comma Formatting"
          :min="0"
          :max="100000"
          :format="(value) => {
            const num = Number(value.replace(/[^\d.]/g, ''))
            return isNaN(num) ? value : num.toLocaleString()
          }"
          placeholder="Enter a large number..."
        />
        <div class="text-sm text-surface-dimmed">
          Value: {{ limitedNumber }} (Formatted with commas)
        </div>
      </Paper>
    </section>

    <!-- Disabled State -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Disabled State
      </h2>
      <Paper class="space-y-4">
        <NumberField
          v-model="disabledNumber"
          label="Disabled NumberField"
          disabled
          :min="0"
          :max="200"
        />
        <div class="text-sm text-surface-dimmed">
          Value: {{ disabledNumber }}
        </div>
      </Paper>
    </section>

    <!-- Different Sizes -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Different Sizes
      </h2>
      <Paper class="space-y-4">
        <NumberField
          v-model="basicNumber"
          size="sm"
          label="Small Size"
          :min="0"
          :max="100"
        />
        <NumberField
          v-model="basicNumber"
          size="md"
          label="Medium Size"
          :min="0"
          :max="100"
        />
        <NumberField
          v-model="basicNumber"
          size="lg"
          label="Large Size"
          :min="0"
          :max="100"
        />
      </Paper>
    </section>

    <!-- With Prefix/Suffix -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        With Prefix/Suffix
      </h2>
      <Paper class="space-y-4">
        <NumberField
          v-model="basicNumber"
          label="Price"
          :min="0"
          :max="1000"
          placeholder="0.00"
        >
          <template #leftSection>
            <span class="text-sm text-gray-500">$</span>
          </template>
        </NumberField>
        <NumberField
          v-model="basicNumber"
          label="Percentage"
          :min="0"
          :max="100"
          placeholder="0"
        >
          <template #rightSection>
            <span class="text-sm text-gray-500">%</span>
          </template>
        </NumberField>
      </Paper>
    </section>
  </div>
</template>