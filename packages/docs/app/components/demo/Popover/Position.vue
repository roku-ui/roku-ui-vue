<script setup lang="ts">
import { Btn, Paper, Popover } from '@roku-ui/vue'

const code = computed(() => {
  return `<template>
  <div class="flex gap-4">
    <Popover position="top-start">
      <Btn>Top Start</Btn>
      <template #content>
        <Paper>
          <div class="text-sm">Top Start Position</div>
        </Paper>
      </template>
    </Popover>

    <Popover position="left">
      <Btn>Left</Btn>
      <template #content>
        <Paper>
          <div class="text-sm">Left Position</div>
        </Paper>
      </template>
    </Popover>
  </div>
</template>`
})
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <div class="flex gap-4">
        <Popover position="top-start">
          <Btn>Top Start</Btn>
          <template #content>
            <Paper>
              <div class="text-sm">
                Top Start Position
              </div>
            </Paper>
          </template>
        </Popover>

        <Popover position="left">
          <Btn>Left</Btn>
          <template #content>
            <Paper>
              <div class="text-sm">
                Left Position
              </div>
            </Paper>
          </template>
        </Popover>
      </div>
    </template>
  </Demo>
</template>
