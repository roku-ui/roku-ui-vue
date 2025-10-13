<script setup lang="ts">
import { computed, useSlots } from 'vue'

export interface AppShellProps {
  headerHeight?: string
  footerHeight?: string
  navbarWidth?: string
  asideWidth?: string
  headerSpansNav?: boolean
  headerSpansAside?: boolean
  footerSpansNav?: boolean
  footerSpansAside?: boolean
  padding?: string | number
}

const props = withDefaults(defineProps<AppShellProps>(), {
  headerHeight: '64px',
  footerHeight: '64px',
  navbarWidth: '280px',
  asideWidth: '280px',
  headerSpansNav: false,
  headerSpansAside: false,
  footerSpansNav: false,
  footerSpansAside: false,
})

const slots = useSlots()

const hasHeader = computed(() => !!slots.header)
const hasNavbar = computed(() => !!slots.navbar)
const hasAside = computed(() => !!slots.aside)
const hasFooter = computed(() => !!slots.footer)

const normalizeSize = (value: string | number): string => typeof value === 'number' ? `${value}px` : value

const containerStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.padding !== undefined) {
    style.padding = normalizeSize(props.padding)
  }
  return style
})

const headerStyle = computed(() => ({
  height: normalizeSize(props.headerHeight),
}))

const footerStyle = computed(() => ({
  height: normalizeSize(props.footerHeight),
}))

const navbarStyle = computed(() => ({
  width: normalizeSize(props.navbarWidth),
}))

const asideStyle = computed(() => ({
  width: normalizeSize(props.asideWidth),
}))
</script>

<template>
  <div
    class="flex flex-col h-100dvh max-h-full w-full box-border"
    :style="containerStyle"
  >
    <!-- Top Header (spans all when headerSpansNav && headerSpansAside) -->
    <header
      v-if="hasHeader && props.headerSpansNav && props.headerSpansAside"
      class="flex shrink-0 items-center"
      :style="headerStyle"
    >
      <slot name="header" />
    </header>

    <!-- Layout when header spans nav only (navbar + main, excluding aside) -->
    <div
      v-if="hasHeader && props.headerSpansNav && !props.headerSpansAside"
      class="flex flex-1 overflow-hidden"
    >
      <!-- Left Part (Navbar + Main) with header -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- Header spans nav only (navbar + main) -->
        <header
          class="flex shrink-0 items-center"
          :style="headerStyle"
        >
          <slot name="header" />
        </header>

        <!-- Navbar + Main Row -->
        <div
          class="flex flex-1 overflow-hidden"
        >
          <!-- Left Navbar -->
          <nav
            v-if="hasNavbar"
            class="flex shrink-0 flex-col overflow-hidden"
            :style="navbarStyle"
          >
            <div class="flex-1 overflow-y-auto">
              <slot name="navbar" />
            </div>
          </nav>

          <!-- Main Content -->
          <main class="flex flex-1 flex-col overflow-hidden">
            <div class="flex-1 overflow-y-auto">
              <slot />
            </div>
            <!-- Footer not spanning anything -->
            <footer
              v-if="hasFooter && !props.footerSpansNav && !props.footerSpansAside"
              class="flex shrink-0 items-center"
              :style="footerStyle"
            >
              <slot name="footer" />
            </footer>
          </main>
        </div>

        <!-- Footer spans nav only (navbar + main) -->
        <footer
          v-if="hasFooter && props.footerSpansNav && !props.footerSpansAside"
          class="flex shrink-0 items-center"
          :style="footerStyle"
        >
          <slot name="footer" />
        </footer>
      </div>

      <!-- Right Aside (independent) -->
      <aside
        v-if="hasAside"
        class="flex shrink-0 flex-col overflow-hidden"
        :style="asideStyle"
      >
        <div class="flex-1 overflow-y-auto">
          <slot name="aside" />
        </div>
      </aside>
    </div>

    <!-- Layout for other cases (normal layout) -->
    <div
      v-else
      class="flex flex-1 overflow-hidden"
    >
      <!-- Left Navbar -->
      <nav
        v-if="hasNavbar"
        class="flex shrink-0 flex-col overflow-hidden"
        :style="navbarStyle"
      >
        <div class="flex-1 overflow-y-auto">
          <slot name="navbar" />
        </div>
      </nav>

      <!-- Right Part (Main + Aside) -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- Header spans aside only (main + aside) -->
        <header
          v-if="hasHeader && !props.headerSpansNav && props.headerSpansAside"
          class="flex shrink-0 items-center"
          :style="headerStyle"
        >
          <slot name="header" />
        </header>

        <!-- Main + Aside Row -->
        <div
          class="flex flex-1 overflow-hidden"
        >
          <!-- Main Content -->
          <main class="flex flex-1 flex-col overflow-hidden">
            <!-- Header not spanning anything -->
            <header
              v-if="hasHeader && !props.headerSpansNav && !props.headerSpansAside"
              class="flex shrink-0 items-center"
              :style="headerStyle"
            >
              <slot name="header" />
            </header>

            <div class="flex-1 overflow-y-auto">
              <slot />
            </div>

            <!-- Footer not spanning anything -->
            <footer
              v-if="hasFooter && !props.footerSpansNav && !props.footerSpansAside"
              class="flex shrink-0 items-center"
              :style="footerStyle"
            >
              <slot name="footer" />
            </footer>
          </main>

          <!-- Right Aside -->
          <aside
            v-if="hasAside"
            class="flex shrink-0 flex-col overflow-hidden"
            :style="asideStyle"
          >
            <div class="flex-1 overflow-y-auto">
              <slot name="aside" />
            </div>
          </aside>
        </div>

        <!-- Footer spans aside only (main + aside) -->
        <footer
          v-if="hasFooter && !props.footerSpansNav && props.footerSpansAside"
          class="flex shrink-0 items-center"
          :style="footerStyle"
        >
          <slot name="footer" />
        </footer>
      </div>
    </div>

    <!-- Footer spans nav only (navbar + main) -->
    <footer
      v-if="hasFooter && props.footerSpansNav && !props.footerSpansAside && !(hasHeader && props.headerSpansNav && !props.headerSpansAside)"
      class="flex shrink-0 items-center"
      :style="footerStyle"
    >
      <slot name="footer" />
    </footer>

    <!-- Bottom Footer (spans all when footerSpansNav && footerSpansAside) -->
    <footer
      v-if="hasFooter && props.footerSpansNav && props.footerSpansAside"
      class="flex shrink-0 items-center"
      :style="footerStyle"
    >
      <slot name="footer" />
    </footer>
  </div>
</template>
