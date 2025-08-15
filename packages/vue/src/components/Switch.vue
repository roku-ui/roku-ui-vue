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
    options?: string[]
    label?: string
    id?: string
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
    color?: Color
    disabled?: boolean
    offIcon?: string | Component
    onIcon?: string | Component
    indicatorIcon?: string | Component
    onIndicatorIcon?: string | Component
    offIndicatorIcon?: string | Component
  }>(),
  {
    size: undefined,
    rounded: 'full',
    animate: true,
    color: undefined,
  },
)

const theme = useTheme()
const componentDefaults = useComponentDefaults('Switch')

// 创建带有 theme 默认值的有效 props
const effectiveProps = computed(() => ({
  ...props,
  size: props.size ?? componentDefaults?.size ?? theme.value.defaultSize,
  color: props.color ?? componentDefaults?.color ?? theme.value.defaultColor,
  rounded: props.rounded === 'full' ? 'full' : props.rounded ?? theme.value.rounded,
}))
const emit = defineEmits<{
  change: [boolean ]
}>()
const model = defineModel<boolean>({
  default: false,
})
const wrapper = ref<HTMLElement | null>(null)
const isActivated = ref(false)
const sizeCls = computed(() => {
  switch (effectiveProps.value.size) {
    case 'sm': {
      return {
        icon: 'text-xs mx-0.5',
        wrapper: 'h-4 w-8',
        indicator: isActivated.value ? 'h-3 w-4' : 'h-3 w-3',
        inactive: 'left-[calc(0.125rem-1px)]',
        active: isActivated.value ? 'left-[calc(0.875rem-1px)]' : 'left-[calc(1.125rem-1px)]',
      }
    }
    case 'lg': {
      return {
        icon: 'text-lg mx-2',
        wrapper: 'h-8 w-16',
        indicator: isActivated.value ? 'h-6 w-8' : 'h-6 w-6',
        inactive: 'left-[calc(0.25rem-1px)]',
        active: isActivated.value ? 'left-[calc(1.75rem-1px)]' : 'left-[calc(2.25rem-1px)]',
      }
    }
    // md
    default: {
      return {
        icon: 'text-sm mx-1',
        wrapper: 'h-6 w-12',
        indicator: isActivated.value ? 'h-4 w-5' : 'h-4 w-4',
        inactive: 'left-[calc(0.25rem-1px)]',
        active: isActivated.value ? 'left-[calc(1.5rem-1px)]' : 'left-[calc(1.75rem-1px)]',
      }
    }
  }
})

const animateCls = computed(() => props.animate
  ? {
      indicator: 'transition-all',
      progress: 'transition-width',
    }
  : {
      indicator: '',
      progress: '',
    })

const id = useId(props)

const wrapperBGCS = useSurfaceCS('bg', { dark: 7, light: 3 })
const wrapperActiveBGCS = useColorCS(effectiveProps.value.color, 'bg', 5)
const activeTextCS = useColorCS(effectiveProps.value.color, 'text', 5)
const colorCls = computed(() => {
  return {
    wrapper: model.value ? [wrapperActiveBGCS.value.class] : [wrapperBGCS.value.class],
    indicator: 'bg-white shadow',
  }
})
const colorStyle = computed(() => {
  return {
    wrapper: model.value ? wrapperActiveBGCS.value.style : wrapperBGCS.value.style,
    indicator: model.value ? {} : '',
  }
})
const rounded = useRounded(effectiveProps.value)
const outlineColor = computed(() => effectiveProps.value.color)
const outlineColorCS = useOutlineColorCS(outlineColor)
const wrapperRef = ref<HTMLElement | null>(null)
useEventListener(wrapperRef, 'keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    model.value = !model.value
  }
})

watch(model, (value) => {
  emit('change', value)
})
</script>

<template>
  <div
    ref="wrapperRef"
    role="switch"
    tabindex="0"
    class="outline-none flex gap-2 items-center relative"
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
    >
    <label
      class="leading-0 cursor-pointer!"
      :for="id"
    >
      <div
        ref="wrapper"
        :class="[sizeCls.wrapper, ...colorCls.wrapper, rounded.class]"
        :style="[rounded.style, colorStyle.wrapper]"
        class="inline-block relative"
        @pointerdown="isActivated = true"
        @pointerup="isActivated = false"
        @pointerleave="isActivated = false"
        @pointerenter="$event.buttons === 1 && (isActivated = true)"
      >
        <div
          class="top-50% absolute -translate-y-50%"
          :style="[rounded.style, colorStyle.indicator]"
          :class="[sizeCls.indicator, colorCls.indicator, animateCls.indicator, model ? sizeCls.active : sizeCls.inactive, rounded.class]"
        >
          <Transition
            name="fade"
            mode="out-in"
            enter-active-class="transition-all duration-300"
            enter-from-class="scale-0 "
            enter-to-class="scale-100"
            leave-active-class="transition-all duration-300"
            leave-from-class="scale-100"
            leave-to-class="scale-0"
          >
            <component
              :is="typeof props.indicatorIcon === 'string' ? 'i' : props.indicatorIcon"
              v-if="props.indicatorIcon"
              class="h-full w-full"
              :class="[typeof props.indicatorIcon === 'string' ? props.indicatorIcon : '', model ? activeTextCS.class : 'text-black']"
              :style="activeTextCS.style"
            />
            <component
              :is="typeof props.onIndicatorIcon === 'string' ? 'i' : props.onIndicatorIcon"
              v-else-if="model && props.onIndicatorIcon"
              class="h-full w-full"
              :class="[typeof props.onIndicatorIcon === 'string' ? props.onIndicatorIcon : '', model ? activeTextCS.class : 'text-black']"
              :style="activeTextCS.style"
            />
            <component
              :is="typeof props.offIndicatorIcon === 'string' ? 'i' : props.offIndicatorIcon"
              v-else-if="!model && props.offIndicatorIcon"
              class="h-full w-full"
              :class="[typeof props.offIndicatorIcon === 'string' ? props.offIndicatorIcon : '', model ? activeTextCS.class : 'text-black']"
              :style="activeTextCS.style"
            />
          </Transition>
        </div>
        <Transition
          name="fade"
          mode="out-in"
          enter-active-class="transition-all duration-300"
          enter-from-class="scale-0 rotate-50"
          enter-to-class="scale-100 rotate-0"
          leave-active-class="transition-all duration-300"
          leave-from-class="scale-100 rotate-0"
          leave-to-class="scale-0 rotate-50 "
        >
          <component
            :is="typeof props.onIcon === 'string' ? 'i' : props.onIcon"
            v-if="model && props.onIcon"
            key="on"
            class="left-0 top-1/2 absolute -translate-y-50%"
            :class="[sizeCls.icon, `text-${effectiveProps.color}-on-container-low`, typeof props.onIcon === 'string' ? props.onIcon : '']"
          />
          <component
            :is="typeof props.offIcon === 'string' ? 'i' : props.offIcon"
            v-else-if="!model && props.offIcon"
            key="off"
            class="right-0 top-1/2 absolute -translate-y-50%"
            :class="[sizeCls.icon, typeof props.offIcon === 'string' ? props.offIcon : '']"
          />
        </Transition>
      </div>
    </label>
    <label
      v-if="label"
      :for="id"
    >
      {{ label }}
    </label>
  </div>
</template>
