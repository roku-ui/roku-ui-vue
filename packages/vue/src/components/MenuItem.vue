<script setup lang="ts">
import type { MenuData, MenuItemData, MenuProps } from './Menu.vue'
import { useElementHover } from '@vueuse/core'
import { computed, inject, ref, watchEffect } from 'vue'
import { useRounded } from '@/utils'
import { isDivider, isLabel, someHasIcon } from '@/utils/menu'
import { MenuItem, useOutlineCS } from '..'

const props = withDefaults(defineProps<{
  data: MenuData
  idx: number[]
  hasIcon: boolean
} & MenuProps>(), {
  rounded: 'md',
  color: 'primary',
})
const menuItemRef = ref<HTMLElement | null>(null)
const hover = useElementHover(menuItemRef, {
  delayLeave: 100,
})
const rounded = useRounded({ rounded: props.rounded })
const menuCurrentIdx = inject('menuCurrentIdx', ref<number[]>([]))

const isFocusing = computed(() => {
  return menuCurrentIdx.value.join(',') === props.idx.join(',')
})
watchEffect(() => {
  if (isFocusing.value) {
    menuItemRef.value?.focus()
  }
})

const isOpen = computed(() => {
  return menuCurrentIdx.value.length > props.idx.length
    && menuCurrentIdx.value.slice(0, props.idx.length).join(',') === props.idx.join(',')
})
const menuItemData = computed(() => props.data as MenuItemData)
const itemId = computed(() => `menu-item-${props.idx.join('-')}`)
const isDisabled = computed(() => menuItemData.value.disabled === true)
const submenuId = computed(() => menuItemData.value.children ? `${itemId.value}-submenu` : undefined)
const childHasIcon = computed(() => someHasIcon(menuItemData.value.children))

const color = computed(() => {
  return props.color
})
const outlineCS = useOutlineCS(color)
const select = inject<(item: MenuItemData, event: Event) => void>('selectMenuItem', (item) => {
  console.error('selectMenuItem is not provided', item)
})
const menuDropdownRef = ref<HTMLElement | null>(null)
const menuPositionStyle = computed(() => {
  const windowWidth = window.innerWidth
  const dropDownWidth = menuDropdownRef.value?.clientWidth ?? 0
  const dropDownLeft = menuDropdownRef.value?.getBoundingClientRect().left ?? 0
  const hasRightPosition = windowWidth - dropDownLeft > dropDownWidth

  const windowHeight = window.innerHeight
  const dropDownHeight = menuDropdownRef.value?.clientHeight ?? 0
  const dropDownTop = menuDropdownRef.value?.getBoundingClientRect().top ?? 0
  const hasBottomPosition = windowHeight - dropDownTop > dropDownHeight
  return {
    left: hasRightPosition ? '100%' : 'auto',
    right: hasRightPosition ? 'auto' : '100%',
    top: hasBottomPosition ? '0' : 'auto',
    bottom: hasBottomPosition ? 'auto' : '0',
  }
})
</script>

<template>
  <div
    v-if="isLabel(data)"
    class="px-2 py-1 text-xs text-surface-dimmed"
    role="presentation"
    aria-hidden="true"
  >
    {{ data.title }}
  </div>
  <div
    v-else-if="isDivider(data)"
    class="my-2 border-t border-surface"
    role="separator"
  />
  <template
    v-else
  >
    <button
      v-bind="outlineCS"
      :id="itemId"
      ref="menuItemRef"
      type="button"
      :tabindex="-1"
      class="relative inline-block h-8 w-full flex items-center gap-2 hover:bg-surface-variant-2 px-2 outline-2 focus-visible:outline"
      :class="[
        rounded.class,
        {
          'z-1': isFocusing,
          'bg-surface-variant-2': isOpen,
          'cursor-pointer': !isDisabled,
          'cursor-not-allowed opacity-60': isDisabled,
        },
      ]"
      :style="[rounded.style]"
      role="menuitem"
      :aria-haspopup="menuItemData.value.children ? 'menu' : undefined"
      :aria-expanded="menuItemData.value.children ? String(isOpen.value) : undefined"
      :aria-controls="submenuId"
      :aria-disabled="String(isDisabled.value)"
      @pointerdown="(event) => {
        if (isDisabled.value) {
          event.preventDefault()
          return
        }
        select(menuItemData.value, event)
      }"
    >
      <i
        v-if="menuItemData.value.icon"
        :class="menuItemData.value.icon"
        class="w-5 flex-shrink-0"
      />
      <i
        v-else-if="props.hasIcon"
        class="w-5 flex-shrink-0"
      />
      <div class="flex-grow text-truncate text-left">
        {{ menuItemData.value.title }}
      </div>
      <i
        v-if="menuItemData.value.children"
        class="i-tabler-chevron-right flex-shrink-0"
        aria-hidden="true"
      />
      <menu
        v-if="menuItemData.value.children && (hover || isOpen || isFocusing)"
        :id="submenuId"
        ref="menuDropdownRef"
        class="absolute left-100% top-0 ml-1 w-64 border bg-surface p-2"
        :class="rounded.class"
        :style="[rounded.style, menuPositionStyle]"
        role="menu"
        aria-orientation="vertical"
      >
        <MenuItem
          v-for="child, i in menuItemData.value.children"
          :key="i"
          :has-icon="childHasIcon"
          :data="child"
          :idx="[...idx, i]"
        />
      </menu>
    </button>
  </template>
</template>
