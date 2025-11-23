<script setup lang="ts">
import type { BtnVariant, Color, IconSource, Rounded, Size } from '@/types'
import { computed } from 'vue'
import { useButtonCS, useComponentDefaults, useOutlineCS, useTheme } from '@/shared'
import { useRounded } from '@/utils'

const props = withDefaults(defineProps<{
  icon?: IconSource
  size?: Size
  variant?: BtnVariant
  color?: Color
  rounded?: Rounded
  outlineColor?: Color
  skeleton?: boolean
}>(), {
  icon: undefined,
  size: undefined,
  variant: undefined,
  color: undefined,
  rounded: undefined,
  outlineColor: undefined,
  skeleton: false,
})

const _slots = defineSlots<{
  default?: () => any
}>()

const theme = useTheme()
const componentDefaults = useComponentDefaults('Icon')

const effectiveProps = computed(() => ({
  ...props,
  size: props.size ?? componentDefaults?.size ?? theme.value.defaultSize,
  color: props.color ?? componentDefaults?.color ?? theme.value.defaultColor,
  variant: props.variant ?? componentDefaults?.variant,
  rounded: props.rounded ?? componentDefaults?.rounded ?? theme.value.rounded,
  outlineColor: props.outlineColor ?? componentDefaults?.outlineColor,
}))

const rounded = useRounded(effectiveProps.value)
const variant = computed(() => effectiveProps.value.variant ?? 'default')
const color = computed(() => effectiveProps.value.color)
const outlineColor = computed(() => effectiveProps.value.outlineColor ?? color.value)
const cs = useButtonCS(variant, color)
const outlineCS = useOutlineCS(outlineColor)
const hoverNeutralStyle = computed(() => {
  const style = cs.value.style
  const result: Record<string, string> = {}
  const pairs: Array<[string, string]> = [
    ['--d-bg-h', '--d-bg'],
    ['--l-bg-h', '--l-bg'],
    ['--d-text-h', '--d-text'],
    ['--l-text-h', '--l-text'],
    ['--d-border-h', '--d-border'],
    ['--l-border-h', '--l-border'],
  ]
  for (const [hoverKey, baseKey] of pairs) {
    const base = style[baseKey]
    const hover = style[hoverKey]
    if (base) {
      result[hoverKey] = base
    }
    else if (hover) {
      result[hoverKey] = hover
    }
  }
  return result
})

const sizeCls = computed(() => {
  switch (effectiveProps.value.size) {
    case 'sm': {
      return 'h-6 w-6 p-1'
    }
    case 'lg': {
      return 'h-10 w-10 p-2.5'
    }
    default: {
      return 'h-8 w-8 p-2'
    }
  }
})

const iconComponent = computed(() => {
  if (typeof props.icon === 'string') {
    return 'i'
  }
  return props.icon
})

const iconClass = computed(() => (typeof props.icon === 'string' ? props.icon : ''))
</script>

<template>
  <span
    v-if="skeleton"
    class="bg-container inline-flex animate-pulse"
    :class="[rounded.class, sizeCls]"
    :style="rounded.style"
  />
  <span
    v-else
    :data-size="effectiveProps.size"
    class="inline-flex select-none items-center justify-center children:flex-shrink-0"
    :style="[cs.style, hoverNeutralStyle, rounded.style, outlineCS.style]"
    :class="[cs.class, rounded.class, outlineCS.class, sizeCls]"
    v-bind="$attrs"
  >
    <component
      :is="iconComponent"
      v-if="icon"
      :class="iconClass"
    />
    <slot v-else />
  </span>
</template>
