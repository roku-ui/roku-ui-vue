<script setup lang="ts">
import { ScrollArea } from '@roku-ui/vue'

const code = computed(() => `<template>
    <ScrollArea>
        <div
            v-for="i in 100"
            :key="i"
        >
            {{ i }}
        </div>
    </ScrollArea>
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <div class="relative h-full w-full p-2">
        <ScrollArea>
          <div
            v-for="i in 100"
            :key="i"
          >
            {{ i }}
          </div>
        </ScrollArea>
      </div>
    </template>
  </Demo>
</template>
