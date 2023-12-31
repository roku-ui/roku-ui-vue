<script setup lang="ts">
import { isClient } from '@vueuse/core'

const isDark = ref<boolean | undefined>(undefined)
watchEffect(() => {
  if (isClient) {
    if (isDark.value === true) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    }
    else if (isDark.value === false) {
      document.documentElement.setAttribute('data-theme', 'light')

      localStorage.setItem('theme', 'light')
    }
  }
})
onMounted(() => {
  if (isClient) {
    const theme = localStorage.getItem('theme')
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
})
</script>

<template>
  <Switch
    v-model="isDark"
    color="secondary"
    on-icon="i-tabler-moon"
    off-icon="i-tabler-sun"
  />
</template>
