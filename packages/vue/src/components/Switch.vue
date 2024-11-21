<script setup lang="ts">
import type { Color } from '@/types'
import { useColorCS, useOutlineColor as useOutlineColorCS, useSurfaceCS } from '@/shared'
import { useRounded } from '@/utils/classGenerator'
import { computed, ref } from 'vue'

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
    offIcon?: string
    onIcon?: string
    value?: boolean
    indicatorIcon?: string
    onIndicatorIcon?: string
    offIndicatorIcon?: string
  }>(),
  {
    size: 'md',
    rounded: 'full',
    animate: true,
    color: 'primary',
  },
)
const model = defineModel<boolean>()
if (props.value) {
  model.value = props.value
}
const wrapper = ref<HTMLElement | null>(null)
const isActivated = ref(false)
const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        icon: 'text-xs mx-0.5',
        wrapper: 'h-4 w-8',
        indicator: isActivated.value ? 'h-3 w-4' : 'h-3 w-3',
        inactive: 'left-[calc(0.125rem-1px)]',
        active: isActivated.value ? 'left-[calc(0.875rem-1px)]' : 'left-[calc(1.125rem-1px)]',
      }
    case 'lg':
      return {
        icon: 'text-lg mx-2',
        wrapper: 'h-8 w-16',
        indicator: isActivated.value ? 'h-6 w-8' : 'h-6 w-6',
        inactive: 'left-[calc(0.25rem-1px)]',
        active: isActivated.value ? 'left-[calc(1.75rem-1px)]' : 'left-[calc(2.25rem-1px)]',
      }
    case 'md':
    default:
      return {
        icon: 'text-sm mx-1',
        wrapper: 'h-6 w-12',
        indicator: isActivated.value ? 'h-4 w-5' : 'h-4 w-4',
        inactive: 'left-[calc(0.25rem-1px)]',
        active: isActivated.value ? 'left-[calc(1.5rem-1px)]' : 'left-[calc(1.75rem-1px)]',
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
const wrapperActiveBGCS = useColorCS(props.color, 'bg', 5)
const activeTextCS = useColorCS(props.color, 'text', 5)
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
const rounded = useRounded(props)
const outlineColor = computed(() => props.color)
const outlineColorCS = useOutlineColorCS(outlineColor)
const wrapperRef = ref<HTMLElement | null>(null)
useEventListener(wrapperRef, 'keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    model.value = !model.value
  }
})
</script>

<template>
  <div
    ref="wrapperRef"
    role="switch"
    tabindex="0"
    class="relative flex items-center gap-2 outline-none"
    :style="[outlineColorCS.style, rounded.style]"
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
        class="relative inline-block"
        @pointerdown="isActivated = true"
        @pointerup="isActivated = false"
        @pointerleave="isActivated = false"
        @pointerenter="$event.buttons === 1 && (isActivated = true)"
      >
        <div
          class="absolute top-50% -translate-y-50%"
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
            <i
              v-if="props.indicatorIcon"
              class="h-full w-full"
              :class="[props.indicatorIcon, model ? activeTextCS.class : 'text-black']"
              :style="activeTextCS.style"
            />
            <i
              v-else-if="model && props.onIndicatorIcon"
              class="h-full w-full"
              :class="[props.onIndicatorIcon, model ? activeTextCS.class : 'text-black']"
              :style="activeTextCS.style"
            />
            <i
              v-else-if="!model && props.offIndicatorIcon"
              class="h-full w-full"
              :class="[props.offIndicatorIcon, model ? activeTextCS.class : 'text-black']"
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
          <i
            v-if="model"
            key="on"
            class="absolute top-1/2 -translate-y-50%"
            :class="[sizeCls.icon, {
              [`left-0 text-${color}-on-container-low`]: model,
              [onIcon ?? '']: model && onIcon,
              [offIcon ?? '']: !model && offIcon,
            }]"
          />
          <i
            v-else
            key="off"
            class="absolute top-1/2 -translate-y-50%"
            :class="[sizeCls.icon, {
              'right-0': !model,
              [onIcon ?? '']: model && onIcon,
              [offIcon ?? '']: !model && offIcon,
            }]"
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
