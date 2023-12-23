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
        indicator: isActivated.value ? 'top-0.5 h-3 w-4' : 'top-0.5 h-3 w-3',
        inactive: 'left-0.5',
        active: isActivated.value ? 'left-0.875rem' : 'left-1.125rem',
      }
    case 'md':
      return {
        wrapper: 'h-6 w-12',
        indicator: isActivated.value ? 'top-1 h-4 w-5' : 'top-1 h-4 w-4',
        inactive: 'left-1',
        active: isActivated.value ? 'left-1.5rem' : 'left-1.75rem',
      }
    case 'lg':
      return {
        wrapper: 'h-8 w-16',
        indicator: isActivated.value ? 'top-1 h-6 w-8' : 'top-1 h-6 w-6',
        inactive: 'left-1',
        active: isActivated.value ? 'left-1.75rem' : 'left-2.25rem',
      }
  }
})

const animateCls = computed(() => props.animate
  ? {
      indicator: 'transition-left,width',
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
    wrapper: value.value ? 'primary-container-base primary-outline-base' : 'surface-container-high border surface-outline-base',
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
          class="absolute rounded-full"
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
