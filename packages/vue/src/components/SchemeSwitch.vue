<script setup lang="ts">
import type { Component } from 'vue'
import { isClient, useEventListener } from '@vueuse/core'
import { nextTick, onMounted, ref, watch } from 'vue'
import { Switch } from '@/components'

const props = withDefaults(defineProps<{
  disableViewTranslation?: boolean
  circleTranslation?: boolean
  animation?: boolean
  onIcon?: string | Component
  offIcon?: string | Component
}>(), {
  disableViewTranslation: false,
  circleTranslation: false,
  animation: false,
  onIcon: 'i-line-md-moon-twotone-alt-loop',
  offIcon: 'i-line-md-sunny-outline-twotone-loop',
})

const isDark = ref(false)
let lastClick: MouseEvent | undefined

useEventListener('click', event => (lastClick = event))

watch([isDark], () => {
  if (!props.animation) {
    if (isDark.value) {
      document.documentElement.dataset.scheme = 'dark'
      localStorage.setItem('scheme', 'dark')
    }
    else {
      document.documentElement.dataset.scheme = 'light'
      localStorage.setItem('scheme', 'light')
    }
    return
  }
  if (isClient) {
    // 获取点击位置，或者回退到屏幕中间
    const x = lastClick?.clientX ?? innerWidth / 2
    const y = lastClick?.clientY ?? innerHeight / 2
    // 获取到最远角的距离
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )

    if (props.disableViewTranslation) {
      document.documentElement.dataset.scheme = isDark.value ? 'dark' : 'light'
      localStorage.setItem('scheme', isDark.value ? 'dark' : 'light')
    }
    else {
      const transition = document.startViewTransition(() => {
        if (isDark.value) {
          document.documentElement.dataset.scheme = 'dark'
          localStorage.setItem('scheme', 'dark')
        }
        else {
          document.documentElement.dataset.scheme = 'light'
          localStorage.setItem('scheme', 'light')
        }
      })
      if (props.circleTranslation) {
        // need this
        // ::view-transition-image-pair(root) {
        //   isolation: auto;
        // }
        // ::view-transition-old(root),
        // ::view-transition-new(root) {
        //   animation: none;
        //   mix-blend-mode: normal;
        //   display: block;
        // }
        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0 at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 500,
              easing: 'ease-in',
              pseudoElement: '::view-transition-new(root)',
            },
          )
        })
      }
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
  <div class="scheme-switch inline-block">
    <div :class="{ hidden: !isServer }">
      <div class="dark:hidden">
        <Switch
          :value="false"
          :on-icon="onIcon"
          :off-icon="offIcon"
        />
      </div>
      <div class="light:hidden">
        <Switch
          :value="true"
          color="secondary"
          :on-icon="onIcon"
          :off-icon="offIcon"
        />
      </div>
    </div>
    <div :class="{ hidden: isServer }">
      <Switch
        v-model="isDark"
        :animate="animate"
        color="secondary"
        :on-icon="onIcon"
        :off-icon="offIcon"
      />
    </div>
  </div>
</template>
