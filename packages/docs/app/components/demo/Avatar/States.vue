<script setup lang="ts">
import { Avatar } from '@roku-ui/vue'
import { computed } from 'vue'

const code = computed(() => `<template>
  <div class="flex flex-wrap items-center gap-3">
    <Avatar skeleton />
    <Avatar name="Initials" />
    <Avatar
      name="Broken"
      src="https://this-avatar-will-404.invalid/avatar.png"
    />
    <Avatar variant="filled" color="primary">
      <i class="i-tabler-robot" />
    </Avatar>
  </div>
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <div class="flex flex-wrap items-center gap-3">
        <Avatar skeleton />
        <Avatar name="Initials" />
        <Avatar
          name="Broken"
          src="https://this-avatar-will-404.invalid/avatar.png"
        />
        <Avatar variant="filled" color="primary">
          <i class="i-tabler-robot" />
        </Avatar>
      </div>
    </template>
  </Demo>
</template>
