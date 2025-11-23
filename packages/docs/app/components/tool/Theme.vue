<script setup lang="ts">
import { ref } from 'vue'
import { ColorInput, Paper, defaultThemeData, useContainerCS } from '@roku-ui/vue'

const surfaceColor = ref(defaultThemeData.colors.surface ?? '#121212')
const primaryColor = ref(defaultThemeData.colors.primary ?? '#3F9CDC')
const secondaryColor = ref(defaultThemeData.colors.secondary ?? '#5999A6')
const tertiaryColor = ref(defaultThemeData.colors.tertiary ?? '#F76C22')
const errorColor = ref(defaultThemeData.colors.error ?? '#F95858')

const colors = ['surface', 'primary', 'secondary', 'tertiary', 'error'] as const
const containerCSList = colors.map(d => useContainerCS('filled', d))
</script>

<template>
  <div class="flex flex-col gap-2">
    <Paper>
      <div class="flex gap-2">
        <div
          v-for="(d, i) in colors"
          :key="i"
          class="px-2 py-1 rounded flex flex-col"
          v-bind="containerCSList[i].value"
        >
          <div>
            {{ d }}
          </div>
        </div>
      </div>
    </Paper>
    <Paper class="flex flex-col gap-2">
      <ColorInput
        v-model="surfaceColor"
        with-border
        aria-label="surface"
        label="surface"
      />
      <ColorInput
        v-model="primaryColor"
        with-border
        aria-label="primary"
        label="primary"
      />
      <ColorInput
        v-model="secondaryColor"
        with-border
        aria-label="secondary"
        label="secondary"
      />
      <ColorInput
        v-model="tertiaryColor"
        with-border
        aria-label="tertiary"
        label="tertiary"
      />
      <ColorInput
        v-model="errorColor"
        aria-label="error"
        label="error"
      />
    </Paper>
  </div>
</template>
