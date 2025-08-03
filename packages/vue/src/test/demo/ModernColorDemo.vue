<script setup lang="ts">
import { computed, ref } from 'vue'
import { Btn, Paper, Switch, TextField } from '@/components'
import {
  generateEditorFriendlyColors,
  generateOKLCHString,
  useThemeManager,
} from '@/composables'

// Theme management
const { theme, scheme, setTheme, toggleScheme, availableThemes } = useThemeManager()

// Custom color inputs
const primaryColor = ref('#0067cc')
const secondaryColor = ref('#5999A6')
const tertiaryColor = ref('#F76C22')
const errorColor = ref('#F95858')

// Create custom theme with OKLCH (for future use)
// const customThemeData = useThemeDataOKLCH('custom', {
//   primary: primaryColor,
//   secondary: secondaryColor,
//   tertiary: tertiaryColor,
//   error: errorColor,
//   surface: surfaceColor,
// })

// Color information for display
const colorInfo = computed(() => {
  return {
    primary: generateEditorFriendlyColors(primaryColor.value),
    secondary: generateEditorFriendlyColors(secondaryColor.value),
    tertiary: generateEditorFriendlyColors(tertiaryColor.value),
    error: generateEditorFriendlyColors(errorColor.value),
  }
})

// Demo states
const showOKLCH = ref(false)
const showColorMix = ref(false)
const selectedOpacity = ref(30)
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="space-y-4">
      <h1 class="text-3xl text-surface font-bold">
        Modern Color System Demo
      </h1>
      <p class="text-surface-dimmed">
        Showcase of OKLCH color space, color-mix() functions, and modern theme switching capabilities.
      </p>
    </div>

    <!-- Theme Controls -->
    <Paper class="p-6 space-y-4">
      <h2 class="text-xl text-surface font-semibold">
        Theme Controls
      </h2>

      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex gap-2 items-center">
          <label class="text-sm text-surface font-medium">Color Scheme:</label>
          <Switch
            :model-value="scheme === 'dark'"
            @update:model-value="toggleScheme()"
          />
          <span class="text-sm text-surface-dimmed">{{ scheme }}</span>
        </div>

        <div class="flex gap-2 items-center">
          <label class="text-sm text-surface font-medium">Theme:</label>
          <select
            :value="theme"
            class="text-surface px-3 py-1 border border-surface rounded-lg bg-surface"
            @change="(e) => setTheme((e.target as HTMLSelectElement).value)"
          >
            <option
              v-for="themeOption in availableThemes"
              :key="themeOption"
              :value="themeOption"
            >
              {{ themeOption }}
            </option>
          </select>
        </div>
      </div>
    </Paper>

    <!-- Color Customization -->
    <Paper class="p-6 space-y-4">
      <h2 class="text-xl text-surface font-semibold">
        Custom Colors (OKLCH)
      </h2>

      <div class="gap-4 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2">
        <div class="space-y-2">
          <label class="text-sm text-surface font-medium">Primary</label>
          <TextField
            v-model="primaryColor"
            type="color"
            class="h-12"
          />
          <div class="text-xs text-surface-dimmed">
            OKLCH: {{ generateOKLCHString(primaryColor) }}
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm text-surface font-medium">Secondary</label>
          <TextField
            v-model="secondaryColor"
            type="color"
            class="h-12"
          />
          <div class="text-xs text-surface-dimmed">
            OKLCH: {{ generateOKLCHString(secondaryColor) }}
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm text-surface font-medium">Tertiary</label>
          <TextField
            v-model="tertiaryColor"
            type="color"
            class="h-12"
          />
          <div class="text-xs text-surface-dimmed">
            OKLCH: {{ generateOKLCHString(tertiaryColor) }}
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm text-surface font-medium">Error</label>
          <TextField
            v-model="errorColor"
            type="color"
            class="h-12"
          />
          <div class="text-xs text-surface-dimmed">
            OKLCH: {{ generateOKLCHString(errorColor) }}
          </div>
        </div>
      </div>
    </Paper>

    <!-- Color Palettes -->
    <Paper class="p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl text-surface font-semibold">
          Generated Color Palettes
        </h2>
        <Switch
          v-model="showOKLCH"
          label="Show OKLCH Values"
        />
      </div>

      <div class="space-y-6">
        <div
          v-for="(colors, colorName) in colorInfo"
          :key="colorName"
          class="space-y-2"
        >
          <h3 class="text-lg text-surface font-medium capitalize">
            {{ colorName }}
          </h3>
          <div class="gap-1 grid grid-cols-11">
            <div
              v-for="color in colors"
              :key="color.index"
              class="group border border-surface-variant rounded-lg aspect-square cursor-pointer relative"
              :style="{ backgroundColor: color.hex }"
              :title="showOKLCH ? color.oklch : color.hex"
            >
              <div class="opacity-0 flex transition-opacity items-center inset-0 justify-center absolute group-hover:opacity-100">
                <span class="text-xs text-white font-mono px-1 rounded bg-black bg-opacity-75">
                  {{ color.index }}
                </span>
              </div>
            </div>
          </div>
          <div class="text-xs text-surface-dimmed">
            Lightness range: 0 (lightest) → 10 (darkest)
          </div>
        </div>
      </div>
    </Paper>

    <!-- Color-mix() Demo -->
    <Paper class="p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl text-surface font-semibold">
          Color-mix() Transparency Demo
        </h2>
        <Switch
          v-model="showColorMix"
          label="Enable Color-mix"
        />
      </div>

      <div class="space-y-4">
        <div class="flex gap-4 items-center">
          <label class="text-sm text-surface font-medium">Opacity:</label>
          <input
            v-model="selectedOpacity"
            type="range"
            min="10"
            max="100"
            step="10"
            class="flex-1"
          >
          <span class="text-sm text-surface-dimmed w-12">{{ selectedOpacity }}%</span>
        </div>

        <div class="gap-4 grid grid-cols-2 md:grid-cols-4">
          <div class="space-y-2">
            <div class="text-sm text-surface font-medium">
              Primary
            </div>
            <div
              class="border border-surface-variant rounded-lg h-16"
              :class="showColorMix ? `bg-primary-mix-${selectedOpacity}` : ''"
              :style="!showColorMix ? { backgroundColor: `rgba(var(--r-color-primary-4), ${selectedOpacity / 100})` } : {}"
            />
            <div class="text-xs text-surface-dimmed">
              {{ showColorMix ? `bg-primary-mix-${selectedOpacity}` : `rgba() fallback` }}
            </div>
          </div>

          <div class="space-y-2">
            <div class="text-sm text-surface font-medium">
              Secondary
            </div>
            <div
              class="border border-surface-variant rounded-lg h-16"
              :class="showColorMix ? `bg-secondary-mix-${selectedOpacity}` : ''"
              :style="!showColorMix ? { backgroundColor: `rgba(var(--r-color-secondary-4), ${selectedOpacity / 100})` } : {}"
            />
            <div class="text-xs text-surface-dimmed">
              {{ showColorMix ? `bg-secondary-mix-${selectedOpacity}` : `rgba() fallback` }}
            </div>
          </div>

          <div class="space-y-2">
            <div class="text-sm text-surface font-medium">
              Tertiary
            </div>
            <div
              class="border border-surface-variant rounded-lg h-16"
              :style="{ backgroundColor: `color-mix(in oklch, var(--r-tertiary-background-color) ${selectedOpacity}%, transparent)` }"
            />
            <div class="text-xs text-surface-dimmed">
              color-mix() inline
            </div>
          </div>

          <div class="space-y-2">
            <div class="text-sm text-surface font-medium">
              Surface
            </div>
            <div
              class="border border-surface-variant rounded-lg h-16"
              :class="showColorMix ? `bg-surface-mix-${selectedOpacity}` : ''"
              :style="!showColorMix ? { backgroundColor: `rgba(var(--r-color-surface-1), ${selectedOpacity / 100})` } : {}"
            />
            <div class="text-xs text-surface-dimmed">
              {{ showColorMix ? `bg-surface-mix-${selectedOpacity}` : `rgba() fallback` }}
            </div>
          </div>
        </div>
      </div>
    </Paper>

    <!-- Component Examples -->
    <Paper class="p-6 space-y-4">
      <h2 class="text-xl text-surface font-semibold">
        Component Examples
      </h2>

      <div class="space-y-4">
        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Buttons
          </h3>
          <div class="flex gap-2">
            <Btn>Primary</Btn>
            <Btn>Secondary</Btn>
            <Btn>Tertiary</Btn>
            <Btn>Error</Btn>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Text Colors
          </h3>
          <div class="space-y-1">
            <div class="text-primary">
              Primary text color
            </div>
            <div class="text-secondary">
              Secondary text color
            </div>
            <div class="text-tertiary">
              Tertiary text color
            </div>
            <div class="text-error">
              Error text color
            </div>
            <div class="text-surface">
              Surface text color
            </div>
            <div class="text-surface-dimmed">
              Surface dimmed text color
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Background Colors
          </h3>
          <div class="gap-2 grid grid-cols-2 md:grid-cols-4">
            <div class="text-white p-4 text-center rounded-lg bg-primary">
              Primary BG
            </div>
            <div class="text-white p-4 text-center rounded-lg bg-secondary">
              Secondary BG
            </div>
            <div class="text-white p-4 text-center rounded-lg bg-tertiary">
              Tertiary BG
            </div>
            <div class="text-white p-4 text-center rounded-lg bg-error">
              Error BG
            </div>
          </div>
        </div>
      </div>
    </Paper>

    <!-- Technical Information -->
    <Paper class="p-6 space-y-4">
      <h2 class="text-xl text-surface font-semibold">
        Technical Information
      </h2>

      <div class="gap-6 grid grid-cols-1 md:grid-cols-2">
        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Features Implemented
          </h3>
          <ul class="text-sm text-surface-dimmed space-y-1">
            <li>✅ OKLCH color space for perceptual uniformity</li>
            <li>✅ color-mix() function for modern transparency</li>
            <li>✅ @layer theme for better CSS organization</li>
            <li>✅ Multi-theme support with data-theme</li>
            <li>✅ Editor-friendly color variables</li>
            <li>✅ Automatic color palette generation</li>
            <li>✅ Backward compatibility with existing API</li>
          </ul>
        </div>

        <div class="space-y-2">
          <h3 class="text-lg text-surface font-medium">
            Browser Support
          </h3>
          <ul class="text-sm text-surface-dimmed space-y-1">
            <li>🟢 color-mix(): Chrome 111+, Firefox 113+, Safari 16.2+</li>
            <li>🟢 @layer: Chrome 99+, Firefox 97+, Safari 15.4+</li>
            <li>🟢 OKLCH: Chrome 111+, Firefox 113+, Safari 15.4+</li>
            <li>🟡 Fallbacks provided for older browsers</li>
          </ul>
        </div>
      </div>
    </Paper>
  </div>
</template>
