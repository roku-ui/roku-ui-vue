<script setup lang="ts">
import { Btn, Paper, Popover } from '@roku-ui/vue'

const code = computed(() => {
  return `<template>
  <div class="flex gap-4">
    <Popover trigger="click">
      <Btn>Click me</Btn>
      <template #content>
        <Paper>
          <div class="text-sm">Click trigger</div>
        </Paper>
      </template>
    </Popover>

    <Popover trigger="hover">
      <Btn>Hover me</Btn>
      <template #content>
        <Paper>
          <div class="text-sm">Hover trigger</div>
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
        <Popover trigger="click">
          <Btn>Click me</Btn>
          <template #content>
            <Paper>
              <div class="text-sm">
                Click trigger
              </div>
            </Paper>
          </template>
        </Popover>

        <Popover trigger="hover">
          <Btn>Hover me</Btn>
          <template #content>
            <Paper>
              <div class="text-sm">
                Hover trigger
              </div>
            </Paper>
          </template>
        </Popover>
      </div>
    </template>
  </Demo>
</template>
