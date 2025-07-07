<script setup>
import { ref } from 'vue'

const basicValue = ref(50)
const rangeValue = ref(25)
const stepValue = ref(20)
const colorValues = ref({
  primary: 40,
  secondary: 60,
  tertiary: 30,
  error: 80,
})
const sizeValues = ref({
  sm: 30,
  md: 50,
  lg: 70,
})
const customOptions = ref(['Low', 'Medium', 'High', 'Very High'])
const customValue = ref('Medium')
const animatedValue = ref(45)
const staticValue = ref(65)
const widthValue = ref(75)
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">
      Slider Demo
    </h1>

    <!-- Basic Slider -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Basic Slider
      </h2>
      <Paper class="space-y-3">
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Volume: {{ basicValue }}%
          </label>
          <Slider
            v-model="basicValue"
            :min="0"
            :max="100"
            :step="1"
          />
        </div>
      </Paper>
    </section>

    <!-- Range Slider -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Range with Steps
      </h2>
      <Paper class="space-y-4">
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Price Range: {{ rangeValue }}
          </label>
          <Slider
            v-model="rangeValue"
            :min="0"
            :max="100"
            :step="5"
            :tick-num="5"
          />
        </div>
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Step Value: {{ stepValue }}
          </label>
          <Slider
            v-model="stepValue"
            :min="0"
            :max="100"
            :step="10"
            :tick-num="11"
          />
        </div>
      </Paper>
    </section>

    <!-- Different Sizes -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Different Sizes
      </h2>
      <Paper class="space-y-4">
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Small Slider: {{ sizeValues.sm }}
          </label>
          <Slider
            v-model="sizeValues.sm"
            size="sm"
            :min="0"
            :max="100"
          />
        </div>
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Medium Slider: {{ sizeValues.md }}
          </label>
          <Slider
            v-model="sizeValues.md"
            size="md"
            :min="0"
            :max="100"
          />
        </div>
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Large Slider: {{ sizeValues.lg }}
          </label>
          <Slider
            v-model="sizeValues.lg"
            size="lg"
            :min="0"
            :max="100"
          />
        </div>
      </Paper>
    </section>

    <!-- Different Colors -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Different Colors
      </h2>
      <Paper class="space-y-4">
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Primary: {{ colorValues.primary }}
          </label>
          <Slider
            v-model="colorValues.primary"
            color="primary"
            :min="0"
            :max="100"
          />
        </div>
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Secondary: {{ colorValues.secondary }}
          </label>
          <Slider
            v-model="colorValues.secondary"
            color="secondary"
            :min="0"
            :max="100"
          />
        </div>
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Tertiary: {{ colorValues.tertiary }}
          </label>
          <Slider
            v-model="colorValues.tertiary"
            color="tertiary"
            :min="0"
            :max="100"
          />
        </div>
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Error: {{ colorValues.error }}
          </label>
          <Slider
            v-model="colorValues.error"
            color="error"
            :min="0"
            :max="100"
          />
        </div>
      </Paper>
    </section>

    <!-- Custom Options -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Custom Options
      </h2>
      <Paper class="space-y-4">
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Quality Level: {{ customValue }}
          </label>
          <Slider
            v-model="customValue"
            :options="customOptions"
            color="primary"
          />
        </div>
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Rating Scale (1-5)
          </label>
          <Slider
            v-model="stepValue"
            :options="[1, 2, 3, 4, 5]"
            color="secondary"
          />
        </div>
      </Paper>
    </section>

    <!-- Animation Control -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Animation Control
      </h2>
      <Paper class="space-y-4">
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            With Animation: {{ animatedValue }}
          </label>
          <Slider
            v-model="animatedValue"
            :animate="true"
            :min="0"
            :max="100"
          />
        </div>
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Without Animation: {{ staticValue }}
          </label>
          <Slider
            v-model="staticValue"
            :animate="false"
            :min="0"
            :max="100"
          />
        </div>
      </Paper>
    </section>

    <!-- Width Control -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Width Control
      </h2>
      <Paper class="space-y-4">
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Custom Width (15rem): {{ widthValue }}
          </label>
          <Slider
            v-model="widthValue"
            :width="15"
            :min="0"
            :max="100"
          />
        </div>
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Minimum Width (8rem): {{ basicValue }}
          </label>
          <Slider
            v-model="basicValue"
            :min-width="8"
            :min="0"
            :max="100"
          />
        </div>
      </Paper>
    </section>

    <!-- Reverse Slider -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Reverse Slider
      </h2>
      <Paper class="space-y-4">
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Normal Direction: {{ rangeValue }}
          </label>
          <Slider
            v-model="rangeValue"
            :reverse="false"
            :min="0"
            :max="100"
          />
        </div>
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Reverse Direction: {{ rangeValue }}
          </label>
          <Slider
            v-model="rangeValue"
            :reverse="true"
            :min="0"
            :max="100"
          />
        </div>
      </Paper>
    </section>

    <!-- Alignment Demo -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Alignment with Other Components
      </h2>
      <Paper class="space-y-4">
        <div class="flex items-center gap-4">
          <TextField
            size="sm"
            placeholder="Small input"
            class="w-32"
          />
          <Btn size="sm">
            Apply
          </Btn>
          <div class="flex-1">
            <Slider
              v-model="sizeValues.sm"
              size="sm"
              :min="0"
              :max="100"
            />
          </div>
        </div>
        <div class="flex items-center gap-4">
          <TextField
            size="md"
            placeholder="Medium input"
            class="w-32"
          />
          <Btn size="md">
            Apply
          </Btn>
          <div class="flex-1">
            <Slider
              v-model="sizeValues.md"
              size="md"
              :min="0"
              :max="100"
            />
          </div>
        </div>
        <div class="flex items-center gap-4">
          <TextField
            size="lg"
            placeholder="Large input"
            class="w-32"
          />
          <Btn size="lg">
            Apply
          </Btn>
          <div class="flex-1">
            <Slider
              v-model="sizeValues.lg"
              size="lg"
              :min="0"
              :max="100"
            />
          </div>
        </div>
      </Paper>
    </section>

    <!-- Advanced Usage -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Advanced Usage
      </h2>
      <Paper class="space-y-4">
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Volume Control with Ticks
          </label>
          <Slider
            v-model="basicValue"
            :min="0"
            :max="100"
            :step="25"
            :tick-num="5"
            color="primary"
            size="lg"
          />
        </div>
        <div>
          <label class="text-surface-on mb-2 block text-sm font-medium">
            Fine-grained Control (0.1 steps)
          </label>
          <Slider
            v-model="rangeValue"
            :min="0"
            :max="10"
            :step="0.1"
            :tick-num="11"
            color="secondary"
          />
        </div>
      </Paper>
    </section>
  </div>
</template>
