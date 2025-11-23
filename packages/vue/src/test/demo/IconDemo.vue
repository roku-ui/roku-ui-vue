<script setup lang="ts">
import { Icon, Paper } from '@/components'
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-3xl font-bold">
      Icon Demo
    </h1>

    <Paper class="flex flex-wrap gap-3 items-center">
      <Icon icon="i-heroicons-bell" />
      <Icon
        icon="i-heroicons-bell"
        variant="filled"
      />
      <Icon
        icon="i-heroicons-bell"
        variant="light"
      />
      <Icon
        icon="i-heroicons-bell"
        variant="outline"
      />
      <Icon
        icon="i-heroicons-bell"
        variant="subtle"
      />
      <Icon
        icon="i-heroicons-bell"
        variant="transparent"
      />
    </Paper>

    <Paper class="flex flex-wrap gap-3 items-center">
      <Icon
        icon="i-heroicons-plus"
        size="sm"
        variant="filled"
      />
      <Icon
        icon="i-heroicons-plus"
        variant="filled"
      />
      <Icon
        icon="i-heroicons-plus"
        size="lg"
        variant="filled"
      />
    </Paper>

    <Paper class="flex flex-wrap gap-3 items-center">
      <Icon
        icon="i-heroicons-check-circle"
        variant="filled"
        color="success"
      />
      <Icon
        icon="i-heroicons-exclamation-triangle"
        variant="outline"
        color="warning"
      />
      <Icon
        icon="i-heroicons-x-circle"
        variant="light"
        color="error"
      />
      <Icon
        icon="i-heroicons-shield-check"
        variant="contrast"
      />
      <Icon skeleton />
    </Paper>

    <Paper class="flex flex-wrap gap-3 items-center">
      <Icon rounded="none">
        <i class="i-heroicons-heart" />
      </Icon>
      <Icon rounded="full">
        <i class="i-heroicons-heart" />
      </Icon>
    </Paper>
  </div>
</template>
