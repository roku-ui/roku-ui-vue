<template>
  <div class="space-y-8">
    <div class="space-y-4">
      <h3 class="text-lg font-medium">
        Different Sizes
      </h3>
      <div class="h-96 overflow-hidden border rounded-lg">
        <AppShell
          header-height="80px"
          footer-height="60px"
          navbar-width="300px"
          aside-width="250px"
          padding="12px"
          gap="12px"
          :header-spans-nav="true"
          :header-spans-aside="true"
        >
          <template #header>
            <div class="w-full rounded bg-blue-600 px-6 py-4 text-white">
              <h2 class="text-xl font-bold">
                Large Header (80px)
              </h2>
            </div>
          </template>

          <template #navbar>
            <div class="h-full rounded bg-green-600 px-6 py-4 text-white">
              <h4 class="mb-4 font-medium">
                Wide Navbar (300px)
              </h4>
              <nav class="space-y-2">
                <a
                  href="#"
                  class="block rounded bg-green-700 px-3 py-2"
                >Dashboard</a>
                <a
                  href="#"
                  class="block rounded px-3 py-2 hover:bg-green-700"
                >Users</a>
                <a
                  href="#"
                  class="block rounded px-3 py-2 hover:bg-green-700"
                >Settings</a>
                <a
                  href="#"
                  class="block rounded px-3 py-2 hover:bg-green-700"
                >Analytics</a>
              </nav>
            </div>
          </template>

          <div class="h-full rounded bg-gray-50 p-6">
            <h4 class="mb-4 text-xl font-bold">
              Main Content Area
            </h4>
            <p class="mb-4 text-gray-700">
              This demonstrates a larger layout with increased spacing and padding.
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="rounded bg-white p-4 shadow">
                <h5 class="mb-2 font-medium">
                  Card 1
                </h5>
                <p class="text-sm text-gray-600">
                  Some content here
                </p>
              </div>
              <div class="rounded bg-white p-4 shadow">
                <h5 class="mb-2 font-medium">
                  Card 2
                </h5>
                <p class="text-sm text-gray-600">
                  More content here
                </p>
              </div>
            </div>
          </div>

          <template #aside>
            <div class="h-full rounded bg-purple-600 px-6 py-4 text-white">
              <h4 class="mb-4 font-medium">
                Wide Aside (250px)
              </h4>
              <div class="space-y-3">
                <div class="rounded bg-purple-700 p-3">
                  <h5 class="mb-1 font-medium">
                    Widget 1
                  </h5>
                  <p class="text-sm opacity-90">
                    Widget content
                  </p>
                </div>
                <div class="rounded bg-purple-700 p-3">
                  <h5 class="mb-1 font-medium">
                    Widget 2
                  </h5>
                  <p class="text-sm opacity-90">
                    More widget content
                  </p>
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <div class="w-full rounded bg-red-600 px-6 py-4 text-white">
              <div class="flex items-center justify-between">
                <span class="font-medium">Large Footer (60px)</span>
                <span class="text-sm opacity-90">© 2024 Company</span>
              </div>
            </div>
          </template>
        </AppShell>
      </div>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-medium">
        Compact Layout
      </h3>
      <div class="h-64 overflow-hidden border rounded-lg">
        <AppShell
          header-height="40px"
          footer-height="32px"
          navbar-width="150px"
          aside-width="120px"
          padding="4px"
          gap="4px"
        >
          <template #header>
            <div class="w-full rounded bg-blue-400 px-3 py-1 text-sm text-white">
              Compact Header
            </div>
          </template>

          <template #navbar>
            <div class="h-full rounded bg-green-400 px-3 py-1 text-sm text-white">
              Nav
            </div>
          </template>

          <div class="h-full rounded bg-gray-100 p-3">
            <h4 class="mb-2 text-sm font-medium">
              Compact Main
            </h4>
            <p class="text-xs text-gray-600">
              Minimal spacing and smaller dimensions.
            </p>
          </div>

          <template #aside>
            <div class="h-full rounded bg-purple-400 px-3 py-1 text-sm text-white">
              Side
            </div>
          </template>

          <template #footer>
            <div class="w-full rounded bg-red-400 px-3 py-1 text-sm text-white">
              Footer
            </div>
          </template>
        </AppShell>
      </div>
    </div>
  </div>
</template>
