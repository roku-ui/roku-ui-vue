<script setup lang="ts">
import { AppShell, AppShellAside, AppShellFooter, AppShellHeader, AppShellMain, AppShellNavbar } from '@roku-ui/vue'
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
      <AppShellHeader>
        <span class="font-medium">Header</span>
      </AppShellHeader>
    </template>

    <template #navbar>
      <AppShellNavbar>
        <div class="font-medium">
          Navbar
        </div>
        <div class="text-surface-dimmed text-sm">
          Navigation content
        </div>
      </AppShellNavbar>
    </template>

    <AppShellMain>
      <h4 class="font-medium mt-0">
        Main Content
      </h4>
      <p class="text-surface-dimmed">
        This is the main content area.
      </p>
    </AppShellMain>

    <template #aside>
      <AppShellAside>
        <div class="font-medium">
          Aside
        </div>
        <div class="text-surface-dimmed text-sm">
          Sidebar content
        </div>
      </AppShellAside>
    </template>

    <template #footer>
      <AppShellFooter>
        <span class="text-surface-dimmed text-sm">Footer</span>
      </AppShellFooter>
    </template>
  </AppShell>
</template>
