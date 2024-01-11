<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    size?: 'sm' | 'md' | 'lg'
    is?: string | Component
    icon?: boolean
    pressEffect?: 'translate' | 'scale'
    variant?: 'filled' | 'default' | 'light' | 'outline' | 'subtle' | 'transparent' | 'ghost' | 'constrast'
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
    animate?: boolean
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  }>(),
  {
    rounded: 'md',
    type: 'button',
    size: 'md',
    is: 'button',
    icon: false,
    pressEffect: 'translate',
  },
)

const rounedCls = computed(() => {
  switch (props.rounded) {
    case 'none':
      return 'rounded-none'
    case 'sm':
      return 'rounded-sm'
    case 'md':
      return 'rounded-md'
    case 'lg':
      return 'rounded-lg'
    case 'full':
      return 'rounded-full'
  }
})

const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        normalContent: 'min-w-16 h-6 px-2 py-1 text-xs',
        iconContent: 'h-6 w-6 p-1',
      }
    case 'md':
      return {
        normalContent: 'min-w-20 h-8 px-3 py-1 text-sm',
        iconContent: 'h-8 w-8 p-2',
      }
    case 'lg':
      return {
        normalContent: 'min-w-24 h-10 px-4 py-2 text-base',
        iconContent: 'h-10 w-10 p-3',
      }
  }
})

const colorCls = computed(() => {
  switch (props.variant) {
    case 'filled':
      switch (props.color) {
        case 'secondary':
          return 'btn-filled-secondary'
        case 'tertiary':
          return 'btn-filled-tertiary'
        case 'error':
          return 'btn-filled-error'
        default:
          return 'btn-filled-primary'
      }
    case 'ghost':
    case 'light':
      switch (props.color) {
        case 'secondary':
          return 'btn-light-secondary'
        case 'tertiary':
          return 'btn-light-tertiary'
        case 'error':
          return 'btn-light-error'
        default:
          return 'btn-light-primary'
      }
    case 'constrast':
      switch (props.color) {
        case 'secondary':
          return 'btn-constrast-secondary'
        case 'tertiary':
          return 'btn-constrast-tertiary'
        case 'error':
          return 'btn-constrast-error'
        default:
          return 'btn-constrast-primary'
      }
    case 'outline':
      switch (props.color) {
        case 'secondary':
          return 'btn-outline-secondary'
        case 'tertiary':
          return 'btn-outline-tertiary'
        case 'error':
          return 'btn-outline-error'
        default:
          return 'btn-outline-primary'
      }
    case 'subtle':
      switch (props.color) {
        case 'secondary':
          return 'btn-subtle-secondary'
        case 'tertiary':
          return 'btn-subtle-tertiary'
        case 'error':
          return 'btn-subtle-error'
        default:
          return 'btn-subtle-primary'
      }
    case 'transparent':
      switch (props.color) {
        case 'secondary':
          return 'btn-transparent-secondary'
        case 'tertiary':
          return 'btn-transparent-tertiary'
        case 'error':
          return 'btn-transparent-error'
        default:
          return 'btn-transparent-primary'
      }
    default:
      return 'btn-default'
  }
})
const attrs = useAttrs()
</script>

<template>
  <component
    :is="is"
    :data-size="size"
    :type="type"
    class="flex items-center justify-center gap-1 decoration-none"
    :class="[
      colorCls,
      rounedCls,
      icon ? sizeCls.iconContent : sizeCls.normalContent,
      {
        'filter-grayscale': attrs.disabled,
        'active:translate-y-0.25': !attrs.disabled && pressEffect === 'translate',
        'active:scale-98': !attrs.disabled && pressEffect === 'scale',
        'transition-all': animate,
      },
    ]"
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
