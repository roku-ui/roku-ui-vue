<script lang="tsx" setup>
import type { Rounded, Size } from '@/types'
import type { VNodeChild } from 'vue'
import { useRounded } from '@/utils'
import { isDivider, isLabel, isMenuItem, someHasIcon } from '@/utils/menu'
import { isClient } from '@vueuse/core'
import { computed, provide, ref, watchEffect } from 'vue'

export type MenuData = MenuItemData | MenuDividerData | MenuLabelData

export interface MenuItemData {
  title?: string
  value?: number | string | symbol
  icon?: string
  render?: () => VNodeChild
  children?: MenuData[]
  size?: Size
}

export interface MenuDividerData {
  role: 'divider'
}

export interface MenuLabelData {
  role: 'label'
  title: string
}

export interface MenuProps {
  rounded?: Rounded
  color?: string
}

const props = withDefaults(defineProps<{
  rounded?: Rounded
  enterActiveClass?: string
  leaveActiveClass?: string
  data?: MenuData[]
  trigger?: 'click' | 'hover' | 'contextmenu'
  classes?: {
    wrapper?: string | string[] | Record<string, boolean>
    trigger?: string | string[] | Record<string, boolean>
    dropdown?: string | string[] | Record<string, boolean>
  }
} & MenuProps>(), {
  rounded: 'md',
  size: 'md',
  enterActiveClass: 'animate-keyframes-zoom-in animate-duration-0.1s',
  leaveActiveClass: 'animate-keyframes-zoom-out animate-duration-0.1s',
  trigger: 'click',
  color: 'primary',
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
  if (props.trigger !== 'click' || e.button !== 0) {
    return
  }
  e.stopPropagation()
  e.preventDefault()
  toggle()
})

const hover = useElementHover(menuTriggerRef, {
  delayLeave: 100,
})

const dropdownHover = useElementHover(menuDropdownRef, {
  delayLeave: 100,
})

watchEffect(() => {
  if (props.trigger !== 'hover') {
    return
  }
  if (hover.value || dropdownHover.value) {
    toggle(true)
  }
  else {
    toggle(false)
  }
})

const openPosition = ref<{ x: number, y: number }>({ x: 0, y: 0 })

useEventListener(menuTriggerRef, 'contextmenu', (e) => {
  if (props.trigger !== 'contextmenu') {
    return
  }
  e.stopPropagation()
  e.preventDefault()
  toggle()
  const baseDom = menuWrapperRef.value
  const rect = baseDom?.getBoundingClientRect()
  if (!rect) {
    return
  }
  openPosition.value = { x: e.clientX - rect.left, y: e.clientY - rect.top }
})

onClickOutside(menuDropdownRef, () => {
  toggle(false)
}, {
  capture: true,
})

useEventListener(window, 'contextmenu', () => {
  toggle(false)
})

const menuCurrentIdx = ref<number[]>([-1])
watchEffect(() => {
  if (!finalValue.value) {
    menuCurrentIdx.value = [-1]
  }
})
provide('menuCurrentIdx', menuCurrentIdx)

function getLength(data: MenuData[], idx: number[]): number {
  const items = data
  if (idx.length <= 1) {
    return items.length
  }
  const cur = items[idx[0]]
  if (!isMenuItem(cur) || cur.children === undefined) {
    return 0
  }
  const children = cur.children
  return getLength(children, idx.slice(1))
}

const maxIdx = computed(() => {
  if (props.data === undefined) {
    return 0
  }
  return getLength(props.data, menuCurrentIdx.value)
})
const items = computed(() => {
  return props.data
})
onKeyStroke('ArrowDown', (e) => {
  if (!finalValue.value) {
    return
  }
  e.preventDefault()
  const idx = menuCurrentIdx.value

  const lastIdx = idx[idx.length - 1]
  let nextIdx = (lastIdx + 1) % maxIdx.value
  while (
    !isMenuItem(getMenuItemData(items.value, [...idx.slice(0, idx.length - 1), nextIdx])) || getMenuItemData(items.value, [...idx.slice(0, idx.length - 1), nextIdx])?.render) {
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
  while (
    !isMenuItem(getMenuItemData(items.value, [...idx.slice(0, idx.length - 1), nextIdx]))
    || getMenuItemData(items.value, [...idx.slice(0, idx.length - 1), nextIdx])?.render
  ) {
    nextIdx = (nextIdx - 1 + maxIdx.value) % maxIdx.value
  }
  menuCurrentIdx.value = [...idx.slice(0, idx.length - 1), nextIdx]
})

onKeyStroke('ArrowRight', (e) => {
  if (!finalValue.value) {
    return
  }
  e.preventDefault()

  // 如果当前的 Data 不是 ItemData 则什么都不做
  if (!isMenuItem(getMenuItemData(items.value, menuCurrentIdx.value))) {
    return
  }

  // 如果末尾不是 - 1
  if (menuCurrentIdx.value[menuCurrentIdx.value.length - 1] !== -1) {
    // 找到目前 menuCurrentIdx 所指示的 item
    let cur = items.value
    for (let i = 0; i < menuCurrentIdx.value.length; i++) {
      if (cur === undefined) {
        return
      }
      const ci = cur[menuCurrentIdx.value[i]]
      if (!isMenuItem(ci) || ci.children === undefined) {
        return
      }
      cur = ci.children
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
  // 如果当前的 Data 不是 ItemData 则什么都不做
  if (!isMenuItem(getMenuItemData(items.value, menuCurrentIdx.value))) {
    return
  }
  // 如果 menuCurrentIdx 长度 > 1，说明存在父级
  if (menuCurrentIdx.value.length > 1) {
    menuCurrentIdx.value = menuCurrentIdx.value.slice(0, menuCurrentIdx.value.length - 1)
  }
})

function getMenuItemData(items: MenuData[] | undefined, idx: number[]): MenuItemData | undefined {
  if (idx.length === 0) {
    return undefined
  }
  let cur = items
  for (let i = 0; i < idx.length - 1; i++) {
    if (cur === undefined) {
      return undefined
    }
    const ci = cur[idx[i]]
    if (!isMenuItem(ci) || ci.children === undefined) {
      return undefined
    }
    cur = ci.children
  }
  if (cur === undefined) {
    return undefined
  }
  return cur[idx[idx.length - 1]] as MenuItemData
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
  const val = getMenuItemData(items.value, menuCurrentIdx.value)?.value
  if (val) {
    emits('select', val)
    toggle(false)
  }
})

const dropdownPositionClass = computed(() => {
  if (props.trigger === 'contextmenu') {
    return ''
  }
  else {
    return 'absolute mt-2'
  }
})

useEventListener(window, 'scroll', () => {
  if (finalValue.value) {
    toggle(false)
  }
})

const dropdownPositionStyle = computed(() => {
  const windowWidth = window.innerWidth
  const dropDownWidth = menuDropdownRef.value?.clientWidth ?? 0
  const dropDownLeft = menuDropdownRef.value?.getBoundingClientRect().left ?? 0
  const hasRightPosition = windowWidth - dropDownLeft > dropDownWidth

  const windowHeight = window.innerHeight
  const dropDownHeight = menuDropdownRef.value?.clientHeight ?? 0
  const dropDownTop = menuDropdownRef.value?.getBoundingClientRect().top ?? 0
  const hasBottomPosition = windowHeight - dropDownTop > dropDownHeight

  if (props.trigger === 'contextmenu') {
    return {
      left: `${hasRightPosition ? openPosition.value.x : openPosition.value.x - dropDownWidth}px`,
      top: `${hasBottomPosition ? openPosition.value.y : openPosition.value.y - dropDownHeight}px`,
      position: 'absolute',
    } as const
  }
  else {
    return {}
  }
})
</script>

<template>
  <div
    ref="menuWrapperRef"
    :class="[props.classes?.wrapper, {
      relative: !props.classes?.wrapper,
    }]"
  >
    <div
      ref="menuTriggerRef"
      :class="[
        props.classes?.trigger,
        {
          'w-inherit h-inherit': !props.classes?.trigger,
        },
      ]"
    >
      <slot />
    </div>
    <Transition
      :enter-active-class="props.enterActiveClass"
      :leave-active-class="props.leaveActiveClass"
    >
      <menu
        v-if="finalValue && data"
        class="relative z-1 flex justify-center"
        :style="dropdownPositionStyle"
      >
        <div
          ref="menuDropdownRef"
          :class="[rounded.class, dropdownPositionClass]"
          :style="[rounded.style]"
          class="w-64 border bg-surface p-2"
        >
          <template
            v-for="item, i in props.data"
            :key="i"
          >
            <div v-if="isLabel(item)" class="text-surface-variant-3 px-2 py-1 text-xs text-surface-dimmed">
              {{ item.title }}
            </div>
            <div v-else-if="isDivider(item)" class="my-2 border-t border-surface" />
            <template v-else>
              <component
                :is="item.render"
                v-if="item.render"
              />
              <MenuItem
                v-else
                v-bind="{ ...props, data: item }"
                :idx="[i]"
                :has-icon="someHasIcon(props.data)"
              />
            </template>
          </template>
        </div>
      </menu>
    </Transition>
  </div>
</template>
