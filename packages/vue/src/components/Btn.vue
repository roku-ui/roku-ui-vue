<script setup lang="ts">
import type { Component } from 'vue'
import type { BtnVariant } from '@/types'
import { useElementHover } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useButtonCS, useOutlineCS } from '@/shared'
import { useRounded } from '@/utils/classGenerator'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    size?: 'sm' | 'md' | 'lg'
    is?: string | Component
    icon?: boolean
    pressEffect?: 'translate' | 'scale'
    variant?: BtnVariant
    hoverVariant?: BtnVariant
    color?: string
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
    disabled?: boolean
    skeleton?: boolean
    outlineColor?: string
  }>(),
  {
    rounded: 'md',
    type: 'button',
    size: 'md',
    is: 'button',
    icon: false,
    pressEffect: 'translate',
    disabled: false,
  },
)
const rounded = useRounded(props)

const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm': {
      return {
        normalContent: 'min-w-16 h-6 px-2 py-1 text-xs gap-1',
        iconContent: 'h-6 w-6 p-1',
      }
    }

    case 'lg': {
      return {
        normalContent: 'min-w-24 h-10 px-4 py-2 text-base gap-2',
        iconContent: 'h-10 w-10 p-2.5',
      }
    }
    // case 'md':
    default: {
      return {
        normalContent: 'min-w-20 h-8 px-3 py-1 text-sm gap-1.5',
        iconContent: 'h-8 w-8 p-2',
      }
    }
  }
})
const btn = ref<HTMLElement | null>(null)
const isHover = useElementHover(btn)

const variant = computed(() => {
  if (props.hoverVariant && isHover.value) {
    return props.hoverVariant
  }
  return props.variant ?? 'default'
})
const color = computed(() => props.color ?? 'primary')
const cs = useButtonCS(variant, color)
const outlineColor = computed(() => props.outlineColor ?? color.value)
const outlineCS = useOutlineCS(outlineColor)
</script>

<template>
  <div
    v-if="skeleton"
    :style="[
      rounded.style,
    ]"
    :class="sizeCls.normalContent"
    class="inline-block animate-pulse rounded-md bg-surface-variant-1"
  />
  <component
    :is="is"
    v-else
    ref="btn"
    :data-size="size"
    :type="type"
    class="flex items-center justify-center decoration-none outline-none children:flex-shrink-0"
    :style="[
      cs.style,
      rounded.style,
      outlineCS.style,
    ]"
    :class="[
      cs.class,
      rounded.class,
      outlineCS.class,
      icon ? sizeCls.iconContent : sizeCls.normalContent,
      {
        'opacity-60 pointer-events-none select-none': disabled,
        'active:translate-y-0.25': pressEffect === 'translate',
      },
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot
      v-if="$slots.leftSection"
      name="leftSection"
    />
    <slot />
    <slot
      v-if="$slots.rightSection"
      name="rightSection"
    />
  </component>
</template>
