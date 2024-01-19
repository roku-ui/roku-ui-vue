<script setup lang="ts">
import { Fragment } from 'vue'
import { directionSymbol, tabCurrentSymbol } from '../utils'

const props = withDefaults(defineProps<{
  defaultValue?: string | number | symbol
  direction?: 'horizontal' | 'vertical'
}>(), {
  direction: 'horizontal',
})

const slots = useSlots()

const valueList = computed(() => {
  const children = slots.default?.()
  //   children?.map(child => child.props.value)
  const childList = children?.flatMap<any>((child) => {
    if (child.type === Fragment) {
      return child.children!
    }
    return child
  }).filter((child) => {
    return child?.props?.value !== undefined
  }).map((d => d.props.value)) ?? []
  return childList as (string | number | symbol)[]
})

const model = defineModel<string | number | symbol>()

if (!model.value && valueList.value.length > 0) {
  model.value = valueList.value[0]
}

onMounted(() => {
  if (props.defaultValue) {
    model.value = props.defaultValue
  }
})

provide(tabCurrentSymbol, model)
const direction = computed(() => {
  return props.direction
})
provide(directionSymbol, direction)
onKeyStroke('left', () => {
  if (props.direction !== 'horizontal') {
    return
  }
  const index = model.value ? valueList.value.indexOf(model.value) : 0
  if (index > 0) {
    model.value = valueList.value[index - 1]
  }
  else {
    model.value = valueList.value[valueList.value.length - 1]
  }
})

onKeyStroke('right', () => {
  if (props.direction !== 'horizontal') {
    return
  }
  const index = model.value ? valueList.value.indexOf(model.value) : 0
  if (index < valueList.value.length - 1) {
    model.value = valueList.value[index + 1]
  }
  else {
    model.value = valueList.value[0]
  }
})

onKeyStroke('up', () => {
  if (props.direction !== 'vertical') {
    return
  }
  const index = model.value ? valueList.value.indexOf(model.value) : 0
  if (index > 0) {
    model.value = valueList.value[index - 1]
  }
  else {
    model.value = valueList.value[valueList.value.length - 1]
  }
})

onKeyStroke('down', () => {
  if (props.direction !== 'vertical') {
    return
  }
  const index = model.value ? valueList.value.indexOf(model.value) : 0
  if (index < valueList.value.length - 1) {
    model.value = valueList.value[index + 1]
  }
  else {
    model.value = valueList.value[0]
  }
})

const directionCls = computed(() => {
  switch (props.direction) {
    case 'horizontal':
      return 'flex-row'
    case 'vertical':
      return 'flex-col'
  }
})
</script>

<template>
  <div
    class="flex"
    :class="[directionCls]"
  >
    <slot />
  </div>
</template>
