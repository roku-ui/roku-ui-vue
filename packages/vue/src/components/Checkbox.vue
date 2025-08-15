<script setup lang="ts">
import type { Component } from 'vue'
import type { Color } from '@/types'
import { useEventListener } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useId } from '@/composables'
import { useColorCS, useOutlineCS as useOutlineColorCS, useSurfaceCS, useTheme, useComponentDefaults } from '@/shared'
import { useRounded } from '@/utils/classGenerator'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    animate?: boolean
    label?: string
    id?: string
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
    color?: Color
    disabled?: boolean
    icon?: string | Component
    indeterminate?: boolean
    indeterminateIcon?: string | Component
  }>(),
  {
    size: undefined,
    rounded: undefined,
    animate: true,
    color: undefined,
    indeterminate: false,
  },
)

const theme = useTheme()
const componentDefaults = useComponentDefaults('Checkbox')

// 创建带有 theme 默认值的有效 props
const effectiveProps = computed(() => ({
  ...props,
  size: props.size ?? componentDefaults?.size ?? theme.value.defaultSize,
  color: props.color ?? componentDefaults?.color ?? theme.value.defaultColor,
  rounded: props.rounded ?? componentDefaults?.rounded ?? theme.value.rounded,
}))

const emit = defineEmits<{
  change: [boolean]
}>()

const model = defineModel<boolean>({
  default: false,
})

const isActivated = ref(false)

const sizeCls = computed(() => {
  switch (effectiveProps.value.size) {
    case 'sm': {
      return {
        wrapper: 'h-4 w-4',
        icon: 'text-xs',
      }
    }
    case 'lg': {
      return {
        wrapper: 'h-6 w-6',
        icon: 'text-base',
      }
    }
    // md
    default: {
      return {
        wrapper: 'h-5 w-5',
        icon: 'text-sm',
      }
    }
  }
})

const animateCls = computed(() => props.animate
  ? 'transition-all duration-200'
  : '')

const id = useId(props)

const wrapperBGCS = useSurfaceCS('bg', { dark: 7, light: 3 })
const wrapperActiveBGCS = useColorCS(effectiveProps.value.color, 'bg', 5)
const borderCS = useSurfaceCS('border', { dark: 7, light: 3 })
const activeBorderCS = useColorCS(effectiveProps.value.color, 'border', 5)

const colorCls = computed(() => {
  const isChecked = model.value || props.indeterminate
  return {
    wrapper: isChecked ? [wrapperActiveBGCS.value.class] : [wrapperBGCS.value.class],
    border: isChecked ? [activeBorderCS.value.class] : [borderCS.value.class],
    icon: isChecked ? 'text-white' : 'text-transparent',
  }
})

const colorStyle = computed(() => {
  const isChecked = model.value || props.indeterminate
  return {
    wrapper: isChecked ? wrapperActiveBGCS.value.style : wrapperBGCS.value.style,
    border: isChecked ? activeBorderCS.value.style : borderCS.value.style,
  }
})

const rounded = useRounded(effectiveProps.value)
const outlineColor = computed(() => effectiveProps.value.color)
const outlineColorCS = useOutlineColorCS(outlineColor)

const wrapperRef = ref<HTMLElement | null>(null)
useEventListener(wrapperRef, 'keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    model.value = !model.value
  }
})

watch(model, (value) => {
  emit('change', value)
})

const displayIcon = computed(() => {
  if (props.indeterminate) {
    return props.indeterminateIcon || 'i-tabler-minus'
  }
  return props.icon || 'i-tabler-check'
})
</script>

<template>
  <div
    ref="wrapperRef"
    role="checkbox"
    tabindex="0"
    class="outline-none flex gap-2 items-center relative"
    :aria-checked="indeterminate ? 'mixed' : model"
    :style="[
      outlineColorCS.style,
      rounded.style,
      { minHeight: effectiveProps.size === 'sm' ? '24px' : effectiveProps.size === 'lg' ? '40px' : '32px' },
    ]"
    :class="[
      outlineColorCS.class,
      rounded.class,
      {
        'pointer-events-none filter-grayscale op-60': props.disabled,
      },
    ]"
  >
    <input
      :id="id"
      v-model="model"
      v-bind="$attrs"
      class="hidden"
      type="checkbox"
      :disabled="props.disabled"
    >
    <label
      class="leading-0 cursor-pointer!"
      :for="id"
    >
      <div
        class="border-2 inline-flex items-center justify-center relative"
        :class="[
          sizeCls.wrapper,
          ...colorCls.wrapper,
          ...colorCls.border,
          rounded.class,
          animateCls,
          {
            'scale-95': isActivated,
          },
        ]"
        :style="[rounded.style, colorStyle.wrapper, colorStyle.border]"
        @pointerdown="isActivated = true"
        @pointerup="isActivated = false"
        @pointerleave="isActivated = false"
        @pointerenter="$event.buttons === 1 && (isActivated = true)"
      >
        <Transition
          name="fade"
          mode="out-in"
          enter-active-class="transition-all duration-200"
          enter-from-class="scale-0 rotate-50"
          enter-to-class="scale-100 rotate-0"
          leave-active-class="transition-all duration-200"
          leave-from-class="scale-100 rotate-0"
          leave-to-class="scale-0 rotate-50"
        >
          <component
            :is="typeof displayIcon === 'string' ? 'i' : displayIcon"
            v-if="model || indeterminate"
            :class="[
              sizeCls.icon,
              colorCls.icon,
              typeof displayIcon === 'string' ? displayIcon : '',
            ]"
            class="absolute"
          />
        </Transition>
      </div>
    </label>
    <label
      v-if="label"
      :for="id"
      class="cursor-pointer select-none"
    >
      {{ label }}
    </label>
  </div>
</template>
