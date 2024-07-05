<script setup lang="ts">
type T = string | { value: string, label?: string, icon?: string }
const props = defineProps<{
  selections: T[]
  default?: T
  color?: 'primary' | 'secondary' | 'tertiary' | 'error'
  unselectable?: boolean
}>()

function getLabel(selection: T) {
  return typeof selection === 'string' ? selection : selection.label ?? selection.value
}

function getValue(selection: T) {
  return typeof selection === 'string' ? selection : selection.value
}

function getIcon(selection: T) {
  return typeof selection === 'string' ? undefined : selection.icon
}
const model = defineModel<string | undefined>()
function onClick(selection: T) {
  if (getValue(selection) === model.value && props.unselectable) {
    model.value = undefined
  }
  else {
    model.value = getValue(selection)
  }
}
</script>

<template>
  <div class="inline-flex w-auto container first-children:rounded-r-0 last-children:rounded-l-0 not-first-children:rounded-l-0 not-last-children:rounded-r-0">
    <Btn
      v-for="selection in props.selections"
      :key="getValue(selection)"
      :model="model"
      :variant="getValue(selection) === model ? 'filled' : undefined"
      :color="props.color"
      @click="onClick(selection)"
    >
      <i
        v-if="getIcon(selection)"
        :class="getIcon(selection)"
      />
      {{ getLabel(selection) }}
    </btn>
  </div>
</template>
