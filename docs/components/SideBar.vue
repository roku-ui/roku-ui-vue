<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()
const navData = [
  {
    to: '/',
    text: 'Home',
  },
  {
    to: '/btn',
    text: 'Button',
  },
  {
    to: '/slider',
    text: 'Slider',
  },
  {
    to: '/switch',
    text: 'Switch',
  },
  {
    to: '/text-field',
    text: 'Text Field',
  },
  {
    to: '/select',
    text: 'Select',
  },
]
</script>

<template>
  <div
    :class="{
      '-translate-x-100%': !isOpen,
      'translate-x-0': isOpen,
    }"
    class="fixed top-12 z-10 h-100vh min-w-64 w-33vw flex flex-col items-end gap-2 bg-neutral-900 transition-transform md:translate-x-0"
  >
    <div class="w-64 flex flex-col gap-8 px-8 py-6">
      <div>
        <div>
          Roku UI - Vue
        </div>
        <div class="text-sm op58">
          @roku-ui/vue
        </div>
      </div>
      <div>
        <NuxtLink
          v-for="nav in navData"
          :key="nav.to"
          :to="nav.to"
          :text="nav.text"
          class="block text-sm text-neutral-4 hover:text-sky-4"
        >
          {{ nav.text }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
