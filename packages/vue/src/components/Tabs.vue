<script setup lang="ts">
import type { Ref } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { computed, Fragment, onMounted, provide, ref, useSlots } from 'vue'
import { childrenElementMapSymbol, directionSymbol, tabCurrentSymbol } from '@/utils'

const props = withDefaults(defineProps<{
  defaultValue?: string | number | symbol
  direction?: 'horizontal' | 'vertical'
}>(), {
  direction: 'horizontal',
})

const slots = useSlots()

const valueList = computed(() => {
  const children = slots.default?.({})
  const childList = children?.flatMap((child: any) => {
    if (child.type === Fragment) {
      return child.children!
    }
    return child
  }).filter((child: any) => {
    return child?.props?.value !== undefined
  }).map((d: { props: { value: any } }) => d.props.value) ?? []
  return childList as (string | number | symbol)[]
})

const model = defineModel<string | number | symbol>()

if (!model.value && valueList.value.length > 0) {
  model.value = valueList.value[0]
}
const tabRef = ref<HTMLElement | null>(null)

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
const childrenElementMap = new Map<string | number | symbol, Ref<HTMLButtonElement | null>>()
provide(childrenElementMapSymbol, childrenElementMap)

onKeyStroke('ArrowLeft', (e) => {
  if (!tabRef.value?.contains(document.activeElement)) {
    return
  }
  e.preventDefault()

  if (props.direction !== 'horizontal') {
    return
  }
  const index = model.value ? valueList.value.indexOf(model.value) : 0
  const newValue = index > 0 ? valueList.value[index - 1] : valueList.value.at(-1)
  model.value = newValue
  if (newValue === undefined) {
    return
  }
  if (newValue === undefined) {
    return
  }
  const elRef = childrenElementMap.get(newValue as (string | number | symbol))
  if (elRef) {
    const el = elRef.value
    if (el) {
      el.focus()
    }
  }
})

onKeyStroke('ArrowRight', (e) => {
  if (!tabRef.value?.contains(document.activeElement)) {
    return
  }
  e.preventDefault()
  if (props.direction !== 'horizontal') {
    return
  }
  const index = model.value ? valueList.value.indexOf(model.value) : 0
  const newValue = (index < valueList.value.length - 1) ? model.value = valueList.value[index + 1] : model.value = valueList.value[0]
  model.value = newValue
  if (newValue === undefined) {
    return
  }
  const elRef = childrenElementMap.get(newValue as (string | number | symbol))
  if (elRef) {
    const el = elRef.value
    if (el) {
      el.focus()
    }
  }
})

onKeyStroke('ArrowUp', (e) => {
  if (!tabRef.value?.contains(document.activeElement)) {
    return
  }
  e.preventDefault()
  if (props.direction !== 'vertical') {
    return
  }
  const index = model.value ? valueList.value.indexOf(model.value) : 0
  const newValue = index > 0 ? valueList.value[index - 1] : valueList.value.at(-1)
  model.value = newValue
  if (newValue === undefined) {
    return
  }
  if (newValue === undefined) {
    return
  }
  const elRef = childrenElementMap.get(newValue as (string | number | symbol))
  if (elRef) {
    const el = elRef.value
    if (el) {
      el.focus()
    }
  }
})

onKeyStroke('ArrowDown', (e) => {
  if (!tabRef.value?.contains(document.activeElement)) {
    return
  }
  e.preventDefault()
  if (props.direction !== 'vertical') {
    return
  }
  const index = model.value ? valueList.value.indexOf(model.value) : 0
  const newValue = (index < valueList.value.length - 1) ? valueList.value[index + 1] : valueList.value[0]
  model.value = newValue
  if (newValue === undefined) {
    return
  }
  const elRef = childrenElementMap.get(newValue as (string | number | symbol))
  if (elRef) {
    const el = elRef.value
    if (el) {
      el.focus()
    }
  }
})

const directionCls = computed(() => {
  switch (props.direction) {
    case 'horizontal': {
      return 'flex-row'
    }
    case 'vertical': {
      return 'flex-col'
    }
    default: {
      return 'flex-row'
    }
  }
})
</script>

<template>
  <div
    ref="tabRef"
    class="inline-flex"
    :class="[directionCls]"
  >
    <slot />
  </div>
</template>
