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
      class="relative children:absolute children:top-0 before:block before:h-0 children:h-full children:w-full before:pb-[calc((1/var(--ar-ratio,1))*100%)] before:content-['']"
    >
      <slot />
    </div>
  </div>
</template>
