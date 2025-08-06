<script setup lang="ts">
import { inject, reactive, ref, watch } from 'vue'
import { Btn, Paper } from '@/components'
import { useSchemeString } from '@/composables'
import { defaultThemeData } from '@/shared'

// 应用层的主题状态管理
const scheme = useSchemeString()

// 从 App.vue 注入全局主题状态和更新函数
const globalTheme = inject<any>('globalTheme', ref({ ...defaultThemeData }))
const updateGlobalTheme = inject<(theme: any) => void>('updateGlobalTheme', () => {})

const editableTheme = reactive({
  ...defaultThemeData,
  colors: { ...defaultThemeData.colors },
})

// 监听全局主题变化，同步到可编辑主题
watch(globalTheme, (newTheme) => {
  if (newTheme) {
    Object.assign(editableTheme, newTheme)
    Object.assign(editableTheme.colors, newTheme.colors)
  }
}, { immediate: true, deep: true })

function applyTheme() {
  // 确保深拷贝并触发响应性更新
  const newTheme = {
    withBorder: editableTheme.withBorder,
    rounded: editableTheme.rounded,
    colors: {
      primary: editableTheme.colors.primary,
      secondary: editableTheme.colors.secondary,
      tertiary: editableTheme.colors.tertiary,
      error: editableTheme.colors.error,
      surface: editableTheme.colors.surface,
    },
  }
  updateGlobalTheme(newTheme)
}

function resetToDefault() {
  Object.assign(editableTheme, defaultThemeData)
  Object.assign(editableTheme.colors, defaultThemeData.colors)
  updateGlobalTheme({ ...defaultThemeData })
}

function setScheme(newScheme: string) {
  scheme.value = newScheme
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.scheme = newScheme
  }
}

function toggleScheme() {
  setScheme(scheme.value === 'light' ? 'dark' : 'light')
}
</script>

<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold mb-4">
      Theme Manager Demo
    </h2>

    <Paper class="p-4">
      <h3 class="text-lg font-semibold mb-4">
        Current Theme
      </h3>
      <pre class="text-sm p-3 rounded overflow-auto">{{ JSON.stringify(globalTheme, null, 2) }}</pre>
    </Paper>

    <Paper class="p-4 space-y-4">
      <h3 class="text-lg font-semibold">
        Theme Controls
      </h3>

      <div class="gap-4 grid grid-cols-2">
        <div>
          <label class="text-sm font-medium mb-2 block">Primary Color</label>
          <input
            v-model="editableTheme.colors.primary"
            type="color"
            class="border rounded h-10 w-full"
          >
        </div>

        <div>
          <label class="text-sm font-medium mb-2 block">Secondary Color</label>
          <input
            v-model="editableTheme.colors.secondary"
            type="color"
            class="border rounded h-10 w-full"
          >
        </div>

        <div>
          <label class="text-sm font-medium mb-2 block">Tertiary Color</label>
          <input
            v-model="editableTheme.colors.tertiary"
            type="color"
            class="border rounded h-10 w-full"
          >
        </div>

        <div>
          <label class="text-sm font-medium mb-2 block">Error Color</label>
          <input
            v-model="editableTheme.colors.error"
            type="color"
            class="border rounded h-10 w-full"
          >
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium block">Border Style</label>
        <label class="inline-flex items-center">
          <input
            v-model="editableTheme.withBorder"
            type="checkbox"
            class="rounded"
          >
          <span class="ml-2">With Border</span>
        </label>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium mb-2 block">Border Radius</label>
        <select
          v-model="editableTheme.rounded"
          class="p-2 border rounded w-full"
        >
          <option value="none">
            None
          </option>
          <option value="sm">
            Small
          </option>
          <option value="md">
            Medium
          </option>
          <option value="lg">
            Large
          </option>
          <option value="xl">
            Extra Large
          </option>
        </select>
      </div>

      <div class="flex gap-2">
        <Btn
          variant="filled"
          color="primary"
          @click="applyTheme"
        >
          Apply Theme
        </Btn>

        <Btn
          variant="outline"
          color="secondary"
          @click="resetToDefault"
        >
          Reset to Default
        </Btn>
      </div>
    </Paper>

    <Paper class="p-4 space-y-4">
      <h3 class="text-lg font-semibold">
        Theme Preview
      </h3>

      <div class="gap-2 grid grid-cols-4">
        <div
          class="text-sm font-medium rounded flex h-16 items-center justify-center"
          :style="{ backgroundColor: editableTheme.colors.primary, color: 'white' }"
        >
          Primary
        </div>
        <div
          class="text-sm font-medium rounded flex h-16 items-center justify-center"
          :style="{ backgroundColor: editableTheme.colors.secondary, color: 'white' }"
        >
          Secondary
        </div>
        <div
          class="text-sm font-medium rounded flex h-16 items-center justify-center"
          :style="{ backgroundColor: editableTheme.colors.tertiary, color: 'white' }"
        >
          Tertiary
        </div>
        <div
          class="text-sm font-medium rounded flex h-16 items-center justify-center"
          :style="{ backgroundColor: editableTheme.colors.error, color: 'white' }"
        >
          Error
        </div>
      </div>
    </Paper>

    <Paper class="p-4 space-y-4">
      <h3 class="text-lg font-semibold">
        Paper Component Theme Test
      </h3>

      <div class="space-y-2">
        <p class="text-sm">
          These Paper components automatically inherit theme settings:
        </p>

        <div class="gap-4 grid grid-cols-2">
          <Paper class="p-3">
            <div class="text-sm">
              Default Paper<br>
              <small class="opacity-70">Uses theme border & rounded settings</small>
            </div>
          </Paper>

          <Paper
            class="p-3"
            :with-border="false"
          >
            <div class="text-sm">
              No Border Paper<br>
              <small class="opacity-70">Overrides theme border setting</small>
            </div>
          </Paper>

          <Paper
            class="p-3"
            rounded="none"
          >
            <div class="text-sm">
              No Radius Paper<br>
              <small class="opacity-70">Overrides theme rounded setting</small>
            </div>
          </Paper>

          <Paper
            class="p-3"
            rounded="full"
          >
            <div class="text-sm">
              Full Radius Paper<br>
              <small class="opacity-70">Overrides theme rounded setting</small>
            </div>
          </Paper>
        </div>
      </div>
    </Paper>

    <Paper class="p-4 space-y-4">
      <h3 class="text-lg font-semibold">
        Scheme Controls
      </h3>

      <div class="flex gap-2">
        <Btn
          :variant="scheme === 'light' ? 'filled' : 'outline'"
          color="primary"
          @click="setScheme('light')"
        >
          Light
        </Btn>

        <Btn
          :variant="scheme === 'dark' ? 'filled' : 'outline'"
          color="primary"
          @click="setScheme('dark')"
        >
          Dark
        </Btn>

        <Btn
          variant="filled"
          color="tertiary"
          @click="toggleScheme"
        >
          Toggle Scheme
        </Btn>
      </div>

      <p class="text-sm">
        Current scheme: <strong>{{ scheme }}</strong>
      </p>
    </Paper>
  </div>
</template>
