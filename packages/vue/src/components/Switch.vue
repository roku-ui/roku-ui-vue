<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: any
    size?: 'sm' | 'md' | 'lg'
    animate?: boolean
    options?: string[]
    label?: string
    id?: string
  }>(),
  {
    size: 'md',
    animate: true,
  },
)
const emit = defineEmits(['update:modelValue'])

const wrapper = ref<HTMLElement | null>(null)
const isActivated = ref(false)
const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        wrapper: 'h-4 w-8',
        indicator: isActivated.value ? 'h-3 w-4' : 'h-3 w-3',
        inactive: 'left-[calc(0.125rem-1px)]',
        active: isActivated.value ? 'left-[calc(0.875rem-1px)]' : 'left-[calc(1.125rem-1px)]',
      }
    case 'md':
      return {
        wrapper: 'h-6 w-12',
        indicator: isActivated.value ? 'h-4 w-5' : 'h-4 w-4',
        inactive: 'left-[calc(0.25rem-1px)]',
        active: isActivated.value ? 'left-[calc(1.5rem-1px)]' : 'left-[calc(1.75rem-1px)]',
      }
    case 'lg':
      return {
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

const value = props.modelValue !== undefined
  ? computed({
    get() {
      return props.modelValue
    },
    set(val) {
      emit('update:modelValue', val)
    },
  })
  : ref(false)

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
  return {
    wrapper: value.value ? 'primary-container-base border border-transparent' : 'surface-container-high border surface-outline-base',
    // wrapper: value.value ? 'primary-container-base border-transparent border' : 'surface-container-high border surface-outline-base',
    indicator: 'bg-white',
  }
})
</script>

<template>
  <div
    role="switch"
    class="relative flex items-center gap-2"
  >
    <input
      :id="id"
      v-model="value"
      class="hidden"
      type="checkbox"
    >
    <label
      class="leading-0 cursor-pointer!"
      :for="id"
    >
      <div
        ref="wrapper"
        :class="[sizeCls.wrapper, colorCls.wrapper]"
        class="relative inline-block rounded-full transition-all"
        @pointerdown="isActivated = true"
        @pointerup="isActivated = false"
        @pointerleave="isActivated = false"
        @pointerenter="$event.buttons === 1 && (isActivated = true)"
      >
        <div
          class="absolute top-50% rounded-full -translate-y-50%"
          :class="[sizeCls.indicator, colorCls.indicator, animateCls.indicator, value ? sizeCls.active : sizeCls.inactive]"
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
