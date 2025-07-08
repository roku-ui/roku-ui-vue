<template>
  <div class="space-y-8">
    <div class="space-y-4">
      <h3 class="text-lg font-medium">
        Basic Layout
      </h3>
      <div class="h-96 overflow-hidden border rounded-lg">
        <AppShell
          header-height="60px"
          footer-height="40px"
          navbar-width="200px"
          aside-width="160px"
          padding="8px"
          gap="8px"
        >
          <template #header>
            <div class="w-full rounded bg-blue-500 px-4 py-2 text-white">
              Header
            </div>
          </template>

          <template #navbar>
            <div class="h-full rounded bg-green-500 px-4 py-2 text-white">
              Navbar
            </div>
          </template>

          <div class="h-full rounded bg-gray-100 p-4">
            <h4 class="mb-2 font-medium">
              Main Content
            </h4>
            <p class="text-gray-600">
              This is the main content area.
            </p>
          </div>

          <template #aside>
            <div class="h-full rounded bg-purple-500 px-4 py-2 text-white">
              Aside
            </div>
          </template>

          <template #footer>
            <div class="w-full rounded bg-red-500 px-4 py-2 text-white">
              Footer
            </div>
          </template>
        </AppShell>
      </div>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-medium">
        Header Spans All
      </h3>
      <div class="h-96 overflow-hidden border rounded-lg">
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
            <div class="w-full rounded bg-blue-500 px-4 py-2 text-white">
              Header (Spans All)
            </div>
          </template>

          <template #navbar>
            <div class="h-full rounded bg-green-500 px-4 py-2 text-white">
              Navbar
            </div>
          </template>

          <div class="h-full rounded bg-gray-100 p-4">
            <h4 class="mb-2 font-medium">
              Main Content
            </h4>
            <p class="text-gray-600">
              Header spans across navbar and aside.
            </p>
          </div>

          <template #aside>
            <div class="h-full rounded bg-purple-500 px-4 py-2 text-white">
              Aside
            </div>
          </template>

          <template #footer>
            <div class="w-full rounded bg-red-500 px-4 py-2 text-white">
              Footer
            </div>
          </template>
        </AppShell>
      </div>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-medium">
        Footer Spans All
      </h3>
      <div class="h-96 overflow-hidden border rounded-lg">
        <AppShell
          header-height="60px"
          footer-height="40px"
          navbar-width="200px"
          aside-width="160px"
          padding="8px"
          gap="8px"
          :footer-spans-nav="true"
          :footer-spans-aside="true"
        >
          <template #header>
            <div class="w-full rounded bg-blue-500 px-4 py-2 text-white">
              Header
            </div>
          </template>

          <template #navbar>
            <div class="h-full rounded bg-green-500 px-4 py-2 text-white">
              Navbar
            </div>
          </template>

          <div class="h-full rounded bg-gray-100 p-4">
            <h4 class="mb-2 font-medium">
              Main Content
            </h4>
            <p class="text-gray-600">
              Footer spans across navbar and aside.
            </p>
          </div>

          <template #aside>
            <div class="h-full rounded bg-purple-500 px-4 py-2 text-white">
              Aside
            </div>
          </template>

          <template #footer>
            <div class="w-full rounded bg-red-500 px-4 py-2 text-white">
              Footer (Spans All)
            </div>
          </template>
        </AppShell>
      </div>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-medium">
        Both Header and Footer Span All
      </h3>
      <div class="h-96 overflow-hidden border rounded-lg">
        <AppShell
          header-height="60px"
          footer-height="40px"
          navbar-width="200px"
          aside-width="160px"
          padding="8px"
          gap="8px"
          :header-spans-nav="true"
          :header-spans-aside="true"
          :footer-spans-nav="true"
          :footer-spans-aside="true"
        >
          <template #header>
            <div class="w-full rounded bg-blue-500 px-4 py-2 text-white">
              Header (Spans All)
            </div>
          </template>

          <template #navbar>
            <div class="h-full rounded bg-green-500 px-4 py-2 text-white">
              Navbar
            </div>
          </template>

          <div class="h-full rounded bg-gray-100 p-4">
            <h4 class="mb-2 font-medium">
              Main Content
            </h4>
            <p class="text-gray-600">
              Both header and footer span all areas.
            </p>
          </div>

          <template #aside>
            <div class="h-full rounded bg-purple-500 px-4 py-2 text-white">
              Aside
            </div>
          </template>

          <template #footer>
            <div class="w-full rounded bg-red-500 px-4 py-2 text-white">
              Footer (Spans All)
            </div>
          </template>
        </AppShell>
      </div>
    </div>
  </div>
</template>
