<script setup lang="ts">
import { isClient } from '@vueuse/core'

const isDark = ref<boolean | undefined>(undefined)

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
        on-icon="i-tabler-moon"
        off-icon="i-tabler-sun"
      />
    </div>
    <div class="light:hidden">
      <Switch
        :value="true"
        color="secondary"
        on-icon="i-tabler-moon"
        off-icon="i-tabler-sun"
      />
    </div>
  </div>
  <div :class="{ hidden: isServer }">
    <Switch
      v-model="isDark"
      :animate="animate"
      color="secondary"
      on-icon="i-tabler-moon"
      off-icon="i-tabler-sun"
    />
  </div>
</template>
