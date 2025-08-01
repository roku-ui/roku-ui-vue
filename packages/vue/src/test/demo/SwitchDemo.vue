<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from '@/components'
import { Btn, Paper, TextField } from '../../components'

const basicSwitch = ref(false)
const labeledSwitch = ref(true)
const disabledSwitch = ref(false)
const colorSwitches = ref({
  primary: true,
  secondary: false,
  tertiary: true,
  error: false,
})
const sizeSwitches = ref({
  sm: true,
  md: false,
  lg: true,
})
const iconSwitches = ref({
  basic: false,
  indicator: true,
  onOff: false,
})
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">
      Switch Demo
    </h1>

    <!-- Basic Switch -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Basic Switch
      </h2>
      <Paper class="flex gap-4 items-center">
        <Switch v-model="basicSwitch" />
        <span class="text-surface-on">
          Status: {{ basicSwitch ? 'On' : 'Off' }}
        </span>
      </Paper>
    </section>

    <!-- Switch with Label -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Switch with Label
      </h2>
      <Paper class="space-y-2">
        <Switch
          v-model="labeledSwitch"
          label="Enable notifications"
        />
        <Switch
          v-model="basicSwitch"
          label="Auto-save documents"
        />
      </Paper>
    </section>

    <!-- Different Sizes -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Different Sizes
      </h2>
      <Paper class="space-y-4">
        <div class="flex gap-4 items-center">
          <Switch
            v-model="sizeSwitches.sm"
            size="sm"
            label="Small Switch"
          />
        </div>
        <div class="flex gap-4 items-center">
          <Switch
            v-model="sizeSwitches.md"
            size="md"
            label="Medium Switch"
          />
        </div>
        <div class="flex gap-4 items-center">
          <Switch
            v-model="sizeSwitches.lg"
            size="lg"
            label="Large Switch"
          />
        </div>
      </Paper>
    </section>

    <!-- Different Colors -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Different Colors
      </h2>
      <Paper class="space-y-2">
        <Switch
          v-model="colorSwitches.primary"
          color="primary"
          label="Primary Color"
        />
        <Switch
          v-model="colorSwitches.secondary"
          color="secondary"
          label="Secondary Color"
        />
        <Switch
          v-model="colorSwitches.tertiary"
          color="tertiary"
          label="Tertiary Color"
        />
        <Switch
          v-model="colorSwitches.error"
          color="error"
          label="Error Color"
        />
      </Paper>
    </section>

    <!-- Switch with Icons -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Switch with Icons
      </h2>
      <Paper class="space-y-2">
        <Switch
          v-model="iconSwitches.basic"
          label="With indicator icon"
          indicator-icon="i-heroicons-check"
        />
        <Switch
          v-model="iconSwitches.indicator"
          label="With on/off indicator icons"
          on-indicator-icon="i-heroicons-check"
          off-indicator-icon="i-heroicons-x-mark"
        />
        <Switch
          v-model="iconSwitches.onOff"
          label="With on/off background icons"
          on-icon="i-heroicons-sun"
          off-icon="i-heroicons-moon"
        />
      </Paper>
    </section>

    <!-- Disabled States -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Disabled States
      </h2>
      <Paper class="space-y-2">
        <Switch
          v-model="disabledSwitch"
          label="Disabled (Off)"
          disabled
        />
        <Switch
          :model-value="true"
          label="Disabled (On)"
          disabled
        />
      </Paper>
    </section>

    <!-- Alignment Demo -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Alignment with Other Components
      </h2>
      <Paper class="space-y-4">
        <div class="flex gap-4 items-center">
          <TextField
            size="sm"
            placeholder="Small input"
            class="w-40"
          />
          <Btn size="sm">
            Button
          </Btn>
          <Switch
            v-model="sizeSwitches.sm"
            size="sm"
          />
        </div>
        <div class="flex gap-4 items-center">
          <TextField
            size="md"
            placeholder="Medium input"
            class="w-40"
          />
          <Btn size="md">
            Button
          </Btn>
          <Switch
            v-model="sizeSwitches.md"
            size="md"
          />
        </div>
        <div class="flex gap-4 items-center">
          <TextField
            size="lg"
            placeholder="Large input"
            class="w-40"
          />
          <Btn size="lg">
            Button
          </Btn>
          <Switch
            v-model="sizeSwitches.lg"
            size="lg"
          />
        </div>
      </Paper>
    </section>

    <!-- Animation Control -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Animation Control
      </h2>
      <Paper class="space-y-2">
        <Switch
          v-model="basicSwitch"
          label="With animation (default)"
          :animate="true"
        />
        <Switch
          v-model="labeledSwitch"
          label="Without animation"
          :animate="false"
        />
      </Paper>
    </section>
  </div>
</template>
