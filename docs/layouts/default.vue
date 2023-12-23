<script setup lang="ts">
import '@roku-ui/vue/style.css'
import { Btn, RokuProvider } from '@roku-ui/vue'

const sideBarOpen = ref(false)
const size = useWindowSize()
const ltMd = computed(() => size.width.value < 768)
function toggleSideBar() {
  sideBarOpen.value = !sideBarOpen.value
}
</script>

<template>
  <RokuProvider>
    <div class="fixed h-12 w-100vw flex items-center gap-2 border-b border-neutral-8 bg-neutral-9 pl-2 pr-2 md:pl-[calc(33vw-256px+32px)]">
      <Btn
        icon
        :class="{
          '!hidden': !ltMd,
        }"
        size="sm"
        @click="toggleSideBar"
      >
        <i class="i-tabler-menu" />
      </Btn>
      <div>
        Logo
      </div>
    </div>
    <div class="h-calc(100vh-3rem) flex">
      <SideBar :is-open="sideBarOpen" />
      <div class="max-w-42rem w-full flex-grow px-4 prose md:ml-[calc(33vw+2rem)] md:mr-8">
        <div class="pb-24">
          <slot />
        </div>
      </div>
    </div>
  </RokuProvider>
</template>
