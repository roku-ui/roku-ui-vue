<script setup lang="ts">
import { AppShell, AppShellAside, AppShellFooter, AppShellHeader, AppShellMain, AppShellNavbar } from '@roku-ui/vue'
import { computed, ref } from 'vue'

// Layout options
const headerHeight = ref('60px')
const footerHeight = ref('40px')
const navbarWidth = ref('200px')
const asideWidth = ref('160px')
const padding = ref('8px')

// Span options
const headerSpansNav = ref(false)
const headerSpansAside = ref(false)
const footerSpansNav = ref(false)
const footerSpansAside = ref(false)

// Layout sections visibility
const showHeader = ref(true)
const showFooter = ref(true)
const showNavbar = ref(true)
const showAside = ref(true)

// Size options
const headerHeightOptions = ['40px', '60px', '80px', '100px']
const footerHeightOptions = ['30px', '40px', '50px', '60px']
const navbarWidthOptions = ['150px', '200px', '250px', '300px']
const asideWidthOptions = ['120px', '160px', '200px', '240px']
const paddingOptions = ['4px', '8px', '12px', '16px']

// Computed properties for dynamic props
const appShellProps = computed(() => ({
  headerHeight: showHeader.value ? headerHeight.value : undefined,
  footerHeight: showFooter.value ? footerHeight.value : undefined,
  navbarWidth: showNavbar.value ? navbarWidth.value : undefined,
  asideWidth: showAside.value ? asideWidth.value : undefined,
  padding: padding.value,
  headerSpansNav: headerSpansNav.value,
  headerSpansAside: headerSpansAside.value,
  footerSpansNav: footerSpansNav.value,
  footerSpansAside: footerSpansAside.value,
}))

// Generate code snippet
const codeSnippet = computed(() => {
  const componentOrder = ['AppShell', 'AppShellHeader', 'AppShellNavbar', 'AppShellMain', 'AppShellAside', 'AppShellFooter']
  const usedComponents = new Set<string>(['AppShell', 'AppShellMain'])
  if (showHeader.value) {
    usedComponents.add('AppShellHeader')
  }
  if (showNavbar.value) {
    usedComponents.add('AppShellNavbar')
  }
  if (showAside.value) {
    usedComponents.add('AppShellAside')
  }
  if (showFooter.value) {
    usedComponents.add('AppShellFooter')
  }

  let template = '<template>\n  <AppShell\n'

  if (showHeader.value) {
    template += `    header-height="${headerHeight.value}"\n`
  }
  if (showFooter.value) {
    template += `    footer-height="${footerHeight.value}"\n`
  }
  if (showNavbar.value) {
    template += `    navbar-width="${navbarWidth.value}"\n`
  }
  if (showAside.value) {
    template += `    aside-width="${asideWidth.value}"\n`
  }

  template += `    padding="${padding.value}"\n`

  if (headerSpansNav.value) {
    template += '    :header-spans-nav="true"\n'
  }
  if (headerSpansAside.value) {
    template += '    :header-spans-aside="true"\n'
  }
  if (footerSpansNav.value) {
    template += '    :footer-spans-nav="true"\n'
  }
  if (footerSpansAside.value) {
    template += '    :footer-spans-aside="true"\n'
  }

  template += '  >\n'

  if (showHeader.value) {
    template += '    <template #header>\n'
    template += '      <AppShellHeader>\n'
    template += '        <!-- Header content -->\n'
    template += '      </AppShellHeader>\n'
    template += '    </template>\n\n'
  }

  if (showNavbar.value) {
    template += '    <template #navbar>\n'
    template += '      <AppShellNavbar>\n'
    template += '        <!-- Navbar content -->\n'
    template += '      </AppShellNavbar>\n'
    template += '    </template>\n\n'
  }

  template += '    <AppShellMain>\n'
  template += '      <!-- Main content -->\n'
  template += '    </AppShellMain>\n\n'

  if (showAside.value) {
    template += '    <template #aside>\n'
    template += '      <AppShellAside>\n'
    template += '        <!-- Aside content -->\n'
    template += '      </AppShellAside>\n'
    template += '    </template>\n\n'
  }

  if (showFooter.value) {
    template += '    <template #footer>\n'
    template += '      <AppShellFooter>\n'
    template += '        <!-- Footer content -->\n'
    template += '      </AppShellFooter>\n'
    template += '    </template>\n\n'
  }

  template += '  </AppShell>\n</template>\n'

  const importLine = `import { ${componentOrder.filter(component => usedComponents.has(component)).join(', ')} } from '@roku-ui/vue'`

  return `<script setup lang="ts">\n${importLine}\n<\/script>\n\n${template}`
})
</script>

<template>
  <div class="space-y-8">
    <div class="gap-8 grid grid-cols-1 lg:grid-cols-3">
      <!-- Controls Panel -->
      <div class="space-y-6 lg:col-span-1">
        <div class="space-y-4">
          <h3 class="text-lg font-medium">
            Layout Sections
          </h3>
          <div class="space-y-2">
            <label class="flex items-center space-x-2">
              <input
                v-model="showHeader"
                type="checkbox"
                class="rounded"
              >
              <span class="text-sm">Show Header</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="showNavbar"
                type="checkbox"
                class="rounded"
              >
              <span class="text-sm">Show Navbar</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="showAside"
                type="checkbox"
                class="rounded"
              >
              <span class="text-sm">Show Aside</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="showFooter"
                type="checkbox"
                class="rounded"
              >
              <span class="text-sm">Show Footer</span>
            </label>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-medium">
            Span Options
          </h3>
          <div class="space-y-2">
            <label class="flex items-center space-x-2">
              <input
                v-model="headerSpansNav"
                type="checkbox"
                class="rounded"
                :disabled="!showHeader"
              >
              <span class="text-sm">Header spans navbar</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="headerSpansAside"
                type="checkbox"
                class="rounded"
                :disabled="!showHeader"
              >
              <span class="text-sm">Header spans aside</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="footerSpansNav"
                type="checkbox"
                class="rounded"
                :disabled="!showFooter"
              >
              <span class="text-sm">Footer spans navbar</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="footerSpansAside"
                type="checkbox"
                class="rounded"
                :disabled="!showFooter"
              >
              <span class="text-sm">Footer spans aside</span>
            </label>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-medium">
            Dimensions
          </h3>
          <div class="space-y-2">
            <div
              v-if="showHeader"
              class="space-y-1"
            >
              <label class="text-sm font-medium block">Header Height</label>
              <select
                v-model="headerHeight"
                class="text-sm px-3 py-2 border rounded-md w-full"
              >
                <option
                  v-for="size in headerHeightOptions"
                  :key="size"
                  :value="size"
                >
                  {{ size }}
                </option>
              </select>
            </div>

            <div
              v-if="showFooter"
              class="space-y-1"
            >
              <label class="text-sm font-medium block">Footer Height</label>
              <select
                v-model="footerHeight"
                class="text-sm px-3 py-2 border rounded-md w-full"
              >
                <option
                  v-for="size in footerHeightOptions"
                  :key="size"
                  :value="size"
                >
                  {{ size }}
                </option>
              </select>
            </div>

            <div
              v-if="showNavbar"
              class="space-y-1"
            >
              <label class="text-sm font-medium block">Navbar Width</label>
              <select
                v-model="navbarWidth"
                class="text-sm px-3 py-2 border rounded-md w-full"
              >
                <option
                  v-for="size in navbarWidthOptions"
                  :key="size"
                  :value="size"
                >
                  {{ size }}
                </option>
              </select>
            </div>

            <div
              v-if="showAside"
              class="space-y-1"
            >
              <label class="text-sm font-medium block">Aside Width</label>
              <select
                v-model="asideWidth"
                class="text-sm px-3 py-2 border rounded-md w-full"
              >
                <option
                  v-for="size in asideWidthOptions"
                  :key="size"
                  :value="size"
                >
                  {{ size }}
                </option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium block">Padding</label>
              <select
                v-model="padding"
                class="text-sm px-3 py-2 border rounded-md w-full"
              >
                <option
                  v-for="size in paddingOptions"
                  :key="size"
                  :value="size"
                >
                  {{ size }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Panel -->
      <div class="space-y-6 lg:col-span-2">
        <div class="space-y-4">
          <h3 class="text-lg font-medium">
            Preview
          </h3>
          <div class="border rounded-lg h-96 overflow-hidden">
            <AppShell v-bind="appShellProps">
              <template
                v-if="showHeader"
                #header
              >
                <AppShellHeader>
                  <span class="font-medium">Header</span>
                </AppShellHeader>
              </template>

              <template
                v-if="showNavbar"
                #navbar
              >
                <AppShellNavbar>
                  <div class="font-medium">
                    Navbar
                  </div>
                  <nav class="space-y-1">
                    <div class="text-sm px-2 py-1 rounded bg-gray-100">
                      Dashboard
                    </div>
                    <div class="text-sm px-2 py-1 rounded cursor-pointer hover:bg-gray-100">
                      Users
                    </div>
                    <div class="text-sm px-2 py-1 rounded cursor-pointer hover:bg-gray-100">
                      Settings
                    </div>
                  </nav>
                </AppShellNavbar>
              </template>

              <AppShellMain>
                <h4 class="font-medium mt-0">
                  Main Content
                </h4>
                <p class="text-surface-dimmed">
                  This is the main content area. Adjust the controls to see the layout change.
                </p>
                <div class="gap-3 grid grid-cols-1 md:grid-cols-2">
                  <div class="border-surface px-3 py-2 border rounded">
                    <h5 class="font-medium mb-1">
                      Content Block 1
                    </h5>
                    <p class="text-surface-dimmed text-sm">
                      Some content here
                    </p>
                  </div>
                  <div class="border-surface px-3 py-2 border rounded">
                    <h5 class="font-medium mb-1">
                      Content Block 2
                    </h5>
                    <p class="text-surface-dimmed text-sm">
                      More content here
                    </p>
                  </div>
                </div>
              </AppShellMain>

              <template
                v-if="showAside"
                #aside
              >
                <AppShellAside>
                  <div class="font-medium">
                    Aside
                  </div>
                  <div class="space-y-2">
                    <div class="border-surface px-2 py-2 border rounded">
                      <div class="text-sm font-medium">
                        Widget 1
                      </div>
                      <div class="text-surface-dimmed text-xs">
                        Widget content
                      </div>
                    </div>
                    <div class="border-surface px-2 py-2 border rounded">
                      <div class="text-sm font-medium">
                        Widget 2
                      </div>
                      <div class="text-surface-dimmed text-xs">
                        More content
                      </div>
                    </div>
                  </div>
                </AppShellAside>
              </template>

              <template
                v-if="showFooter"
                #footer
              >
                <AppShellFooter>
                  <span class="text-surface-dimmed text-sm">Footer Content</span>
                </AppShellFooter>
              </template>
            </AppShell>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-medium">
            Generated Code
          </h3>
          <div class="p-4 rounded-lg bg-gray-50">
            <pre class="text-sm text-gray-800 overflow-x-auto"><code>{{ codeSnippet }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
