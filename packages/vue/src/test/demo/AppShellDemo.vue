<script setup lang="ts">
import { ref } from 'vue'

const headerSpansNav = ref(false)
const headerSpansAside = ref(false)
const footerSpansNav = ref(false)
const footerSpansAside = ref(false)
const headerHeight = ref('60px')
const navbarWidth = ref('200px')
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold mb-6">
      AppShell Demo
    </h1>

    <!-- Basic Layout -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Basic Layout
      </h2>
      <div class="border-2 rounded-lg">
        <AppShell
          header-height="60px"
          footer-height="40px"
          navbar-width="200px"
          aside-width="160px"
          padding="8px"
          gap="8px"
        >
          <template #header>
            <Paper class="flex w-full items-center">
              <h3 class="text-surface-on font-medium">
                Application Header
              </h3>
            </Paper>
          </template>

          <template #navbar>
            <Paper class="h-full">
              <h4 class="text-surface-on font-medium mb-3">
                Navigation
              </h4>
              <nav class="space-y-1">
                <div class="text-surface-on text-sm px-3 py-2 rounded cursor-pointer hover:bg-surface-variant-1">
                  Dashboard
                </div>
                <div class="text-surface-on text-sm px-3 py-2 rounded cursor-pointer hover:bg-surface-variant-1">
                  Users
                </div>
                <div class="text-surface-on text-sm px-3 py-2 rounded cursor-pointer hover:bg-surface-variant-1">
                  Settings
                </div>
              </nav>
            </Paper>
          </template>

          <div class="p-4 bg-surface-base h-full overflow-y-auto">
            <h4 class="text-surface-on text-lg font-medium mb-3">
              Main Content
            </h4>
            <p class="text-surface-dimmed mb-4">
              This is the main content area. It's scrollable and takes up the remaining space.
            </p>
            <div class="gap-4 grid grid-cols-2">
              <Paper class="p-4">
                <h5 class="text-surface-on font-medium mb-2">
                  Card 1
                </h5>
                <p class="text-sm text-surface-dimmed">
                  Content here
                </p>
              </Paper>
              <Paper class="p-4">
                <h5 class="text-surface-on font-medium mb-2">
                  Card 2
                </h5>
                <p class="text-sm text-surface-dimmed">
                  More content
                </p>
              </Paper>
            </div>
          </div>

          <template #aside>
            <Paper class="h-full">
              <h4 class="text-surface-on font-medium mb-3">
                Sidebar
              </h4>
              <div class="space-y-2">
                <Paper class="p-3 bg-surface-variant-1">
                  <div class="text-surface-on text-sm font-medium">
                    Widget 1
                  </div>
                  <div class="text-xs text-surface-dimmed">
                    Some widget content
                  </div>
                </Paper>
                <Paper class="p-3 bg-surface-variant-1">
                  <div class="text-surface-on text-sm font-medium">
                    Widget 2
                  </div>
                  <div class="text-xs text-surface-dimmed">
                    More widget content
                  </div>
                </Paper>
              </div>
            </Paper>
          </template>

          <template #footer>
            <Paper class="flex w-full items-center justify-between">
              <span class="text-sm text-surface-dimmed">© 2024 Application</span>
              <span class="text-xs text-surface-dimmed">v1.0.0</span>
            </Paper>
          </template>
        </AppShell>
      </div>
    </section>

    <!-- Header Spans All -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Header Spans All
      </h2>
      <div class="border-2 rounded-lg">
        <AppShell
          header-height="60px"
          footer-height="40px"
          navbar-width="200px"
          aside-width="160px"
          padding="8px"
          gap="8px"
          :header-spans-nav="true"
          :header-spans-aside="true"
        >
          <template #header>
            <Paper class="text-primary-on bg-primary flex w-full items-center">
              <h3 class="font-medium">
                Header (Spans All)
              </h3>
            </Paper>
          </template>

          <template #navbar>
            <Paper class="h-full">
              <h4 class="text-surface-on font-medium mb-2">
                Navigation
              </h4>
            </Paper>
          </template>

          <div class="p-4 bg-surface-base h-full">
            <h4 class="text-surface-on font-medium mb-2">
              Main Content
            </h4>
            <p class="text-surface-dimmed">
              Notice how the header spans across both navbar and aside sections.
            </p>
          </div>

          <template #aside>
            <Paper class="h-full">
              <h4 class="text-surface-on font-medium mb-2">
                Sidebar
              </h4>
            </Paper>
          </template>

          <template #footer>
            <Paper class="bg-surface-variant-1 flex w-full items-center">
              <span class="text-surface-on font-medium">Footer</span>
            </Paper>
          </template>
        </AppShell>
      </div>
    </section>

    <!-- Minimal Layouts -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Minimal Layouts
      </h2>
      <div class="gap-4 grid grid-cols-2">
        <!-- Header + Main -->
        <div class="space-y-2">
          <h3 class="text-lg font-medium">
            Header + Main
          </h3>
          <div class="border-2 rounded-lg h-48">
            <AppShell
              header-height="50px"
              padding="8px"
              gap="8px"
            >
              <template #header>
                <Paper class="flex w-full items-center">
                  <span class="text-surface-on font-medium">Header Only</span>
                </Paper>
              </template>

              <div class="p-4 bg-surface-base h-full">
                <h4 class="text-surface-on font-medium mb-2">
                  Main Content
                </h4>
                <p class="text-sm text-surface-dimmed">
                  Simple header + main layout
                </p>
              </div>
            </AppShell>
          </div>
        </div>

        <!-- Navbar + Main -->
        <div class="space-y-2">
          <h3 class="text-lg font-medium">
            Navbar + Main
          </h3>
          <div class="border-2 rounded-lg h-48">
            <AppShell
              navbar-width="120px"
              padding="8px"
              gap="8px"
            >
              <template #navbar>
                <Paper class="h-full">
                  <h4 class="text-surface-on text-sm font-medium mb-2">
                    Navigation
                  </h4>
                  <div class="text-xs space-y-1">
                    <div class="text-surface-dimmed">
                      Item 1
                    </div>
                    <div class="text-surface-dimmed">
                      Item 2
                    </div>
                  </div>
                </Paper>
              </template>

              <div class="p-4 bg-surface-base h-full">
                <h4 class="text-surface-on font-medium mb-2">
                  Main Content
                </h4>
                <p class="text-sm text-surface-dimmed">
                  Sidebar navigation layout
                </p>
              </div>
            </AppShell>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Controls -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Interactive Demo
      </h2>
      <div class="gap-6 grid grid-cols-2">
        <!-- Controls -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">
            Controls
          </h3>
          <div class="space-y-2">
            <div class="gap-2 grid grid-cols-2">
              <label class="flex items-center space-x-2">
                <input
                  v-model="headerSpansNav"
                  type="checkbox"
                  class="rounded"
                >
                <span class="text-sm">Header spans nav</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  v-model="headerSpansAside"
                  type="checkbox"
                  class="rounded"
                >
                <span class="text-sm">Header spans aside</span>
              </label>
            </div>
            <div class="gap-2 grid grid-cols-2">
              <label class="flex items-center space-x-2">
                <input
                  v-model="footerSpansNav"
                  type="checkbox"
                  class="rounded"
                >
                <span class="text-sm">Footer spans nav</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  v-model="footerSpansAside"
                  type="checkbox"
                  class="rounded"
                >
                <span class="text-sm">Footer spans aside</span>
              </label>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium block">Header Height</label>
              <select
                v-model="headerHeight"
                class="p-2 border rounded w-full"
              >
                <option value="40px">
                  40px
                </option>
                <option value="60px">
                  60px
                </option>
                <option value="80px">
                  80px
                </option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium block">Navbar Width</label>
              <select
                v-model="navbarWidth"
                class="p-2 border rounded w-full"
              >
                <option value="150px">
                  150px
                </option>
                <option value="200px">
                  200px
                </option>
                <option value="250px">
                  250px
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div class="space-y-2">
          <h3 class="text-lg font-medium">
            Preview
          </h3>
          <div class="border-2 rounded-lg h-80">
            <AppShell
              :header-height="headerHeight"
              footer-height="40px"
              :navbar-width="navbarWidth"
              aside-width="160px"
              padding="8px"
              gap="8px"
              :header-spans-nav="headerSpansNav"
              :header-spans-aside="headerSpansAside"
              :footer-spans-nav="footerSpansNav"
              :footer-spans-aside="footerSpansAside"
            >
              <template #header>
                <Paper class="flex w-full items-center">
                  <span class="text-surface-on font-medium">Dynamic Header</span>
                </Paper>
              </template>

              <template #navbar>
                <Paper class="h-full">
                  <h4 class="text-surface-on text-sm font-medium mb-2">
                    Navigation
                  </h4>
                </Paper>
              </template>

              <div class="p-4 bg-surface-base h-full">
                <h4 class="text-surface-on font-medium mb-2">
                  Main Content
                </h4>
                <p class="text-sm text-surface-dimmed">
                  Adjust the controls to see the layout change.
                </p>
              </div>

              <template #aside>
                <Paper class="h-full">
                  <h4 class="text-surface-on text-sm font-medium mb-2">
                    Sidebar
                  </h4>
                </Paper>
              </template>

              <template #footer>
                <Paper class="flex w-full items-center">
                  <span class="text-surface-on font-medium">Footer</span>
                </Paper>
              </template>
            </AppShell>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
