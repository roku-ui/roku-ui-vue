<script setup lang="ts">
import type { Size } from '../types'
import { useRounded } from '@/utils/classGenerator'
import { computed } from 'vue'
import { useColorStyleWithKey, useContainerDefaultCS, useContainerFilledCS, useSurfaceColors } from '../shared'

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
    color?: string
    size?: Size
  }>(),
  {
    type: 'info',
    border: false,
    color: 'primary',
    rounded: 'md',
    block: false,
    size: 'md',
  },
)

defineEmits(['close'])

const rounded = useRounded(props)
const color = computed(() => props.color)
const containerFilledCS = useContainerFilledCS(color)
const containerSurfaceCS = useContainerDefaultCS()
const shapeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'min-h-10 p-1'
    case 'lg':
      return 'min-h-16 p-4'
    case 'md':
    default:
      return 'min-h-16 p-3'
  }
})
</script>

<template>
  <div
    class="container-low relative min-w-80 w-full flex items-center gap-2 pl-4"
    :class="[
      { 'border-0': !withBorder },
      rounded.class,
      shapeClass,
      {
        'max-w-100': !block,
        'w-full': block,
      },
    ]"
    :style="[rounded.style]"
    v-bind="containerSurfaceCS"
  >
    <div
      v-if="icon"
      class="text-[var(--l-text)] leading-0 dark:text-[var(--d-text)]"
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
        class="absolute left-[0.25rem] top-[0.25rem] h-[calc(100%-0.5rem)] w-1 rounded-full bg-[var(--d-bg)] dark:bg-[var(--d-bg)]"
        :class="[{
          'animate-pulse': loading,
        }]"
        v-bind="containerFilledCS"
      />
    </div>
    <div class="grow-1">
      <div
        v-if="title"
        class="text-[var(--l-text)] dark:text-[var(--d-text)]"
        :class="{
          'text-xs': size === 'sm',
          'text-sm': size === 'md',
          'text-base': size === 'lg',
        }"
      >
        {{ title }}
      </div>

      <slot
        v-if="$slots.message"
        name="message"
      />
      <div
        v-else-if="message"
        class="text-surface-on-low op-50"
        :class="{
          'text-xs': size === 'sm',
          'text-sm': size === 'md' || size === 'lg',
        }"
      >
        {{ message }}
      </div>
    </div>
    <Btn
      v-if="closeable"
      icon
      variant="transparent"
      @click="$emit('close')"
    >
      <slot
        v-if="$slots.closeIcon"
        name="close-icon"
      />
      <i v-else class="i-tabler-x" />
    </Btn>
  </div>
</template>
