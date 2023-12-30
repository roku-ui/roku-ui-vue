<script setup lang="ts">
import { useRounded } from '../utils/classGenerator'

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
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
    disabled?: boolean
    offIcon?: string
    onIcon?: string
  }>(),
  {
    size: 'md',
    rounded: 'full',
    animate: true,
    color: 'primary',
  },
)
const model = defineModel<boolean>()
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
    case 'md':
      return {
        icon: 'text-sm mx-1',
        wrapper: 'h-6 w-12',
        indicator: isActivated.value ? 'h-4 w-5' : 'h-4 w-4',
        inactive: 'left-[calc(0.25rem-1px)]',
        active: isActivated.value ? 'left-[calc(1.5rem-1px)]' : 'left-[calc(1.75rem-1px)]',
      }
    case 'lg':
      return {
        icon: 'text-lg mx-2',
        wrapper: 'h-8 w-16',
        indicator: isActivated.value ? 'h-6 w-8' : 'h-6 w-6',
        inactive: 'left-[calc(0.25rem-1px)]',
        active: isActivated.value ? 'left-[calc(1.75rem-1px)]' : 'left-[calc(2.25rem-1px)]',
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

function useId() {
  const id = ref('')
  onMounted(() => {
    if (props.id) {
      id.value = props.id
    }
    else {
      id.value = `switch-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`
    }
  })
  return id
}
const id = useId()

const colorCls = computed(() => {
  let c = 'bg-primary-container'
  switch (props.color) {
    case 'secondary':
      c = 'bg-secondary-7'
      break
    case 'tertiary':
      c = 'bg-tertiary-7'
      break
    case 'error':
      c = 'bg-error-7'
      break
    case 'primary':
    default:
  }
  return {
    wrapper: model.value ? `border border-transparent ${c}` : 'bg-surface-lowest border border-surface-border',
    indicator: props.disabled ? 'bg-surface-high' : 'bg-white text-primary-container',
  }
})
const rounded = useRounded(props)
</script>

<template>
  <div
    role="switch"
    class="relative flex items-center gap-2"
    :class="{
      'pointer-events-none filter-grayscale op60': props.disabled,
    }"
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
        :class="[sizeCls.wrapper, colorCls.wrapper, rounded.class]"
        :style="[rounded.style]"
        class="relative inline-block transition-all"
        @pointerdown="isActivated = true"
        @pointerup="isActivated = false"
        @pointerleave="isActivated = false"
        @pointerenter="$event.buttons === 1 && (isActivated = true)"
      >
        <div
          class="absolute top-50% -translate-y-50%"
          :style="[rounded.style]"
          :class="[sizeCls.indicator, colorCls.indicator, animateCls.indicator, model ? sizeCls.active : sizeCls.inactive, rounded.class]"
        />
        <i
          class="absolute top-1/2 -translate-y-50%"
          :class="[sizeCls.icon, {
            [`left-0 text-${color}-on`]: model,
            'right-0 text-surface-on ': !model,
            [onIcon ?? '']: model && onIcon,
            [offIcon ?? '']: !model && offIcon,
          }]"
        />
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
