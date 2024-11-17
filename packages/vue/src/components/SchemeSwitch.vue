<script setup lang="ts">
import { isClient } from '@vueuse/core'
import { nextTick, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  disableViewTranslation?: boolean
  circleTranslation?: boolean
}>(), {
  disableViewTranslation: false,
  circleTranslation: false,
})

const isDark = ref(false)
let lastClick: MouseEvent | undefined

useEventListener('click', event => (lastClick = event))

watch([isDark], () => {
  if (isClient) {
    // 获取点击位置，或者回退到屏幕中间
    const x = lastClick?.clientX ?? innerWidth / 2
    const y = lastClick?.clientY ?? innerHeight / 2
    // 获取到最远角的距离
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )

    if (!props.disableViewTranslation) {
      const transition = document.startViewTransition(() => {
        if (isDark.value) {
          document.documentElement.setAttribute('data-scheme', 'dark')
          localStorage.setItem('scheme', 'dark')
        }
        else {
          document.documentElement.setAttribute('data-scheme', 'light')
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
    else {
      document.documentElement.setAttribute('data-scheme', isDark.value ? 'dark' : 'light')
      localStorage.setItem('scheme', isDark.value ? 'dark' : 'light')
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
  </div>
</template>
