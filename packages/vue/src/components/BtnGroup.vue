<script setup lang="ts">
import { computed } from 'vue'

type T = string | { value: string, label?: string, icon?: string }
const props = withDefaults(defineProps<{
  selections: T[]
  default?: T
  color?: 'primary' | 'secondary' | 'tertiary' | 'error'
  unselectable?: boolean
}>(), {
  color: 'primary',
  unselectable: undefined,
})

const unselectable = computed(() => {
  if (props.unselectable === undefined) {
    return props.selections.length === 1
  }
  return props.unselectable
})

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
  model.value = getValue(selection) === model.value && unselectable.value ? undefined : getValue(selection)
}
const isSingle = computed(() => props.selections.length === 1)
const childClass = computed(() => isSingle.value ? null : 'first-children:rounded-r-0 first-children:border-r-none last-children:rounded-l-0 last-children:border-l-none not-first-children:rounded-l-0 not-last-children:rounded-r-0')
</script>

<template>
  <div
    class="container inline-flex w-auto"
    :class="[childClass]"
  >
    <Btn
      v-for="selection, i in props.selections"
      :key="getValue(selection)"
      :model="model"
      :variant="getValue(selection) === model ? 'filled' : undefined"
      :color="props.color"
      :class="{
        'border-x-none': i !== 0 && i !== props.selections.length - 1,
      }"
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
