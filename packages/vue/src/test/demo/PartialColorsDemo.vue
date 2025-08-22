<script setup lang="ts">
import type { ThemeData } from '@/shared'
import { computed, ref } from 'vue'
import { Btn, RokuProvider, Switch, TextField } from '@/components'

// Only set primary color
const primaryOnlyTheme = ref<Partial<ThemeData>>({
  colors: {
    primary: '#ff6b35', // Orange primary
  },
})

// Only set primary and secondary colors
const partialTheme = ref<Partial<ThemeData>>({
  colors: {
    primary: '#6366f1', // Indigo primary
    secondary: '#06d6a0', // Green secondary
  },
})

// Full color theme for comparison
const fullTheme = ref<Partial<ThemeData>>({
  colors: {
    primary: '#e11d48', // Rose primary
    secondary: '#0ea5e9', // Sky secondary
    tertiary: '#a855f7', // Purple tertiary
    error: '#f97316', // Orange error
    surface: '#1e293b', // Slate surface
  },
})

const primaryOnlyComputed = computed(() => primaryOnlyTheme.value)
const partialComputed = computed(() => partialTheme.value)
const fullComputed = computed(() => fullTheme.value)

const switchValue1 = ref(false)
const switchValue2 = ref(false)
const switchValue3 = ref(false)
</script>

<template>
  <div class="p-6 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-2">
        Partial Colors Demo
      </h1>
      <p class="text-surface-variant-4">
        Test setting only some colors while keeping others as defaults
      </p>
    </div>

    <div class="gap-6 grid grid-cols-1 lg:grid-cols-3">
      <!-- Primary Only -->
      <div class="border-surface-variant-1 p-6 border rounded-lg">
        <h2 class="text-xl font-semibold mb-4">
          Primary Only
        </h2>
        <p class="text-surface-variant-4 text-sm mb-4">
          只设置 primary 颜色为橙色，其他颜色保持默认
        </p>
        <RokuProvider :theme-obj="primaryOnlyComputed">
          <div class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <Btn color="primary">
                Primary (Orange)
              </Btn>
              <Btn color="secondary">
                Secondary (Default)
              </Btn>
              <Btn color="tertiary">
                Tertiary (Default)
              </Btn>
              <Btn color="error">
                Error (Default)
              </Btn>
            </div>
            <div class="space-y-2">
              <TextField placeholder="Primary color input" />
              <TextField
                placeholder="Secondary color input"
                color="secondary"
              />
              <Switch
                v-model="switchValue1"
                label="Primary switch"
              />
            </div>
          </div>
        </RokuProvider>
      </div>

      <!-- Partial Colors -->
      <div class="border-surface-variant-1 p-6 border rounded-lg">
        <h2 class="text-xl font-semibold mb-4">
          Partial Colors
        </h2>
        <p class="text-surface-variant-4 text-sm mb-4">
          设置 primary (靛蓝) 和 secondary (绿色)，其他颜色保持默认
        </p>
        <RokuProvider :theme-obj="partialComputed">
          <div class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <Btn color="primary">
                Primary (Indigo)
              </Btn>
              <Btn color="secondary">
                Secondary (Green)
              </Btn>
              <Btn color="tertiary">
                Tertiary (Default)
              </Btn>
              <Btn color="error">
                Error (Default)
              </Btn>
            </div>
            <div class="space-y-2">
              <TextField placeholder="Primary color input" />
              <TextField
                placeholder="Secondary color input"
                color="secondary"
              />
              <Switch
                v-model="switchValue2"
                label="Primary switch"
              />
            </div>
          </div>
        </RokuProvider>
      </div>

      <!-- Full Colors -->
      <div class="border-surface-variant-1 p-6 border rounded-lg">
        <h2 class="text-xl font-semibold mb-4">
          Full Colors
        </h2>
        <p class="text-surface-variant-4 text-sm mb-4">
          设置所有颜色（对比用）
        </p>
        <RokuProvider :theme-obj="fullComputed">
          <div class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <Btn color="primary">
                Primary (Rose)
              </Btn>
              <Btn color="secondary">
                Secondary (Sky)
              </Btn>
              <Btn color="tertiary">
                Tertiary (Purple)
              </Btn>
              <Btn color="error">
                Error (Orange)
              </Btn>
            </div>
            <div class="space-y-2">
              <TextField placeholder="Primary color input" />
              <TextField
                placeholder="Secondary color input"
                color="secondary"
              />
              <Switch
                v-model="switchValue3"
                label="Primary switch"
              />
            </div>
          </div>
        </RokuProvider>
      </div>
    </div>

    <div class="border-surface-variant-1 p-6 border rounded-lg">
      <h2 class="text-xl font-semibold mb-4">
        Configuration Examples
      </h2>
      <div class="gap-4 grid grid-cols-1 md:grid-cols-3">
        <div>
          <h3 class="font-medium mb-2">
            Primary Only
          </h3>
          <pre class="bg-surface-variant-1 text-xs p-3 rounded overflow-auto"><code>{
  colors: {
    primary: '#ff6b35'
  }
}</code></pre>
        </div>
        <div>
          <h3 class="font-medium mb-2">
            Partial Colors
          </h3>
          <pre class="bg-surface-variant-1 text-xs p-3 rounded overflow-auto"><code>{
  colors: {
    primary: '#6366f1',
    secondary: '#06d6a0'
  }
}</code></pre>
        </div>
        <div>
          <h3 class="font-medium mb-2">
            Full Colors
          </h3>
          <pre class="bg-surface-variant-1 text-xs p-3 rounded overflow-auto"><code>{
  colors: {
    primary: '#e11d48',
    secondary: '#0ea5e9',
    tertiary: '#a855f7',
    error: '#f97316',
    surface: '#1e293b'
  }
}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>
