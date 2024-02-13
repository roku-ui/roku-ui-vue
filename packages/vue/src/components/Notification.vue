<script setup lang="ts">
import { useRounded } from '../utils/classGenerator'

const props = withDefaults(
  defineProps<{
    title?: string
    message?: string
    icon?: string
    loading?: boolean
    withBorder?: boolean
    closeable?: boolean
    rounded?: 'sm' | 'md' | 'lg' | 'none' | string | number
    block?: boolean
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
  }>(),
  {
    type: 'info',
    border: false,
    color: 'primary',
    rounded: 'md',
    block: false,
  },
)

defineEmits(['close'])

const rounded = useRounded(props)

const bgColorCls = computed(() => {
  switch (props.color) {
    case 'secondary':
      return 'bg-secondary-container'
    case 'tertiary':
      return 'bg-tertiary-container'
    case 'error':
      return 'bg-error-container'
    default:
      return 'bg-primary-container'
  }
})

const textColorCls = computed(() => {
  switch (props.color) {
    case 'secondary':
      return 'text-secondary-on'
    case 'tertiary':
      return 'text-tertiary-on'
    case 'error':
      return 'text-error-on'
    default:
      return 'text-primary-on'
  }
})
</script>

<template>
  <div
    class="relative min-h-16 min-w-80 w-full flex items-center gap-2 container-low p-3"
    :class="[
      { 'border-0': !withBorder },
      rounded.class,
      {
        'max-w-100': !block,
        'w-full': block,
      },
    ]"
    :style="rounded.style"
  >
    <div
      v-if="icon"
      class="leading-0"
      :class="textColorCls"
    >
      <i
        v-if="loading"
        class="h-container w-container i-tabler-loader-2 shrink-0 animate-spin"
      />
      <i
        v-else
        class="h-container w-container shrink-0"
        :class="icon"
      />
    </div>
    <div
      v-else
    >
      <div
        class="absolute left-[0.25rem] top-[0.25rem] h-[calc(100%-0.5rem)] w-1 rounded-full"
        :class="[{
          'animate-pulse': loading,
        }, bgColorCls]"
      />
    </div>
    <div class="grow-1">
      <div
        v-if="title"
        :class="textColorCls"
        class="text-base"
      >
        {{ title }}
      </div>

      <slot
        v-if="$slots.message"
        name="message"
      />
      <div
        v-else-if="message"
        class="text-sm text-surface-on-low"
      >
        {{ message }}
      </div>
    </div>
    <Btn
      v-if="closeable"
      icon
      variant="transparent"
      class="text-surface-on hover:text-surface-on"
      @click="$emit('close')"
    >
      <i class="i-tabler-x" />
    </Btn>
  </div>
</template>
