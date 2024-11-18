<script setup lang="ts">
import type { MenuItemData, MenuProps } from './Menu.vue'
import { useRounded } from '@/utils'
import { computed, inject, ref } from 'vue'

const props = withDefaults(defineProps<{
  data: MenuItemData
  idx: number[]
} & MenuProps>(), {
  rounded: 'md',
})
const menuItemRef = ref<HTMLElement | null>(null)
const hover = useElementHover(menuItemRef, {
  delayLeave: 100,
})
const rounded = useRounded({ rounded: props.rounded })
const menuCurrentIdx = inject('menuCurrentIdx', ref<number[]>([]))
useEventListener(menuItemRef, 'pointermove', () => {
  menuCurrentIdx.value = props.idx
}, {
  capture: true,
})
const isHovering = computed(() => {
  return menuCurrentIdx.value.join() === props.idx.join()
})
// [3], [3, 0], [3, 1], [3, 2]
const isOpen = computed(() => {
  // 如果 idx 是 menuCurrentIdx 的前缀，且不完全相等，则返回 true
  return menuCurrentIdx.value.length > props.idx.length
    && menuCurrentIdx.value.slice(0, props.idx.length).join() === props.idx.join()
})
</script>

<template>
  <button
    ref="menuItemRef"
    :tabindex="-1"
    class="relative inline-block h-8 w-full flex cursor-pointer items-center gap-2 px-2"
    :class="[rounded.class, {
      'bg-surface-variant-2': isHovering,
    }]"
    :style="[rounded.style]"
  >
    <i v-if="data.icon" :class="data.icon" />
    <div>{{ data.label }}</div>
    <menu
      v-if="data.children && (hover || isOpen)"
      class="absolute left-100% top-0 ml-2 w-64 border border bg-surface bg-surface p-2"
      :class="rounded.class"
      :style="rounded.style"
    >
      <MenuItem
        v-for="child, i in data.children" :key="i" :data="child"
        :idx="[...idx, i]"
      />
    </menu>
  </button>
</template>
