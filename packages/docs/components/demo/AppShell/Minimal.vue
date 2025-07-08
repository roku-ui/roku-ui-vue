<template>
  <div class="space-y-8">
    <div class="space-y-4">
      <h3 class="text-lg font-medium">
        Header + Main Only
      </h3>
      <div class="h-64 overflow-hidden border rounded-lg">
        <AppShell
          header-height="60px"
          padding="8px"
          gap="8px"
        >
          <template #header>
            <div class="w-full rounded bg-blue-500 px-4 py-2 text-white">
              Header Only
            </div>
          </template>

          <div class="h-full rounded bg-gray-100 p-4">
            <h4 class="mb-2 font-medium">
              Main Content
            </h4>
            <p class="text-gray-600">
              Simple layout with just header and main content.
            </p>
          </div>
        </AppShell>
      </div>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-medium">
        Sidebar Layout
      </h3>
      <div class="h-64 overflow-hidden border rounded-lg">
        <AppShell
          navbar-width="240px"
          padding="8px"
          gap="8px"
        >
          <template #navbar>
            <div class="h-full rounded bg-green-500 px-4 py-2 text-white">
              <h4 class="mb-2 font-medium">
                Sidebar
              </h4>
              <ul class="text-sm space-y-1">
                <li>Navigation Item 1</li>
                <li>Navigation Item 2</li>
                <li>Navigation Item 3</li>
              </ul>
            </div>
          </template>

          <div class="h-full rounded bg-gray-100 p-4">
            <h4 class="mb-2 font-medium">
              Main Content
            </h4>
            <p class="text-gray-600">
              Layout with sidebar navigation and main content.
            </p>
          </div>
        </AppShell>
      </div>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-medium">
        Main + Aside Only
      </h3>
      <div class="h-64 overflow-hidden border rounded-lg">
        <AppShell
          aside-width="200px"
          padding="8px"
          gap="8px"
        >
          <div class="h-full rounded bg-gray-100 p-4">
            <h4 class="mb-2 font-medium">
              Main Content
            </h4>
            <p class="text-gray-600">
              Layout with main content and right sidebar.
            </p>
          </div>

          <template #aside>
            <div class="h-full rounded bg-purple-500 px-4 py-2 text-white">
              <h4 class="mb-2 font-medium">
                Aside
              </h4>
              <div class="text-sm space-y-1">
                <div>Widget 1</div>
                <div>Widget 2</div>
                <div>Widget 3</div>
              </div>
            </div>
          </template>
        </AppShell>
      </div>
    </div>
  </div>
</template>
