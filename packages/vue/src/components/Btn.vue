<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    size?: 'sm' | 'md' | 'lg'
    is?: string
    icon?: boolean
    pressEffect?: 'translate' | 'scale'
    variant?: 'filled' | 'default'
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
  }>(),
  {
    type: 'button',
    size: 'md',
    is: 'button',
    icon: false,
    pressEffect: 'translate',
  },
)
const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        normalContent: 'min-w-16 h-6 px-2 py-1 text-sm',
        iconContent: 'h-6 w-6 p-1',
      }
    case 'md':
      return {
        normalContent: 'min-w-20 h-8 px-3 py-1 text-base',
        iconContent: 'h-8 w-8 p-2',
      }
    case 'lg':
      return {
        normalContent: 'min-w-24 h-10 px-4 py-2 text-lg',
        iconContent: 'h-10 w-10 p-3',
      }
  }
})

const colorCls = computed(() => {
  switch (props.variant) {
    case 'filled':
      switch (props.color) {
        case 'secondary':
          return 'container-secondary'
        case 'tertiary':
          return 'container-tertiary'
        case 'error':
          return 'container-error'
        default:
          return 'container-primary'
      }
    default:
      return 'container-default'
  }
})
</script>

<template>
  <component
    :is="is"
    :data-size="size"
    :type="type"
    class="flex items-center justify-center gap-1 rounded decoration-none"
    :class="[
      colorCls,
      icon ? sizeCls.iconContent : sizeCls.normalContent,
      {
        'active:translate-y-0.25': pressEffect === 'translate',
        'active:scale-98': pressEffect === 'scale',
      },
    ]"
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
