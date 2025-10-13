<script setup lang="ts">
import { ref } from 'vue'
import { AppShell, AppShellAside, AppShellFooter, AppShellHeader, AppShellMain, AppShellNavbar } from '../../components'

const headerSpansNav = ref(false)
const headerSpansAside = ref(false)
const footerSpansNav = ref(false)
const footerSpansAside = ref(false)
const headerHeight = ref('60px')
const navbarWidth = ref('200px')
</script>

<template>
  <div>
    <h1>
      AppShell Demo
    </h1>

    <!-- Basic Layout -->
    <section>
      <h2>
        Basic Layout
      </h2>
      <div>
        <AppShell
          header-height="60px"
          footer-height="40px"
          navbar-width="200px"
          aside-width="160px"
          padding="16px"
        >
          <template #header>
            <AppShellHeader align="between">
              <h3>Application Header</h3>
              <span class="text-surface-dimmed text-sm">Demo View</span>
            </AppShellHeader>
          </template>

          <template #navbar>
            <AppShellNavbar>
              <h4>Navigation</h4>
              <ul class="text-surface-dimmed text-sm space-y-1">
                <li>Dashboard</li>
                <li>Users</li>
                <li>Settings</li>
              </ul>
            </AppShellNavbar>
          </template>

          <AppShellMain>
            <h4>Main Content</h4>
            <p>This is the main content area. It's scrollable and takes up the remaining space.</p>
            <div class="gap-3 grid grid-cols-1 md:grid-cols-2">
              <section class="border-surface px-3 py-2 border rounded">
                <h5>Card 1</h5>
                <p>Content here</p>
              </section>
              <section class="border-surface px-3 py-2 border rounded">
                <h5>Card 2</h5>
                <p>More content</p>
              </section>
            </div>
          </AppShellMain>

          <template #aside>
            <AppShellAside>
              <h4>Sidebar</h4>
              <section class="border-surface px-3 py-2 border rounded">
                <h5>Widget 1</h5>
                <p>Some widget content</p>
              </section>
              <section class="border-surface px-3 py-2 border rounded">
                <h5>Widget 2</h5>
                <p>More widget content</p>
              </section>
            </AppShellAside>
          </template>

          <template #footer>
            <AppShellFooter align="between">
              <span>© 2024 Application</span>
              <span class="text-surface-dimmed text-sm">v1.0.0</span>
            </AppShellFooter>
          </template>
        </AppShell>
      </div>
    </section>

    <!-- Header Spans All -->
    <section>
      <h2>
        Header Spans All
      </h2>
      <div>
        <AppShell
          header-height="60px"
          footer-height="40px"
          navbar-width="200px"
          aside-width="160px"
          padding="16px"
          :header-spans-nav="true"
          :header-spans-aside="true"
        >
          <template #header>
            <AppShellHeader align="between">
              <h3>Header (Spans All)</h3>
              <span class="text-surface-dimmed text-sm">Global Actions</span>
            </AppShellHeader>
          </template>

          <template #navbar>
            <AppShellNavbar>
              <span>Navigation</span>
            </AppShellNavbar>
          </template>

          <AppShellMain>
            <h4>Main Content</h4>
            <p>Notice how the header spans across both navbar and aside sections.</p>
          </AppShellMain>

          <template #aside>
            <AppShellAside>
              <span>Sidebar</span>
            </AppShellAside>
          </template>

          <template #footer>
            <AppShellFooter>
              <span>Footer</span>
            </AppShellFooter>
          </template>
        </AppShell>
      </div>
    </section>

    <!-- Minimal Layouts -->
    <section>
      <h2>
        Minimal Layouts
      </h2>
      <div>
        <!-- Header + Main -->
        <div>
          <h3>
            Header + Main
          </h3>
          <div>
            <AppShell
              header-height="50px"
              padding="12px"
            >
              <template #header>
                <AppShellHeader>
                  <span>Header Only</span>
                </AppShellHeader>
              </template>

              <AppShellMain>
                <h4>Main Content</h4>
                <p>Simple header + main layout</p>
              </AppShellMain>
            </AppShell>
          </div>
        </div>

        <!-- Navbar + Main -->
        <div>
          <h3>
            Navbar + Main
          </h3>
          <div>
            <AppShell
              navbar-width="120px"
              padding="12px"
            >
              <template #navbar>
                <AppShellNavbar>
                  <h4>Navigation</h4>
                  <ul class="text-surface-dimmed text-sm space-y-1">
                    <li>Item 1</li>
                    <li>Item 2</li>
                  </ul>
                </AppShellNavbar>
              </template>

              <AppShellMain>
                <h4>Main Content</h4>
                <p>Sidebar navigation layout</p>
              </AppShellMain>
            </AppShell>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Controls -->
    <section>
      <h2>
        Interactive Demo
      </h2>
      <div>
        <!-- Controls -->
        <div>
          <h3>
            Controls
          </h3>
          <div>
            <div>
              <label>
                <input
                  v-model="headerSpansNav"
                  type="checkbox"
                >
                <span>Header spans nav</span>
              </label>
              <label>
                <input
                  v-model="headerSpansAside"
                  type="checkbox"
                >
                <span>Header spans aside</span>
              </label>
            </div>
            <div>
              <label>
                <input
                  v-model="footerSpansNav"
                  type="checkbox"
                >
                <span>Footer spans nav</span>
              </label>
              <label>
                <input
                  v-model="footerSpansAside"
                  type="checkbox"
                >
                <span>Footer spans aside</span>
              </label>
            </div>
            <div>
              <label>Header Height</label>
              <select
                v-model="headerHeight"
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
            <div>
              <label>Navbar Width</label>
              <select
                v-model="navbarWidth"
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
        <div>
          <h3>
            Preview
          </h3>
          <div>
            <AppShell
              :header-height="headerHeight"
              footer-height="40px"
              :navbar-width="navbarWidth"
              aside-width="160px"
              padding="12px"
              :header-spans-nav="headerSpansNav"
              :header-spans-aside="headerSpansAside"
              :footer-spans-nav="footerSpansNav"
              :footer-spans-aside="footerSpansAside"
            >
              <template #header>
                <AppShellHeader align="between">
                  <span>Dynamic Header</span>
                  <span class="text-surface-dimmed text-sm">Live preview</span>
                </AppShellHeader>
              </template>

              <template #navbar>
                <AppShellNavbar>
                  <span>Navigation</span>
                </AppShellNavbar>
              </template>

              <AppShellMain>
                <h4>Main Content</h4>
                <p>Adjust the controls to see the layout change.</p>
              </AppShellMain>

              <template #aside>
                <AppShellAside>
                  <span>Sidebar</span>
                </AppShellAside>
              </template>

              <template #footer>
                <AppShellFooter>
                  <span>Footer</span>
                </AppShellFooter>
              </template>
            </AppShell>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
