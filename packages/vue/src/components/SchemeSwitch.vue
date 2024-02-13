<script setup lang="ts">
import { isClient } from '@vueuse/core'

const isDark = ref(false)

watch([isDark], () => {
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
    isDark.value = localStorage.getItem('scheme') === 'dark'
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
