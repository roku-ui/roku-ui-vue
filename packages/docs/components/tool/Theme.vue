<script setup lang="ts">
import { ColorInput, Paper } from '@roku-ui/vue'

const { primary, secondary, surface, tertiary, error } = inject<{
  primary: Ref<string>
  secondary: Ref<string>
  surface: Ref<string>
  tertiary: Ref<string>
  error: Ref<string>
}>('docThemeColor', {
  primary: ref('#0067cc'),
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
          <div class="text-surface-on-low text-sm">
            surface on-low
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-primary-on">
            primary on
          </div>
          <div class="text-primary-on-low text-sm">
            primary on-low
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-secondary-on">
            secondary on
          </div>
          <div class="text-secondary-on-low text-sm">
            secondary on-low
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-tertiary-on">
            tertiary on
          </div>
          <div class="text-tertiary-on-low text-sm">
            tertiary on-low
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-error-on">
            error on
          </div>
          <div class="text-error-on-low text-sm">
            error on-low
          </div>
        </div>
      </div>
    </Paper>
    <Paper>
      <div class="flex gap-2">
        <div class="bg-primary-containerd flex flex-col px-2 py-1">
          <div class="text-primary-on-container">
            primary on
          </div>
          <div class="text-primary-on-container-low text-sm">
            primary on-low
          </div>
        </div>
        <div class="bg-secondary-containerd flex flex-col px-2 py-1">
          <div class="text-secondary-on-container">
            secondary on
          </div>
          <div class="text-secondary-on-container-low text-sm">
            secondary on-low
          </div>
        </div>
        <div class="bg-tertiary-containerd flex flex-col px-2 py-1">
          <div class="text-tertiary-on-container">
            tertiary on
          </div>
          <div class="text-tertiary-on-container-low text-sm">
            tertiary on-low
          </div>
        </div>
        <div class="bg-error-containerd flex flex-col px-2 py-1">
          <div class="text-error-on-container">
            error on
          </div>
          <div class="text-error-on-container-low text-sm">
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
