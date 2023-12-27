<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    message?: string
    icon?: string
    loading?: boolean
    border?: boolean
    closeable?: boolean
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
  }>(),
  {
    type: 'info',
    border: false,
    color: 'primary',
  },
)

defineEmits(['close'])

const bgColorCls = computed(() => {
  switch (props.color) {
    case 'secondary':
      return 'bg-secondary-5'
    case 'tertiary':
      return 'bg-tertiary-5'
    case 'error':
      return 'bg-error-5'
    default:
      return 'bg-primary-5'
  }
})

const textColorCls = computed(() => {
  switch (props.color) {
    case 'secondary':
      return 'text-secondary-5'
    case 'tertiary':
      return 'text-tertiary-5'
    case 'error':
      return 'text-error-5'
    default:
      return 'text-primary-5'
  }
})
</script>

<template>
  <div
    class="relative max-w-100 min-h-16 min-w-80 w-full flex items-center gap-2 container-default rounded p-3"
    :class="[
      { 'border-0': !border },
    ]"
  >
    <div
      v-if="icon"
      class="leading-0"
      :class="textColorCls"
    >
      <i
        v-if="loading"
        class="i-tabler-loader-2 h-5 w-5 shrink-0 animate-spin"
      />
      <i
        v-else
        class="h-5 w-5 shrink-0"
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
      <div
        v-if="message"
        class="text-sm text-surface-4"
      >
        {{ message }}
      </div>
    </div>
    <Btn
      v-if="closeable"
      icon
      variant="transparent"
      class="text-white hover:text-white"
      @click="$emit('close')"
    >
      <i class="i-tabler-x" />
    </Btn>
  </div>
</template>
