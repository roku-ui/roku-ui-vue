<script setup lang="ts">
import { computed, ref } from 'vue'

const text = ref('1')
const slider = ref(47)
const apiSearch = ref('')
const apiSelected = ref()
const apiOptions = computed(() => {
  const options = [
    { id: 1, label: 'apple' },
    { id: 2, label: 'banana' },
    { id: 3, label: 'orange' },
  ].filter(option => option.label.includes(apiSearch.value))
  return options
})
const select = ref()
const selectObj = ref()
const btnGroupVal = ref()
const btnGroupOptions = [
  { label: 'Left', value: 'left', icon: 'i-tabler-align-left' },
  { label: 'Center', value: 'center', icon: 'i-tabler-align-center' },
  { label: 'Right', value: 'right', icon: 'i-tabler-align-right' },
]
const btnGroupOptionSingle = [
  { label: 'Is Active', value: 'active', icon: 'i-fluent-checkmark-12-filled' },
]
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">
      Form Controls Demo
    </h1>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Text Fields
      </h2>

      <Paper class="flex flex-wrap gap-2">
        <TextField
          v-model="text"
          password
          placeholder="Password"
        />
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <TextField
          v-model="text"
          placeholder="Placeholder"
        />
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <TextField
          v-model="text"
          label="label"
        />
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <TextField
          v-model="text"
          rounded="none"
        />
        <TextField rounded="lg" />
        <TextField rounded="full" />
        <TextField rounded="0.5rem" />
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <TextField disabled />
        <TextField
          disabled
          error
        />
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <TextField error />
        <TextField color="tertiary" />
        <TextField color="secondary" />
        <TextField color="error" />
        <TextField />
      </Paper>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Selects
      </h2>

      <Paper>
        {{ apiSearch }}
        {{ apiSelected }}
        <Select
          v-model="apiSelected"
          searchable
          aria-label="Select a fruit"
          placeholder="Select a fruit"
          :options="apiOptions"
          @input="apiSearch = $event"
        >
          <template #item="{ data }">
            <div class="flex gap-2 items-center justify-center">
              <i class="i-tabler-circle" />
              <span>{{ data.label }}</span>
            </div>
          </template>
        </Select>
      </Paper>

      <Paper>
        {{ selectObj }}
        <Select
          v-model="selectObj"
          aria-label="Select a fruit"
          placeholder="Select a fruit"
          :options="[{ id: 1, label: 'apple' }, { id: 2, label: 'banana' }, { id: 3, label: 'orange' }]"
        />
      </Paper>

      <Paper>
        {{ select }}
        <Select
          v-model="select"
          searchable
          aria-label="Select a fruit"
          placeholder="Select a fruit"
          :options="['apple', 'banana', 'orange']"
        />
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <Select aria-label="empty select" />
      </Paper>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Sliders
      </h2>

      <Paper class="flex flex-wrap gap-2 w-80">
        {{ slider.toFixed(2) }}
        <Slider v-model="slider" />
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        {{ slider.toFixed(2) }}
        <Slider
          v-model="slider"
          :step="10"
        />
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        {{ slider.toFixed(2) }}
        <Slider
          v-model="slider"
          :step="0.2"
          color="tertiary"
        />
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <Slider
          :min="2"
          :max="5"
        />
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <Slider :tick-num="5" />
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <Slider :options="['A', 'B', 'C']" />
      </Paper>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Switches
      </h2>

      <Paper class="flex flex-col gap-2 items-center">
        <Switch
          indicator-icon="i-tabler-123"
          :model-value="true"
        />
        <SchemeSwitch />
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <Switch disabled />
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <Switch />
        <Switch color="error" />
        <Switch size="sm" />
        <Switch size="lg" />
      </Paper>

      <Paper class="flex flex-wrap gap-2">
        <Switch rounded="none" />
        <Switch rounded="sm" />
        <Switch rounded="md" />
        <Switch rounded="lg" />
      </Paper>

      <Paper class="flex gap-2 items-center">
        <Switch indicator-icon="i-tabler-123" />
        <Switch on-indicator-icon="i-tabler-123" />
        <Switch off-indicator-icon="i-tabler-123" />
        <SchemeSwitch />
      </Paper>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Button Groups
      </h2>

      <Paper with-border>
        <BtnGroup
          v-model="btnGroupVal"
          :selections="btnGroupOptions"
          color="secondary"
        />
        <BtnGroup
          v-model="btnGroupVal"
          :selections="btnGroupOptionSingle"
        />
      </Paper>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Pin Input
      </h2>

      <PinInput with-border />
      <PinInput />
      <PinInput password />
    </section>
  </div>
</template>
