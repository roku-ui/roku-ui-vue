<script lang="tsx" setup>
import type { Rounded, Size } from '@/types'
import type { VNodeChild } from 'vue'
import { useRounded } from '@/utils'
import { computed, provide, ref, watchEffect } from 'vue'

export interface MenuItemData {
  label?: string
  value?: number | string | symbol
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
  enterActiveClass?: string
  leaveActiveClass?: string
  items?: MenuItemData[]
}>(), {
  rounded: 'md',
  size: 'md',
  enterActiveClass: 'animate-keyframes-zoom-in animate-duration-0.3s',
  leaveActiveClass: 'animate-keyframes-zoom-out animate-duration-0.3s',
})

const emits = defineEmits<{
  select: [value: number | string | symbol]
}>()

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
const menuCurrentIdx = ref<number[]>([-1])
watchEffect(() => {
  if (!finalValue.value) {
    menuCurrentIdx.value = [-1]
  }
})
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

onKeyStroke('ArrowDown', (e) => {
  if (!finalValue.value) {
    return
  }
  e.preventDefault()
  const idx = menuCurrentIdx.value

  const lastIdx = idx[idx.length - 1]
  let nextIdx = (lastIdx + 1) % maxIdx.value
  while (getMenuItemData(props.items, [...idx.slice(0, idx.length - 1), nextIdx])?.render) {
    nextIdx = (nextIdx + 1) % maxIdx.value
  }
  menuCurrentIdx.value = [...idx.slice(0, idx.length - 1), nextIdx]
})

onKeyStroke('ArrowUp', (e) => {
  if (!finalValue.value) {
    return
  }
  e.preventDefault()
  const idx = menuCurrentIdx.value
  const lastIdx = idx[idx.length - 1]
  if (lastIdx === -1 && idx.length === 1) {
    menuCurrentIdx.value = [maxIdx.value - 1]
    return
  }
  let nextIdx = (lastIdx - 1 + maxIdx.value) % maxIdx.value
  // jump to the next item that is not render
  while (getMenuItemData(props.items, [...idx.slice(0, idx.length - 1), nextIdx])?.render) {
    nextIdx = (nextIdx - 1 + maxIdx.value) % maxIdx.value
  }
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
      // 添加一个 0
      menuCurrentIdx.value = [...menuCurrentIdx.value, 0]
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

function getMenuItemData(items: MenuItemData[] | undefined, idx: number[]): MenuItemData | undefined {
  if (idx.length === 0) {
    return undefined
  }
  let cur = items
  for (let i = 0; i < idx.length - 1; i++) {
    if (cur === undefined) {
      return undefined
    }
    cur = cur[idx[i]].children
  }
  if (cur === undefined) {
    return undefined
  }
  return cur[idx[idx.length - 1]]
}
provide('selectMenuItem', (value: number | string | symbol) => {
  emits('select', value)
  toggle(false)
})
onKeyStroke('Enter', (e) => {
  if (!finalValue.value) {
    return
  }
  e.preventDefault()
  const val = getMenuItemData(props.items, menuCurrentIdx.value)?.value
  if (val) {
    emits('select', val)
    toggle(false)
  }
})
</script>

<template>
  <div ref="menuWrapperRef" class="relative inline-block">
    <div ref="menuTriggerRef" class="inline-block">
      <slot ref="menuTriggerRef" />
    </div>
    <Transition
      :enter-active-class="props.enterActiveClass"
      :leave-active-class="props.leaveActiveClass"
    >
      <menu
        v-if="finalValue"
        class="relative flex justify-center"
      >
        <div
          ref="menuDropdownRef"
          :class="[rounded.class]"
          :style="[rounded.style]"
          class="absolute mt-2 w-64 border bg-surface p-2"
        >
          <template
            v-for="item, i in props.items"
            :key="i"
          >
            <component :is="item.render" v-if="item.render" />
            <MenuItem
              v-else
              :data="item" v-bind="props"
              :idx="[i]"
            />
          </template>
        </div>
      </menu>
    </Transition>
  </div>
</template>
