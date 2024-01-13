<script setup lang="ts">
withDefaults(defineProps<{
  ratio?: number
}>(), {
  ratio: 1,
})
</script>

<template>
  <div>
    <div
      :style="{
        '--ar-ratio': ratio,
      }"
      class="before:content-[''] before:block before:h-0 before:pb-[calc((1/var(--ar-ratio,1))*100%)] children:absolute children:w-full children:h-full relative children:top-0"
    >
      <slot />
    </div>
  </div>
</template>
