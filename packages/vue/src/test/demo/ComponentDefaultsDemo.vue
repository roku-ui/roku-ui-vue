<script setup lang="ts">
import { computed, ref } from 'vue'
import { Avatar, Btn, Checkbox, Paper, Select, Switch, Tag, TextField, ThemeProvider } from '@/components'
import type { ThemeData } from '@/shared'

const customTheme = ref<ThemeData>({
  withBorder: true,
  rounded: 'md',
  colors: {
    primary: '#0067cc',
    secondary: '#5999A6', 
    tertiary: '#F76C22',
    error: '#F95858',
    surface: '#121212',
  },
  defaultSize: 'md',
  defaultColor: 'primary',
  componentDefaults: {
    Btn: {
      variant: 'filled',
      size: 'lg',
      color: 'tertiary',
      pressEffect: 'scale',
      rounded: 'full',
    },
    TextField: {
      size: 'lg',
      color: 'secondary',
      rounded: 'lg',
    },
    Switch: {
      size: 'lg',
      color: 'tertiary',
    },
    Select: {
      size: 'lg',
      color: 'error',
      rounded: 'sm',
    },
    Checkbox: {
      size: 'lg',
      color: 'tertiary',
      rounded: 'sm',
    },
    Paper: {
      color: 'tertiary',
      rounded: 'lg',
    },
    Avatar: {
      size: 'lg',
      color: 'secondary',
      rounded: 'md',
    },
    Tag: {
      size: 'lg',
      variant: 'filled',
      color: 'error',
      rounded: 'full',
    },
  },
})

const customThemeComputed = computed(() => customTheme.value)

const normalTheme = ref<ThemeData>({
  withBorder: true,
  rounded: 'md',
  colors: {
    primary: '#0067cc',
    secondary: '#5999A6',
    tertiary: '#F76C22', 
    error: '#F95858',
    surface: '#121212',
  },
  defaultSize: 'md',
  defaultColor: 'primary',
  componentDefaults: {},
})

const normalThemeComputed = computed(() => normalTheme.value)

const normalSwitchValue = ref(false)
const normalCheckboxValue = ref(false)
const customSwitchValue = ref(false) 
const customCheckboxValue = ref(false)
</script>

<template>
  <div class="space-y-6 p-4">
    <h2 class="text-2xl font-bold mb-4">
      Component Defaults Demo
    </h2>
    
    <div class="space-y-4">
      <section class="border border-surface-variant-1 p-4 rounded-md">
        <h3 class="text-lg font-semibold mb-3">
          Normal Theme (No Component Defaults)
        </h3>
        <ThemeProvider :theme="normalThemeComputed">
          <div class="space-y-4">
            <div class="space-y-2">
              <h4 class="text-sm font-medium">Buttons</h4>
              <div class="flex gap-3 flex-wrap">
                <Btn>Default Button</Btn>
                <Btn variant="outline">Outline Button</Btn>
                <Btn size="sm">Small Button</Btn>
                <Btn color="secondary">Secondary Color</Btn>
              </div>
            </div>
            <div class="space-y-2">
              <h4 class="text-sm font-medium">Form Controls</h4>
              <div class="flex gap-3 flex-wrap items-center">
                <TextField placeholder="Text field" />
                <Switch v-model="normalSwitchValue" />
                <Select :options="['Option 1', 'Option 2', 'Option 3']" placeholder="Select" />
                <Checkbox v-model="normalCheckboxValue" label="Checkbox" />
              </div>
            </div>
            <div class="space-y-2">
              <h4 class="text-sm font-medium">Display Components</h4>
              <div class="flex gap-3 flex-wrap items-center">
                <Avatar name="John Doe" />
                <Tag>Default Tag</Tag>
                <Paper class="p-4">Paper Component</Paper>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </section>

      <section class="border border-surface-variant-1 p-4 rounded-md">
        <h3 class="text-lg font-semibold mb-3">
          Custom Theme with Component Defaults
        </h3>
        <p class="text-sm text-surface-variant-4 mb-3">
          All components have custom defaults applied (larger sizes, different colors, etc.)
        </p>
        <ThemeProvider :theme="customThemeComputed">
          <div class="space-y-4">
            <div class="space-y-2">
              <h4 class="text-sm font-medium">Buttons (filled, lg, tertiary, scale effect, full rounded)</h4>
              <div class="flex gap-3 flex-wrap">
                <Btn>Default Button (uses defaults)</Btn>
                <Btn variant="outline">Outline Button (overrides variant)</Btn>
                <Btn size="sm">Small Button (overrides size)</Btn>
                <Btn color="secondary">Secondary Color (overrides color)</Btn>
                <Btn rounded="md">Square Button (overrides rounded)</Btn>
                <Btn press-effect="translate">Translate Effect (overrides pressEffect)</Btn>
              </div>
            </div>
            <div class="space-y-2">
              <h4 class="text-sm font-medium">Form Controls (all lg size with custom colors)</h4>
              <div class="flex gap-3 flex-wrap items-center">
                <TextField placeholder="Text field (lg, secondary, lg rounded)" />
                <Switch v-model="customSwitchValue" label="Switch (lg, tertiary)" />
                <Select :options="['Option 1', 'Option 2', 'Option 3']" placeholder="Select (lg, error, sm rounded)" />
                <Checkbox v-model="customCheckboxValue" label="Checkbox (lg, tertiary, sm rounded)" />
              </div>
            </div>
            <div class="space-y-2">
              <h4 class="text-sm font-medium">Display Components</h4>
              <div class="flex gap-3 flex-wrap items-center">
                <Avatar name="John Doe" title="Avatar (lg, secondary, md rounded)" />
                <Tag>Default Tag (lg, filled, error, full rounded)</Tag>
                <Paper class="p-4">Paper Component (tertiary, lg rounded)</Paper>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </section>

      <section class="border border-surface-variant-1 p-4 rounded-md">
        <h3 class="text-lg font-semibold mb-3">
          Theme Configuration
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="font-medium mb-2">Custom Theme Component Defaults:</h4>
            <pre class="text-xs bg-surface-variant-1 p-2 rounded overflow-auto"><code>componentDefaults: {
  Btn: {
    variant: 'filled',
    size: 'lg', 
    color: 'tertiary',
    pressEffect: 'scale',
    rounded: 'full',
  },
}</code></pre>
          </div>
          <div>
            <h4 class="font-medium mb-2">Usage Examples:</h4>
            <pre class="text-xs bg-surface-variant-1 p-2 rounded overflow-auto"><code>&lt;Btn&gt;Uses all defaults&lt;/Btn&gt;
&lt;Btn variant="outline"&gt;Override variant&lt;/Btn&gt;
&lt;Btn size="sm"&gt;Override size&lt;/Btn&gt;</code></pre>
          </div>
        </div>
      </section>

      <section class="border border-surface-variant-1 p-4 rounded-md">
        <h3 class="text-lg font-semibold mb-3">
          Dynamic Theme Switching
        </h3>
        <div class="space-y-3">
          <div class="flex gap-3">
            <button 
              @click="customTheme.componentDefaults!.Btn!.variant = 'filled'"
              class="px-3 py-1 bg-primary text-white rounded"
            >
              Set Variant: Filled
            </button>
            <button 
              @click="customTheme.componentDefaults!.Btn!.variant = 'outline'"  
              class="px-3 py-1 bg-primary text-white rounded"
            >
              Set Variant: Outline
            </button>
            <button
              @click="customTheme.componentDefaults!.Btn!.size = 'sm'"
              class="px-3 py-1 bg-secondary text-white rounded" 
            >
              Set Size: Small
            </button>
            <button
              @click="customTheme.componentDefaults!.Btn!.size = 'lg'"
              class="px-3 py-1 bg-secondary text-white rounded"
            >
              Set Size: Large
            </button>
          </div>
          <div class="mt-4">
            <ThemeProvider :theme="customThemeComputed">
              <Btn>Dynamic Button (changes with theme)</Btn>
            </ThemeProvider>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>