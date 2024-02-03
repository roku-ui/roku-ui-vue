<script setup lang="ts">
import { isClient } from '@vueuse/core'

const scheme = useScheme()
const isDark = computed({
  get() {
    return scheme.value === 'dark'
  },
  set(value) {
    scheme.value = value ? 'dark' : 'light'
  },
})
watchEffect(() => {
  if (isClient) {
    if (isDark.value === true) {
      document.documentElement.setAttribute('data-scheme', 'dark')
      localStorage.setItem('scheme', 'dark')
    }
    else if (isDark.value === false) {
      document.documentElement.setAttribute('data-scheme', 'light')

      localStorage.setItem('scheme', 'light')
    }
  }
})

const isServer = ref(true)
const animate = ref(false)
onMounted(() => {
  if (isClient) {
    const theme = localStorage.getItem('scheme')
    if (theme === 'dark') {
      isDark.value = true
    }
    else if (theme === 'light') {
      isDark.value = false
    }
    else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  }
  isServer.value = false
})

nextTick(() => {
  animate.value = true
})
</script>

<template>
  <div :class="{ hidden: !isServer }">
    <div class="dark:hidden">
      <Switch
        :value="false"
        on-icon="i-line-md-moon-twotone-alt-loop"
        off-icon="i-line-md-sunny-outline-twotone-loop"
      />
    </div>
    <div class="light:hidden">
      <Switch
        :value="true"
        color="secondary"
        on-icon="i-line-md-moon-twotone-alt-loop"
        off-icon="i-line-md-sunny-outline-twotone-loop"
      />
    </div>
  </div>
  <div :class="{ hidden: isServer }">
    <Switch
      v-model="isDark"
      :animate="animate"
      color="secondary"
      on-icon="i-line-md-moon-twotone-alt-loop"
      off-icon="i-line-md-sunny-outline-twotone-loop"
    />
  </div>
</template>
