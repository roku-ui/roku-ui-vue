<script setup lang="ts">
import { ColorInput, Paper } from '@roku-ui/vue'

const { primary, secondary, surface, tertiary, error } = inject<{
  primary: Ref<string>
  secondary: Ref<string>
  surface: Ref<string>
  tertiary: Ref<string>
  error: Ref<string>
}>('docThemeColor', {
  primary: ref('#3f9cdc'),
  secondary: ref('#5999A6'),
  tertiary: ref('#F76C22'),
  error: ref('#de3939'),
  surface: ref('#121212'),
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <Paper>
      <div class="flex gap-2">
        <div class="flex flex-col">
          <div class="text-surface-on">
            surface on
          </div>
          <div class="text-sm text-surface-on-low">
            surface on-low
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-primary-on">
            primary on
          </div>
          <div class="text-sm text-primary-on-low">
            primary on-low
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-secondary-on">
            secondary on
          </div>
          <div class="text-sm text-secondary-on-low">
            secondary on-low
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-tertiary-on">
            tertiary on
          </div>
          <div class="text-sm text-tertiary-on-low">
            tertiary on-low
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-error-on">
            error on
          </div>
          <div class="text-sm text-error-on-low">
            error on-low
          </div>
        </div>
      </div>
    </Paper>
    <Paper>
      <div class="flex gap-2">
        <div class="flex flex-col bg-primary-containerl px-2 py-1">
          <div class="text-primary-on-container">
            primary on
          </div>
          <div class="text-sm text-primary-on-container-low">
            primary on-low
          </div>
        </div>
        <div class="flex flex-col bg-secondary-container px-2 py-1">
          <div class="text-secondary-on-container">
            secondary on
          </div>
          <div class="text-sm text-secondary-on-container-low">
            secondary on-low
          </div>
        </div>
        <div class="flex flex-col bg-tertiary-container px-2 py-1">
          <div class="text-tertiary-on-container">
            tertiary on
          </div>
          <div class="text-sm text-tertiary-on-container-low">
            tertiary on-low
          </div>
        </div>
        <div class="flex flex-col bg-error-container px-2 py-1">
          <div class="text-error-on-container">
            error on
          </div>
          <div class="text-sm text-error-on-container-low">
            error on-low
          </div>
        </div>
      </div>
    </Paper>
    <Paper class="flex flex-col gap-2">
      <ColorInput
        v-model="surface"
        aria-label="surface"
        label="surface"
      />
      <ColorInput
        v-model="primary"
        aria-label="primary"
        label="primary"
      />
      <ColorInput
        v-model="secondary"
        aria-label="secondary"
        label="secondary"
      />
      <ColorInput
        v-model="tertiary"
        aria-label="tertiary"
        label="tertiary"
      />
      <ColorInput
        v-model="error"
        aria-label="error"
        label="error"
      />
    </Paper>
  </div>
</template>
