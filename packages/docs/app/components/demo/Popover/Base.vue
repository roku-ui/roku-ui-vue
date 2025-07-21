<script setup lang="ts">
import { Btn, Paper, Popover } from '@roku-ui/vue'

const code = computed(() => {
  return `<template>
  <Popover>
    <Btn>Click me</Btn>
    <template #content>
      <Paper>
        <div class="text-sm">
          Popover content
        </div>
        <div class="text-xs">
          This is a popover
        </div>
      </Paper>
    </template>
  </Popover>
</template>`
})
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <div class="flex gap-4">
        <Popover>
          <Btn>Click me</Btn>
          <template #content>
            <Paper>
              <div class="text-sm">
                Popover content
              </div>
              <div class="text-xs">
                This is a popover
              </div>
            </Paper>
          </template>
        </Popover>
      </div>
    </template>
  </Demo>
</template>
