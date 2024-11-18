<script lang="tsx" setup>
import type { Rounded, Size } from '@/types'
import type { VNodeChild } from 'vue'
import { useRounded } from '@/utils'
import { computed, provide, ref, watchEffect } from 'vue'

export interface MenuItemData {
  label: string
  icon?: string
  render?: () => VNodeChild
  children?: MenuItemData[]
  size?: Size
}

export interface MenuProps {
  rounded?: Rounded
  items?: MenuItemData[]
}

const props = withDefaults(defineProps<{
  rounded?: Rounded
  items?: MenuItemData[]
}>(), {
  rounded: 'md',
  size: 'md',
})

const model = defineModel<boolean>({
  default: undefined,
})
const modelValue = computed(() => model.value)
const [value, toggle] = useToggle()
const finalValue = computed(() => {
  // check model value is undefined or boolean
  if (modelValue.value === undefined) {
    return value.value
  }
  return modelValue.value
})

const rounded = useRounded(props)
const menuWrapperRef = ref<HTMLElement | null>(null)
const menuTriggerRef = ref<HTMLElement | null>(null)
const menuDropdownRef = ref<HTMLElement | null>(null)
useEventListener(menuTriggerRef, 'pointerup', (e) => {
  e.stopPropagation()
  e.preventDefault()
  toggle()
})

onClickOutside(menuDropdownRef, () => {
  toggle(false)
})
const menuCurrentIdx = ref<number[]>([])
provide('menuCurrentIdx', menuCurrentIdx)

function getLength(items: MenuItemData[], idx: number[]): number {
  if (idx.length <= 1) {
    return items.length
  }
  const children = items[idx[0]].children
  if (children === undefined) {
    return 0
  }
  return getLength(children, idx.slice(1))
}

const maxIdx = computed(() => {
  if (props.items === undefined) {
    return 0
  }
  return getLength(props.items, menuCurrentIdx.value)
})
watchEffect(() => {
  console.log(maxIdx.value, menuCurrentIdx.value)
})
onKeyStroke('ArrowDown', (e) => {
  if (!finalValue.value) {
    return
  }
  e.preventDefault()
  const idx = menuCurrentIdx.value
  if (idx.length === 0) {
    menuCurrentIdx.value = [0]
    return
  }
  const lastIdx = idx[idx.length - 1]
  const nextIdx = (lastIdx + 1) % maxIdx.value
  menuCurrentIdx.value = [...idx.slice(0, idx.length - 1), nextIdx]
})

onKeyStroke('ArrowUp', (e) => {
  if (!finalValue.value) {
    return
  }
  e.preventDefault()
  const idx = menuCurrentIdx.value
  if (idx.length === 0) {
    menuCurrentIdx.value = [0]
    return
  }
  const lastIdx = idx[idx.length - 1]
  const nextIdx = (lastIdx - 1 + maxIdx.value) % maxIdx.value
  menuCurrentIdx.value = [...idx.slice(0, idx.length - 1), nextIdx]
})

onKeyStroke('ArrowRight', (e) => {
  if (!finalValue.value) {
    return
  }
  e.preventDefault()
  // 如果末尾不是 - 1
  if (menuCurrentIdx.value[menuCurrentIdx.value.length - 1] !== -1) {
    // 找到目前 menuCurrentIdx 所指示的 item
    let cur = props.items
    for (let i = 0; i < menuCurrentIdx.value.length; i++) {
      if (cur === undefined) {
        return
      }
      cur = cur[menuCurrentIdx.value[i]].children
    }
    // 如果目前 menuCurrentIdx 所指示的 item 有 children
    if (cur !== undefined) {
      // 添加一个 -1
      menuCurrentIdx.value = [...menuCurrentIdx.value, -1]
    }
  }
})

onKeyStroke('ArrowLeft', (e) => {
  if (!finalValue.value) {
    return
  }
  e.preventDefault()
  // 如果 menuCurrentIdx 不为空，则删除最后一个
  if (menuCurrentIdx.value.length > 0) {
    menuCurrentIdx.value = menuCurrentIdx.value.slice(0, menuCurrentIdx.value.length - 1)
  }
})
</script>

<template>
  <div ref="menuWrapperRef" class="relative inline-block">
    <div ref="menuTriggerRef" class="inline-block">
      <slot ref="menuTriggerRef" />
    </div>
    <menu
      v-if="finalValue"
      ref="menuDropdownRef"
      :class="[rounded.class]"
      :style="[rounded.style]"
      class="absolute left-1/2 mt-2 w-64 border border bg-surface bg-surface p-2 -translate-x-1/2"
    >
      <MenuItem
        v-for="item, i in items"
        :key="i" :data="item" v-bind="props"
        :idx="[i]"
      />
    </menu>
  </div>
</template>
