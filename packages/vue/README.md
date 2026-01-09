# Roku UI Vue

Vue 3 component library for the Roku UI design system. Every component is written in TypeScript, themed by shared tokens, and works with UnoCSS for consistent light and dark schemes.

## Installation

```bash
pnpm add @roku-ui/vue
# Optional: enable utility classes and theme tokens
pnpm add -D unocss @roku-ui/preset
```

## UnoCSS setup (recommended)

Add the Roku preset to your UnoCSS config and enable the Vite plugin so `virtual:uno.css` is generated:

```ts
import { rokuPreset } from '@roku-ui/preset'
// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [rokuPreset()],
})
```

```ts
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), Unocss()],
})
```

If you cannot run UnoCSS, import the prebuilt styles instead:

```ts
import '@roku-ui/vue/style.css'
```

## Basic usage

Wrap your app with `RokuProvider` to supply theme values and use components with the provided tokens such as `bg-base`, `text-default`, and `border-container`.

```vue
<script setup lang="ts">
import { Btn, RokuProvider } from '@roku-ui/vue'
</script>

<template>
  <RokuProvider :theme-obj="{ colors: { primary: '#0f6bff', surface: '#121212' } }">
    <div class="text-default bg-base border-container p-6 border rounded-lg">
      <h1 class="text-2xl font-semibold mb-4">
        Roku UI Vue
      </h1>
      <Btn color="primary">
        Get started
      </Btn>
    </div>
  </RokuProvider>
</template>
```

## Nuxt integration

Use the Nuxt module to auto-register components with the `R` prefix:

```bash
pnpm add @roku-ui/nuxt @roku-ui/vue
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@roku-ui/nuxt'],
  rokuUi: {
    // Optional: customize the prefix
    prefix: 'R',
  },
})
```

## Local development

- Install dependencies: `pnpm install`
- Start the component playground: `pnpm --filter @roku-ui/vue dev`
- Build the library: `pnpm --filter @roku-ui/vue build`
- Run unit tests: `pnpm --filter @roku-ui/vue test --run`
- Lint all packages: `pnpm lint`
