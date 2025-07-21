<script setup lang="ts">
import { ColorInput, errorColor, Paper, primaryColor, secondaryColor, surfaceColor, tertiaryColor, useContainerCS } from '@roku-ui/vue'

const colors = ['surface', 'primary', 'secondary', 'tertiary', 'error']
const containerCSList = colors.map(d => useContainerCS('filled', d))
</script>

<template>
  <div class="flex flex-col gap-2">
    <Paper>
      <div class="flex gap-2">
        <div
          v-for="(d, i) in colors"
          :key="i"
          class="flex flex-col rounded px-2 py-1"
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
