<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ColorInput, Paper, Switch } from '@/components'
import {
  generateEditorFriendlyColors,
  useSchemeString,
} from '@/composables'

const scheme = useSchemeString()
function toggleScheme() {
  scheme.value = scheme.value === 'light' ? 'dark' : 'light'
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.scheme = scheme.value
  }
}

const primaryColor = ref('#0067cc')
const secondaryColor = ref('#5999a6')
const tertiaryColor = ref('#f76c22')
const errorColor = ref('#f95858')
const surfaceColor = ref('#121212')

const editableColors = reactive([
  { label: 'Primary', value: primaryColor },
  { label: 'Secondary', value: secondaryColor },
  { label: 'Tertiary', value: tertiaryColor },
  { label: 'Error', value: errorColor },
  { label: 'Surface', value: surfaceColor },
])

const colorInfo = computed(() => ({
  primary: generateEditorFriendlyColors(primaryColor.value),
  secondary: generateEditorFriendlyColors(secondaryColor.value),
  tertiary: generateEditorFriendlyColors(tertiaryColor.value),
  error: generateEditorFriendlyColors(errorColor.value),
  surface: generateEditorFriendlyColors(surfaceColor.value),
}))

const showPaletteDetails = ref(false)
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="space-y-4">
      <h1 class="text-surface text-3xl font-bold">
        Enhanced Color System Demo
      </h1>
      <p class="text-surface-dimmed">
        Toggle themes, tweak a few key colors, and inspect the generated palettes.
      </p>
    </div>

    <Paper class="p-6 space-y-4">
      <h2 class="text-surface text-xl font-semibold">
        Theme Controls
      </h2>

      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex gap-2 items-center">
          <label class="text-surface text-sm font-medium">Color Scheme</label>
          <Switch
            :model-value="scheme === 'dark'"
            @update:model-value="toggleScheme()"
          />
          <span class="text-surface-dimmed text-sm">{{ scheme }}</span>
        </div>
      </div>
    </Paper>

    <Paper class="p-6 space-y-4">
      <h2 class="text-surface text-xl font-semibold">
        Custom Colors
      </h2>

      <div class="gap-4 grid grid-cols-1 lg:grid-cols-5 md:grid-cols-3">
        <div
          v-for="item in editableColors"
          :key="item.label"
          class="space-y-2"
        >
          <label class="text-surface text-sm font-medium">{{ item.label }}</label>
          <ColorInput v-model="item.value" />
          <div class="text-surface-dimmed text-xs">
            {{ item.value }}
          </div>
        </div>
      </div>
    </Paper>

    <Paper class="p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-surface text-xl font-semibold">
          Generated Palettes
        </h2>
        <Switch
          v-model="showPaletteDetails"
          label="Show OKLCH Values"
        />
      </div>

      <div class="space-y-6">
        <div
          v-for="(colors, colorName) in colorInfo"
          :key="colorName"
          class="space-y-2"
        >
          <h3 class="text-surface text-lg font-medium capitalize">
            {{ colorName }}
          </h3>
          <div class="gap-1 grid grid-cols-11">
            <div
              v-for="color in colors"
              :key="color.index"
              class="group border-surface-variant border rounded-lg aspect-square cursor-pointer relative"
              :style="{ backgroundColor: color.hex }"
              :title="showPaletteDetails ? color.oklch : color.hex"
            >
              <div class="opacity-0 flex transition-opacity items-center inset-0 justify-center absolute group-hover:opacity-100">
                <span class="text-xs text-white font-mono px-1 rounded bg-black/70">
                  {{ color.index }}
                </span>
              </div>
            </div>
          </div>
          <div
            v-if="showPaletteDetails"
            class="text-surface-dimmed text-xs flex flex-wrap gap-2"
          >
            <span
              v-for="color in colors"
              :key="`detail-${color.index}`"
            >
              {{ color.index }} → {{ color.oklch }}
            </span>
          </div>
        </div>
      </div>
    </Paper>
  </div>
</template>
