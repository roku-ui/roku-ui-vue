<script setup lang="ts">
import { Avatar, Btn, Tooltip } from '@roku-ui/vue'

const code = computed(() => {
  return `<template>
  <div class="flex gap-4">
    <Tooltip>
      <Btn hover-variant="filled">
        Hover me
      </Btn>
      <template #content>
        This is a tooltip
      </template>
    </Tooltip>

    <Tooltip>
      <Avatar name="JC" />
      <template #content>
        User Avatar
      </template>
    </Tooltip>
  </div>
</template>`
})
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <div class="flex gap-4">
        <Tooltip>
          <Btn hover-variant="filled">
            Hover me
          </Btn>
          <template #content>
            This is a tooltip
          </template>
        </Tooltip>

        <Tooltip>
          <Btn
            variant="filled"
            color="secondary"
          >
            Secondary Button
          </Btn>
          <template #content>
            Tooltip for secondary button
          </template>
        </Tooltip>

        <Tooltip>
          <Avatar name="JC" />
          <template #content>
            User Avatar
          </template>
        </Tooltip>
      </div>
    </template>
  </Demo>
</template>
