<script setup lang="ts">
import { AppShell, Paper } from '@roku-ui/vue'
</script>

<template>
  <AppShell
    header-height="60px"
    footer-height="40px"
    navbar-width="200px"
    aside-width="160px"
    class="h-80"
  >
    <template #header>
      <Paper
        with-border
        class="h-full w-full flex items-center"
      >
        <span class="font-medium">Header</span>
      </Paper>
    </template>

    <template #navbar>
      <Paper
        with-border
        class="h-full"
      >
        <div class="mb-2 font-medium">
          Navbar
        </div>
        <div class="text-sm text-gray-600">
          Navigation content
        </div>
      </Paper>
    </template>

    <Paper
      with-border
      class="h-full"
    >
      <h4 class="mb-2 font-medium">
        Main Content
      </h4>
      <p class="text-gray-600">
        This is the main content area.
      </p>
    </Paper>

    <template #aside>
      <Paper
        with-border
        class="h-full"
      >
        <div class="mb-2 font-medium">
          Aside
        </div>
        <div class="text-sm text-gray-600">
          Sidebar content
        </div>
      </Paper>
    </template>

    <template #footer>
      <Paper
        with-border
        class="h-full flex items-center"
      >
        <span class="text-sm text-gray-600">Footer</span>
      </Paper>
    </template>
  </AppShell>
</template>
