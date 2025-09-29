<script setup lang="ts">
import type { AdvancedColorOptions } from '@/utils'
import { computed, ref } from 'vue'
import { Btn, Paper, Switch, TextField } from '@/components'
import {
  generateEditorFriendlyColors,
  generateOKLCHString,
  useSchemeString,
} from '@/composables'
import {

  ColorPalettePerformance,
  generateAdvancedColorPalette,
  isColorInGamut,
} from '@/utils'

// Theme management
const scheme = useSchemeString()
function toggleScheme() {
  scheme.value = scheme.value === 'light' ? 'dark' : 'light'
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.scheme = scheme.value
  }
}

// Custom color inputs
const primaryColor = ref('#0067cc')
const secondaryColor = ref('#5999A6')
const tertiaryColor = ref('#F76C22')
const errorColor = ref('#F95858')
const surfaceColor = ref('#121212')

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
    surface: generateEditorFriendlyColors(surfaceColor.value),
  }
})

// Demo states
const showOKLCH = ref(false)
const showColorMix = ref(false)
const selectedOpacity = ref(30)

// Advanced color generation settings
const colorStrategy = ref<'conservative' | 'balanced' | 'vibrant'>('balanced')
const colorPurpose = ref<'primary' | 'secondary' | 'surface' | 'accent'>('primary')
const contrastTarget = ref<'AA' | 'AAA' | 'none'>('AA')
const selectedGamut = ref<'srgb' | 'p3' | 'rec2020'>('srgb')
const backgroundLightness = ref(95)

// Advanced color analysis
const advancedColorInfo = computed(() => {
  const options: AdvancedColorOptions = {
    strategy: colorStrategy.value,
    purpose: colorPurpose.value,
    contrastTarget: contrastTarget.value,
    gamut: selectedGamut.value,
    backgroundLightness: backgroundLightness.value / 100,
    enableAnalysis: true,
  }

  return {
    primary: generateAdvancedColorPalette(primaryColor.value, options),
    secondary: generateAdvancedColorPalette(secondaryColor.value, { ...options, purpose: 'secondary' }),
    tertiary: generateAdvancedColorPalette(tertiaryColor.value, { ...options, purpose: 'accent' }),
    error: generateAdvancedColorPalette(errorColor.value, options),
    surface: generateAdvancedColorPalette(surfaceColor.value, { ...options, purpose: 'surface' }),
  }
})

// Performance stats
const performanceStats = computed(() => ColorPalettePerformance.getCacheStats())

// Gamut validation
const gamutValidation = computed(() => {
  const colors = [
    primaryColor.value,
    secondaryColor.value,
    tertiaryColor.value,
    errorColor.value,
    surfaceColor.value,
  ]

  return colors.map((color, index) => ({
    color,
    name: ['Primary', 'Secondary', 'Tertiary', 'Error', 'Surface'][index],
    srgb: isColorInGamut(color, 'srgb'),
    p3: isColorInGamut(color, 'p3'),
    rec2020: isColorInGamut(color, 'rec2020'),
  }))
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="space-y-4">
      <h1 class="text-3xl text-surface font-bold">
        Enhanced Color System Demo
      </h1>
      <p class="text-surface-dimmed">
        Showcasing advanced OKLCH color generation with scientific algorithms, contrast awareness, gamut validation, and adaptive strategies.
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
      </div>
    </Paper>

    <!-- Color Customization -->
    <Paper class="p-6 space-y-4">
      <h2 class="text-xl text-surface font-semibold">
        Custom Colors (OKLCH)
      </h2>

      <div class="gap-4 grid grid-cols-1 lg:grid-cols-5 md:grid-cols-2">
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

        <div class="space-y-2">
          <label class="text-sm text-surface font-medium">Surface</label>
          <TextField
            v-model="surfaceColor"
            type="color"
            class="h-12"
          />
          <div class="text-xs text-surface-dimmed">
            OKLCH: {{ generateOKLCHString(surfaceColor) }}
          </div>
        </div>
      </div>
    </Paper>

    <!-- Advanced Color Generation Settings -->
    <Paper class="p-6 space-y-4">
      <h2 class="text-xl text-surface font-semibold">
        Advanced Generation Settings
      </h2>

      <div class="gap-4 grid grid-cols-1 lg:grid-cols-5 md:grid-cols-3">
        <div class="space-y-2">
          <label class="text-sm text-surface font-medium">Strategy</label>
          <select
            v-model="colorStrategy"
            class="text-surface px-3 py-2 border border-surface rounded-lg bg-surface w-full"
          >
            <option value="conservative">
              Conservative
            </option>
            <option value="balanced">
              Balanced
            </option>
            <option value="vibrant">
              Vibrant
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-sm text-surface font-medium">Purpose</label>
          <select
            v-model="colorPurpose"
            class="text-surface px-3 py-2 border border-surface rounded-lg bg-surface w-full"
          >
            <option value="primary">
              Primary
            </option>
            <option value="secondary">
              Secondary
            </option>
            <option value="accent">
              Accent
            </option>
            <option value="surface">
              Surface
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-sm text-surface font-medium">Contrast</label>
          <select
            v-model="contrastTarget"
            class="text-surface px-3 py-2 border border-surface rounded-lg bg-surface w-full"
          >
            <option value="none">
              None
            </option>
            <option value="AA">
              AA (4.5:1)
            </option>
            <option value="AAA">
              AAA (7:1)
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-sm text-surface font-medium">Gamut</label>
          <select
            v-model="selectedGamut"
            class="text-surface px-3 py-2 border border-surface rounded-lg bg-surface w-full"
          >
            <option value="srgb">
              sRGB
            </option>
            <option value="p3">
              Display P3
            </option>
            <option value="rec2020">
              Rec 2020
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-sm text-surface font-medium">Background Lightness</label>
          <input
            v-model="backgroundLightness"
            type="range"
            min="0"
            max="100"
            class="w-full"
          >
          <div class="text-xs text-surface-dimmed text-center">
            {{ backgroundLightness }}%
          </div>
        </div>
      </div>
    </Paper>

    <!-- Gamut Validation -->
    <Paper class="p-6 space-y-4">
      <h2 class="text-xl text-surface font-semibold">
        Color Gamut Validation
      </h2>

      <div class="gap-4 grid grid-cols-1 lg:grid-cols-5 md:grid-cols-3">
        <div
          v-for="validation in gamutValidation"
          :key="validation.name"
          class="space-y-2"
        >
          <div class="flex gap-2 items-center">
            <div
              class="border-surface-variant border rounded h-6 w-6"
              :style="{ backgroundColor: validation.color }"
            />
            <span class="text-sm text-surface font-medium">{{ validation.name }}</span>
          </div>

          <div class="text-xs space-y-1">
            <div class="flex items-center justify-between">
              <span>sRGB:</span>
              <span :class="validation.srgb ? 'text-green-600' : 'text-red-600'">
                {{ validation.srgb ? '✓' : '✗' }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span>P3:</span>
              <span :class="validation.p3 ? 'text-green-600' : 'text-red-600'">
                {{ validation.p3 ? '✓' : '✗' }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span>Rec2020:</span>
              <span :class="validation.rec2020 ? 'text-green-600' : 'text-red-600'">
                {{ validation.rec2020 ? '✓' : '✗' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Paper>

    <!-- Performance Stats -->
    <Paper class="p-6 space-y-4">
      <h2 class="text-xl text-surface font-semibold">
        Performance & Caching
      </h2>

      <div class="gap-4 grid grid-cols-1 md:grid-cols-3">
        <div class="space-y-2">
          <div class="text-sm text-surface font-medium">
            Cache Usage
          </div>
          <div class="text-2xl text-primary font-bold">
            {{ performanceStats.size }} / {{ performanceStats.maxSize }}
          </div>
          <div class="text-xs text-surface-dimmed">
            Cached results
          </div>
        </div>

        <div class="space-y-2">
          <div class="text-sm text-surface font-medium">
            Hit Rate
          </div>
          <div class="text-2xl text-secondary font-bold">
            {{ performanceStats.hitRate }}%
          </div>
          <div class="text-xs text-surface-dimmed">
            Cache efficiency
          </div>
        </div>

        <div class="space-y-2">
          <div class="text-sm text-surface font-medium">
            Actions
          </div>
          <div class="space-y-2">
            <Btn
              size="sm"
              @click="ColorPalettePerformance.clearCache()"
            >
              Clear Cache
            </Btn>
            <Btn
              size="sm"
              @click="ColorPalettePerformance.precomputePalettes([primaryColor, secondaryColor, tertiaryColor, errorColor, surfaceColor])"
            >
              Precompute
            </Btn>
          </div>
        </div>
      </div>
    </Paper>

    <!-- Enhanced Color Palettes -->
    <Paper class="p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl text-surface font-semibold">
          Enhanced Color Palettes
        </h2>
        <Switch
          v-model="showOKLCH"
          label="Show OKLCH Values"
        />
      </div>

      <div class="space-y-6">
        <div
          v-for="(paletteResult, colorName) in advancedColorInfo"
          :key="colorName"
          class="space-y-4"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-lg text-surface font-medium capitalize">
              {{ colorName }}
            </h3>
            <div class="text-xs text-surface-dimmed">
              Strategy: {{ paletteResult.metadata.strategy }} |
              Gamut: {{ paletteResult.metadata.gamut }} |
              Contrast: {{ paletteResult.metadata.contrastTarget }}
            </div>
          </div>

          <!-- Main palette -->
          <div class="gap-1 grid grid-cols-11">
            <div
              v-for="(color, index) in paletteResult.colors"
              :key="index"
              class="group border-surface-variant border rounded-lg aspect-square cursor-pointer relative"
              :style="{ backgroundColor: color }"
              :title="color"
            >
              <div class="opacity-0 flex transition-opacity items-center inset-0 justify-center absolute group-hover:opacity-100">
                <span class="text-xs text-white font-mono px-1 rounded bg-black bg-opacity-75">
                  {{ index }}
                </span>
              </div>
            </div>
          </div>

          <!-- Alternative strategies -->
          <div
            v-if="paletteResult.alternatives"
            class="space-y-2"
          >
            <div class="text-sm text-surface font-medium">
              Alternative Strategies:
            </div>
            <div class="space-y-2">
              <div
                v-for="(altColors, strategyName) in paletteResult.alternatives"
                :key="strategyName"
                class="space-y-1"
              >
                <div class="text-xs text-surface-dimmed capitalize">
                  {{ strategyName }}:
                </div>
                <div class="gap-1 grid grid-cols-11">
                  <div
                    v-for="(color, index) in altColors"
                    :key="index"
                    class="border-surface-variant border rounded h-6"
                    :style="{ backgroundColor: color }"
                    :title="color"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Gamut analysis -->
          <div
            v-if="paletteResult.metadata.gamutAnalysis"
            class="text-xs text-surface-dimmed space-y-1"
          >
            <div>
              Gamut Coverage:
              sRGB {{ Math.round(paletteResult.metadata.gamutAnalysis.srgbCoverage) }}% |
              P3 {{ Math.round(paletteResult.metadata.gamutAnalysis.p3Coverage) }}% |
              Rec2020 {{ Math.round(paletteResult.metadata.gamutAnalysis.rec2020Coverage) }}%
            </div>
            <div v-if="paletteResult.metadata.gamutAnalysis.outOfGamutColors.length > 0">
              Out-of-gamut colors: {{ paletteResult.metadata.gamutAnalysis.outOfGamutColors.length }}
            </div>
          </div>
        </div>
      </div>
    </Paper>

    <!-- Legacy Color Palettes -->
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
              class="group border-surface-variant border rounded-lg aspect-square cursor-pointer relative"
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
              class="border-surface-variant border rounded-lg h-16"
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
              class="border-surface-variant border rounded-lg h-16"
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
              class="border-surface-variant border rounded-lg h-16"
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
              class="border-surface-variant border rounded-lg h-16"
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
            Enhanced Features Implemented
          </h3>
          <ul class="text-sm text-surface-dimmed space-y-1">
            <li>✅ Scientific perceptual chroma curves</li>
            <li>✅ WCAG contrast-aware color generation</li>
            <li>✅ Adaptive lightness mapping strategies</li>
            <li>✅ Multi-gamut support (sRGB/P3/Rec2020)</li>
            <li>✅ Hue-specific color adjustments</li>
            <li>✅ Performance caching with LRU strategy</li>
            <li>✅ Real-time gamut validation</li>
            <li>✅ Alternative generation strategies</li>
            <li>✅ Purpose-driven color optimization</li>
            <li>✅ Advanced API with full type safety</li>
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
