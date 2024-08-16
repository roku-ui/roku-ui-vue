<script setup lang="ts">
import { useColorStyle } from '../shared'
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
    color?: string
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
const color = computed(() => props.color ?? 'primary')
const colorStyle = useColorStyle(color)
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
    :style="[rounded.style, colorStyle]"
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
        class="absolute left-[0.25rem] top-[0.25rem] h-[calc(100%-0.5rem)] w-1 rounded-full bg-[var(--d-fill)] dark:bg-[var(--d-fill)]"
        :class="[{
          'animate-pulse': loading,
        }]"
      />
    </div>
    <div class="grow-1">
      <div
        v-if="title"
        class="text-base text-[var(--l-text)] dark:text-[var(--d-text)]"
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
